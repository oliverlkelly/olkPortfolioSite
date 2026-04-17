import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDb } from './db';
import projectsRouter   from './routes/projects';
import experienceRouter from './routes/experience';
import educationRouter  from './routes/education';
import profileRouter    from './routes/profile';
import contactRouter    from './routes/contact';
import adminRouter      from './routes/admin';
import { rateLimit, validateContentType } from './middleware/rateLimit';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '64kb' }));
app.use(validateContentType);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/projects',   projectsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/education',  educationRouter);
app.use('/api/profile',    profileRouter);
app.use('/api/contact',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 10, message: 'Too many messages. Please wait.' }),
  contactRouter
);
app.use('/api/admin', adminRouter);

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

async function main() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 Portfolio API running at http://localhost:${PORT}`);
      console.log(`   Admin password: ${process.env.ADMIN_PASSWORD ?? 'portfolio-admin'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
main();
