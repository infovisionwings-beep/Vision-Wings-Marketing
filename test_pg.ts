import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

async function test() {
  try {
    const res = await pool.query('select 1 as success');
    console.log(res.rows);
    process.exit(0);
  } catch(e) {
    console.error('INNER ERROR:', e);
    process.exit(1);
  }
}
test();
