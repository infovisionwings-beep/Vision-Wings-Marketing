import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const url = "postgresql://neondb_owner:npg_dDLyS6VoT2uF@ep-falling-darkness-39357297.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(url);
const db = drizzle(sql);

async function check() {
  try {
    console.log("Connecting to falling-darkness...");
    await db.execute('select 1');
    console.log("SUCCESS!");
  } catch (e: any) {
    console.error("FAILED!");
    console.error("Message:", e?.message || e);
    if (e?.cause) {
      console.error("Cause:", e.cause);
    }
  }
}
check();
