async function checkFetchNoC5() {
  try {
    console.log("Testing fetch to WITHOUT .c-5...");
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.DATABASE_URL) {
      headers['Neon-Connection-String'] = process.env.DATABASE_URL;
    }
    const res = await fetch('https://ep-polished-forest-ay8a4hro.us-east-2.aws.neon.tech/sql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: 'select 1 as x' })
    });
    console.log(res.status, await res.text());
  } catch(e: any) {
    console.log("Fetch failed:", e?.message || e);
  }
}
require('dotenv').config({ path: '.env.local' });
checkFetchNoC5();
