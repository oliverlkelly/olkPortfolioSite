import { Router, Request, Response } from 'express';
import pool from '../db';
import { adminLogin, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/admin/login
router.post('/login', adminLogin);

// All routes below require auth
router.use(requireAdmin);

// ─── Profile ────────────────────────────────────────────────────────────────

router.put('/profile', async (req: Request, res: Response) => {
  const { name, title, bio, email, github_url, linkedin_url, twitter_url,
          website_url, avatar_url, location, skills, resume_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE profile SET
        name=$1, title=$2, bio=$3, email=$4,
        github_url=$5, linkedin_url=$6, twitter_url=$7,
        website_url=$8, avatar_url=$9, location=$10,
        skills=$11, resume_url=$12, updated_at=NOW()
       WHERE id=(SELECT id FROM profile LIMIT 1)
       RETURNING *`,
      [name, title, bio, email, github_url, linkedin_url, twitter_url,
       website_url, avatar_url, location, skills, resume_url]
    );
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── Projects ────────────────────────────────────────────────────────────────

router.get('/projects', async (_req, res) => {
  const result = await pool.query('SELECT * FROM projects ORDER BY display_order ASC');
  res.json({ data: result.rows });
});

router.post('/projects', async (req: Request, res: Response) => {
  const { title, description, long_description, tech_stack, github_url,
          live_url, image_url, featured, display_order, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects
        (title, description, long_description, tech_stack, github_url,
         live_url, image_url, featured, display_order, start_date, end_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [title, description, long_description, tech_stack ?? [], github_url,
       live_url, image_url, featured ?? false, display_order ?? 0, start_date, end_date]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', async (req: Request, res: Response) => {
  const { title, description, long_description, tech_stack, github_url,
          live_url, image_url, featured, display_order, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET
        title=$1, description=$2, long_description=$3, tech_stack=$4,
        github_url=$5, live_url=$6, image_url=$7, featured=$8,
        display_order=$9, start_date=$10, end_date=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [title, description, long_description, tech_stack ?? [], github_url,
       live_url, image_url, featured ?? false, display_order ?? 0,
       start_date, end_date, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ data: { deleted: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── Experience ──────────────────────────────────────────────────────────────

router.get('/experience', async (_req, res) => {
  const result = await pool.query('SELECT * FROM experience ORDER BY display_order ASC');
  res.json({ data: result.rows });
});

router.post('/experience', async (req: Request, res: Response) => {
  const { company, role, location, employment_type, description, achievements,
          tech_stack, start_date, end_date, is_current, company_url,
          company_logo_url, display_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO experience
        (company, role, location, employment_type, description, achievements,
         tech_stack, start_date, end_date, is_current, company_url,
         company_logo_url, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [company, role, location, employment_type ?? 'Full-time', description,
       achievements ?? [], tech_stack ?? [], start_date, end_date,
       is_current ?? false, company_url, company_logo_url, display_order ?? 0]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experience/:id', async (req: Request, res: Response) => {
  const { company, role, location, employment_type, description, achievements,
          tech_stack, start_date, end_date, is_current, company_url,
          company_logo_url, display_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE experience SET
        company=$1, role=$2, location=$3, employment_type=$4, description=$5,
        achievements=$6, tech_stack=$7, start_date=$8, end_date=$9,
        is_current=$10, company_url=$11, company_logo_url=$12,
        display_order=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [company, role, location, employment_type, description,
       achievements ?? [], tech_stack ?? [], start_date, end_date,
       is_current ?? false, company_url, company_logo_url,
       display_order ?? 0, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM experience WHERE id=$1', [req.params.id]);
    res.json({ data: { deleted: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ─── Education ───────────────────────────────────────────────────────────────

router.get('/education', async (_req, res) => {
  const result = await pool.query('SELECT * FROM education ORDER BY display_order ASC');
  res.json({ data: result.rows });
});

router.post('/education', async (req: Request, res: Response) => {
  const { institution, degree, field_of_study, location, description, achievements,
          grade, start_date, end_date, is_current, institution_url,
          institution_logo_url, display_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO education
        (institution, degree, field_of_study, location, description, achievements,
         grade, start_date, end_date, is_current, institution_url,
         institution_logo_url, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [institution, degree, field_of_study, location, description,
       achievements ?? [], grade, start_date, end_date,
       is_current ?? false, institution_url, institution_logo_url, display_order ?? 0]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create education' });
  }
});

router.put('/education/:id', async (req: Request, res: Response) => {
  const { institution, degree, field_of_study, location, description, achievements,
          grade, start_date, end_date, is_current, institution_url,
          institution_logo_url, display_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE education SET
        institution=$1, degree=$2, field_of_study=$3, location=$4, description=$5,
        achievements=$6, grade=$7, start_date=$8, end_date=$9,
        is_current=$10, institution_url=$11, institution_logo_url=$12,
        display_order=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [institution, degree, field_of_study, location, description,
       achievements ?? [], grade, start_date, end_date,
       is_current ?? false, institution_url, institution_logo_url,
       display_order ?? 0, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update education' });
  }
});

router.delete('/education/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM education WHERE id=$1', [req.params.id]);
    res.json({ data: { deleted: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

export default router;
