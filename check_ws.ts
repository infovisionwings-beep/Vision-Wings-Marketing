import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

neonConfig.webSocketConstructor = ws;

async function check() {
  try {
    console.log("Connecting to:", process.env.DATABASE_URL);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);
    await db.execute('select 1');
    console.log("SUCCESS! Database is reachable via WebSocket.");
  } catch(e) {
    console.error("FAILED WebSocket!");
    console.error("Message:", e.message);
  }
}
check();
