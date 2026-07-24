import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const { getProjects } = await import('./app/actions/projects');
  try {
    const data = await getProjects();
    console.log('SUCCESS:', data);
  } catch (e: any) {
    console.error('ERROR MESSAGE:', e?.message || e);
    if (e?.cause) {
      console.error('ERROR CAUSE:', e.cause);
    } else {
      console.error('RAW ERROR:', e);
    }
  }
}
test();
