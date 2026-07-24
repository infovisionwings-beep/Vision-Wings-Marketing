async function wakeUp() {
  console.log("Waking up...");
  try {
    const res = await fetch('https://ep-polished-forest-ay8a4hro-pooler.c-5.us-east-2.aws.neon.tech/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'select 1' })
    });
    console.log(res.status, await res.text());
  } catch(e: any) {
    console.log("Fetch failed:", e?.message || e);
  }
}
wakeUp();
