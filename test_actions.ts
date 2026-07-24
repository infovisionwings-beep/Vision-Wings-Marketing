import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const { getProjects } = await import('./app/actions/projects.ts');
  try {
    const data = await getProjects();
    console.log('SUCCESS:', data);
  } catch (e) {
    console.error('ERROR MESSAGE:', e.message);
    if (e.cause) {
      console.error('ERROR CAUSE:', e.cause);
    } else {
      console.error('RAW ERROR:', e);
    }
  }
}
test();
