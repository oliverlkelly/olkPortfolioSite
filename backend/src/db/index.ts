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
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const seedPath = path.join(__dirname, 'seed.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        const seed = fs.readFileSync(seedPath, 'utf-8');
        
        await client.query(schema);
        console.log('✅ Database schema initialised');
        
        await client.query(seed);
        console.log('✅ Database seeded');
        
        return;
      } finally {
        client.release();
      }
    } catch (err) {
      retries -= 1;
      console.log(`⏳ Waiting for database... (${retries} retries left)`);
      if (retries === 0) throw err;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

export default pool;
