import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function check() {
  try {
    console.log("Connecting to:", process.env.DATABASE_URL);
    await db.execute('select * from projects');
    console.log("SUCCESS! Table exists and is accessible.");
  } catch(e) {
    console.error("FAILED!");
    console.error("Message:", e.message);
    if (e.cause) {
      console.error("Cause:", e.cause);
    }
  }
}
check();
