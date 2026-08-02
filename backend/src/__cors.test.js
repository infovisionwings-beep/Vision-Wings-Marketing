// Self-check for the CORS allowlist in backend/src/index.ts.
// Mirrors parseAllowedOrigins() so the actual bug reported in production
// (FRONTEND_URL had the wrong scheme) and its fix (www/bare host variants) both
// have a regression test that doesn't require booting Express.
// Run: node backend/src/__cors.test.js
const assert = require('assert');

function parseAllowedOrigins(raw) {
  const origins = new Set();
  for (const part of (raw || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const normalized = part.replace(/\/+$/, '');
    origins.add(normalized);
    try {
      const url = new URL(normalized);
      const swapped = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
      origins.add(`${url.protocol}//${swapped}${url.port ? `:${url.port}` : ''}`);
    } catch {
      // not a parseable absolute URL
    }
  }
  return origins;
}

const allowed = (raw, origin) => {
  const set = parseAllowedOrigins(raw);
  if (!origin) return true;
  if (set.size === 0) return true;
  return set.has(origin);
};

// The reported bug: FRONTEND_URL was missing the "s" in https. A scheme
// mismatch must still be rejected — this fix does not paper over that, only
// the www/bare-domain variant.
assert.ok(!allowed("http://www.visionwingsmarketing.com", "https://www.visionwingsmarketing.com"),
  "scheme mismatch must still be rejected");

// What the fix actually buys: whichever host variant is configured, the other
// is accepted too, so that class of typo can't happen again.
assert.ok(allowed("https://www.visionwingsmarketing.com", "https://www.visionwingsmarketing.com"));
assert.ok(allowed("https://www.visionwingsmarketing.com", "https://visionwingsmarketing.com"),
  "bare domain must be accepted when www is configured");
assert.ok(allowed("https://visionwingsmarketing.com", "https://www.visionwingsmarketing.com"),
  "www must be accepted when the bare domain is configured");

// A completely different origin must never pass.
assert.ok(!allowed("https://www.visionwingsmarketing.com", "https://evil.com"));

// Trailing slashes in the env var must not create a spurious mismatch.
assert.ok(allowed("https://www.visionwingsmarketing.com/", "https://www.visionwingsmarketing.com"));

// Multiple comma-separated origins, e.g. production + a Vercel preview URL.
assert.ok(allowed("https://a.com,https://b.com", "https://b.com"));
assert.ok(!allowed("https://a.com,https://b.com", "https://c.com"));

// No Origin header (curl, health checks, server-to-server) is never subject to
// this check regardless of what is configured.
assert.ok(allowed("https://www.visionwingsmarketing.com", undefined));
assert.ok(allowed("https://www.visionwingsmarketing.com", ""));

// Unset FRONTEND_URL preserves the old fallback's intent (allow everything),
// now via a reflected origin instead of a literal '*' that credentials:true
// makes browsers reject outright.
assert.ok(allowed(undefined, "https://anything.example"));
assert.ok(allowed("", "https://anything.example"));

console.log("CORS allowlist: all assertions passed");
