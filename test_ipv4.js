import { neon, neonConfig } from '@neondatabase/serverless';
import https from 'https';
import nodeFetch from 'node-fetch';

const agent = new https.Agent({ family: 4 }); // Force IPv4

// Overwrite the default fetch implementation
neonConfig.fetchConnectionCache = true;
neonConfig.fetchFunction = (url, options) => {
  return nodeFetch(url, { ...options, agent });
};

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_lTImxCR0bQg2@ep-dry-sky-auq2rmju-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const res = await sql`SELECT 1 as res`;
    console.log('SUCCESS:', res);
  } catch (e) {
    console.error('FAILED:', e);
  } finally {
    process.exit(0);
  }
}
test();
