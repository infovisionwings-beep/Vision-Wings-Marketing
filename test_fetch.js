async function test() {
  try {
    const res = await fetch('https://ep-dry-sky-auq2rmju.apirest.c-10.us-east-1.aws.neon.tech/neondb/rest/v1');
    console.log('SUCCESS:', res.status);
  } catch (e) {
    console.error('FAILED:', e.message);
  }
}
test();
