import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_lTImxCR0bQg2@ep-dry-sky-auq2rmju-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require';
console.log('Connecting to:', connectionString);
const client = postgres(connectionString);
const db = drizzle(client);

async function check() {
  try {
    const result = await db.execute('select 1');
    console.log('SUCCESS:', result);
  } catch (e) {
    console.error('FAILED:', e);
  } finally {
    process.exit(0);
  }
}
check();
