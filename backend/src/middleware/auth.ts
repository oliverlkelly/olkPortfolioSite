import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

// ─── Lightweight JWT-like token (HMAC-SHA256 signed) ─────────────────────────
// For production, consider using the `jsonwebtoken` package instead.

const SECRET = process.env.ADMIN_SECRET ?? 'change-me-in-production-please';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function sign(payload: object): string {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body    = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig     = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verify(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as Record<string, unknown>;
    if (typeof payload.exp === 'number' && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// POST /api/admin/login  { password: string }
export function adminLogin(req: Request, res: Response) {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'portfolio-admin';

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = sign({ role: 'admin', exp: Date.now() + TOKEN_TTL_MS });
  res.json({ data: { token } });
}

// Middleware — protect admin routes
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const payload = token ? verify(token) : null;

  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorised — valid admin token required' });
  }
  next();
}
