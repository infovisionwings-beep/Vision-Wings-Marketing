import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function check() {
  try {
    const res = await db.execute('SELECT 1');
    console.log('SUCCESS:', res);
  } catch (e) {
    console.error('FAILED:', e);
  }
}
check();
