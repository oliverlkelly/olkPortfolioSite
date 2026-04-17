import { Router, Request, Response } from 'express';
import pool from '../db';
import { Profile, ApiResponse } from '../types';

const router = Router();

// GET /api/profile
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Profile>(
      'SELECT * FROM profile LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Profile not found' });
    }
    const response: ApiResponse<Profile> = { data: result.rows[0] };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, error: 'Failed to fetch profile' });
  }
});

export default router;
