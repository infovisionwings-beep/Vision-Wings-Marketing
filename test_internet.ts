async function check() {
  try {
    const res = await fetch('https://www.google.com');
    console.log("Google:", res.status);
    const res2 = await fetch('https://api.github.com');
    console.log("GitHub:", res2.status);
  } catch(e) {
    console.error("FAILED!", e.message);
  }
}
check();
