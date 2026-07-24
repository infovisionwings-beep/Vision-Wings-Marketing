import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function test() {
  try {
    const res = await db.execute('select * from projects');
    console.log(res);
  } catch(e) {
    console.error('INNER ERROR:', e);
  }
}
test();
