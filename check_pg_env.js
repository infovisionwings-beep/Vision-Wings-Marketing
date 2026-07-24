import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
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
