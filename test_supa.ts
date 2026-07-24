async function checkSupa() {
  try {
    const res = await fetch('https://supabase.com');
    console.log("Supabase:", res.status);
  } catch(e: any) {
    console.error("FAILED Supabase!", e?.message || e);
  }
}
checkSupa();
