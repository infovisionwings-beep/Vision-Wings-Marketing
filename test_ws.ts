import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function test() {
  try {
    const res = await db.execute('select 1 as success');
    console.log(res.rows);
    process.exit(0);
  } catch(e) {
    console.error('INNER ERROR:', e);
    process.exit(1);
  }
}
test();
