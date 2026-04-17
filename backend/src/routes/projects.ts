import { Router, Request, Response } from 'express';
import pool from '../db';
import { Project, ApiResponse } from '../types';

const router = Router();

// GET /api/projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Project>(
      'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
    );
    const response: ApiResponse<Project[]> = { data: result.rows };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: [], error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/featured
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Project>(
      'SELECT * FROM projects WHERE featured = true ORDER BY display_order ASC'
    );
    const response: ApiResponse<Project[]> = { data: result.rows };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: [], error: 'Failed to fetch featured projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Project>(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Project not found' });
    }
    const response: ApiResponse<Project> = { data: result.rows[0] };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, error: 'Failed to fetch project' });
  }
});

export default router;
