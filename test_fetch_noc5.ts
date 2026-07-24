async function check() {
  try {
    console.log("Testing fetch to WITHOUT .c-5...");
    const res = await fetch('https://ep-polished-forest-ay8a4hro.us-east-2.aws.neon.tech/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Neon-Connection-String': process.env.DATABASE_URL },
      body: JSON.stringify({ query: 'select 1 as x' })
    });
    console.log(res.status, await res.text());
  } catch(e) {
    console.log("Fetch failed:", e.message);
  }
}
require('dotenv').config({ path: '.env.local' });
check();
