import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://portfolio:portfolio@localhost:5432/portfolio',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schema);
    console.log('✅ Database schema initialised');
  } finally {
    client.release();
  }
}

export default pool;
