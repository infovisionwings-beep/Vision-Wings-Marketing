import { db } from '@/db';
import { projects } from '@/db/schema';
import { getProjects } from '@/app/actions/projects';

async function test() {
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
