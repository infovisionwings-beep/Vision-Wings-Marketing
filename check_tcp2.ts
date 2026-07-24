import { Pool } from 'pg';

async function check() {
  try {
    const url = "postgresql://neondb_owner:npg_dDLyS6VoT2uF@ep-polished-forest-ay8a4hro-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
    console.log("Connecting to:", url);
    const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 5000 });
    const client = await pool.connect();
    const res = await client.query('select 1');
    client.release();
    console.log("SUCCESS! Database is reachable via standard TCP (pg) WITHOUT .c-5");
  } catch (e: any) {
    console.error("FAILED TCP!");
    console.error("Message:", e?.message || e);
  }
}
check();
