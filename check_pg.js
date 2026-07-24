import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_lTImxCR0bQg2@ep-dry-sky-auq2rmju-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require';
console.log('Connecting to:', connectionString);

const pool = new Pool({ connectionString });

async function check() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT 1 as result');
    console.log('SUCCESS:', res.rows);
    client.release();
  } catch (e) {
    console.error('FAILED:', e);
  } finally {
    await pool.end();
    process.exit(0);
  }
}
check();
