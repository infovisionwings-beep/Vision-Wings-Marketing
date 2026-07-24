import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  try {
    console.log("Connecting to:", process.env.DATABASE_URL);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
    const client = await pool.connect();
    const res = await client.query('select 1');
    client.release();
    console.log("SUCCESS! Database is reachable via standard TCP (pg).");
  } catch (e: any) {
    console.error("FAILED!");
    console.error("Message:", e?.message || e);
    if (e?.cause) {
      console.error("Cause:", e.cause);
    }
  }
}
check();
