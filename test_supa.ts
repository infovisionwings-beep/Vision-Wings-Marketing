async function check() {
  try {
    const res = await fetch('https://supabase.com');
    console.log("Supabase:", res.status);
  } catch(e) {
    console.error("FAILED Supabase!", e.message);
  }
}
check();
