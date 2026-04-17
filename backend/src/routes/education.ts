import { Router, Request, Response } from 'express';
import pool from '../db';
import { Education, ApiResponse } from '../types';

const router = Router();

// GET /api/education
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Education>(
      'SELECT * FROM education ORDER BY display_order ASC, start_date DESC'
    );
    const response: ApiResponse<Education[]> = { data: result.rows };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: [], error: 'Failed to fetch education' });
  }
});

export default router;
