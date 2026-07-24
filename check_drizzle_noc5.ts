import dns from 'dns/promises';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

async function check() {
  try {
    const url = "postgresql://neondb_owner:npg_dDLyS6VoT2uF@ep-polished-forest-ay8a4hro-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
    console.log("Testing with URL:", url);
    const sql = neon(url);
    const db = drizzle(sql);
    await db.execute('select 1');
    console.log("SUCCESS!");
  } catch(e) {
    console.error("FAILED!");
    console.error("Message:", e.message);
  }
}
check();
