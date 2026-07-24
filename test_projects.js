import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function check() {
  try {
    const res = await db.execute('SELECT * FROM projects LIMIT 1');
    console.log('SUCCESS PROJECTS:', res.rows);
  } catch (e) {
    console.error('FAILED PROJECTS:', e.message);
  }
}
check();
