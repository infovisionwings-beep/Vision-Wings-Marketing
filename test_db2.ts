import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Try with non-pooler URL
const sql = neon('postgresql://neondb_owner:npg_dDLyS6VoT2uF@ep-polished-forest-ay8a4hro.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require');
const db = drizzle(sql);

async function test() {
  try {
    const res = await db.execute('select 1 as success');
    console.log(res);
  } catch(e) {
    console.error('INNER ERROR:', e);
  }
}
test();
