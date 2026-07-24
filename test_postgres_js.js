import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_lTImxCR0bQg2@ep-dry-sky-auq2rmju.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require';
const client = postgres(connectionString);

async function check() {
  try {
    console.log('Testing postgres.js...');
    const result = await clientselect 1 as r;
    console.log('SUCCESS postgres.js:', result);
  } catch (e) {
    console.error('FAILED postgres.js:', e.message);
  } finally {
    process.exit(0);
  }
}
check();
