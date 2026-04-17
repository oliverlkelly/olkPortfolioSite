import { Router, Request, Response } from 'express';
import pool from '../db';
import { Experience, ApiResponse } from '../types';

const router = Router();

// GET /api/experience
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Experience>(
      'SELECT * FROM experience ORDER BY display_order ASC, start_date DESC'
    );
    const response: ApiResponse<Experience[]> = { data: result.rows };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: [], error: 'Failed to fetch experience' });
  }
});

// GET /api/experience/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Experience>(
      'SELECT * FROM experience WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Experience not found' });
    }
    const response: ApiResponse<Experience> = { data: result.rows[0] };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, error: 'Failed to fetch experience' });
  }
});

export default router;
