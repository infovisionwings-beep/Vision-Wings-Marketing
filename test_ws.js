import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_lTImxCR0bQg2@ep-dry-sky-auq2rmju-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const res = await sqlSELECT 1 as res;
    console.log('SUCCESS:', res);
  } catch (e) {
    console.error('FAILED:', e);
  } finally {
    process.exit(0);
  }
}
test();
