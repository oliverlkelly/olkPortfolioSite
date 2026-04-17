import { Request, Response, NextFunction } from 'express';

// ─── Simple in-memory rate limiter ─────────────────────────────────────────
// For production, replace with redis-based limiter (e.g. rate-limiter-flexible)

interface RateLimitEntry {
  count:     number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(opts: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = opts;

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetTime) store.delete(key);
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip  = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
              ?? req.socket.remoteAddress
              ?? 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const entry = store.get(key);
    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetTime - now) / 1000));
      return res.status(429).json({ error: message });
    }
    next();
  };
}

// ─── Request body size guard ─────────────────────────────────────────────────
export function validateContentType(req: Request, res: Response, next: NextFunction) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] ?? '';
    if (!ct.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
}
