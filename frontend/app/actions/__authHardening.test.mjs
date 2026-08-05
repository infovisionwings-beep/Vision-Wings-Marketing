// Self-check for the signup/OTP and admin idle-timeout hardening.
// Mirrors the pattern in __projectsAndLogosLifecycle.test.mjs: model the logic,
// then assert the source still carries the guard so a refactor cannot drop it
// silently.
// Run: node frontend/app/actions/__authHardening.test.mjs
import assert from "node:assert";
import { readFileSync, readdirSync } from "node:fs";

const authSrc = readFileSync(new URL("./auth.ts", import.meta.url), "utf8");
const adminAuthSrc = readFileSync(new URL("./adminAuth.ts", import.meta.url), "utf8");
const rbacSrc = readFileSync(new URL("../../lib/auth/rbac.ts", import.meta.url), "utf8");
const proxySrc = readFileSync(new URL("../../proxy.ts", import.meta.url), "utf8");

// ── OTP comparison ────────────────────────────────────────────────────────
// Mirrors otpMatches(): equal-length, constant-time, no early return on the
// first differing character.
const otpMatches = (expected, provided) => {
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
};

assert.ok(otpMatches("123456", "123456"), "the issued code must verify");
assert.ok(!otpMatches("123456", "123457"), "a code off by one digit must fail");
assert.ok(!otpMatches("123456", "12345"), "a short code must fail, not throw");
assert.ok(!otpMatches("123456", ""), "an empty code must fail");
assert.ok(!otpMatches("123456", "1234567"), "a long code must fail");

// ── OTP shape ─────────────────────────────────────────────────────────────
// Mirrors generateOtp(): always six digits, never 5 or 7, never leading-zero
// truncated. The modulo bias here is negligible against 2^32.
const generateOtp = (raw) => String((raw % 900000) + 100000);
for (const raw of [0, 1, 899999, 900000, 4294967295, 123456789]) {
  const otp = generateOtp(raw);
  assert.match(otp, /^\d{6}$/, `raw ${raw} must produce exactly six digits, got ${otp}`);
}

// The submitted code is shape-checked before any database work.
assert.ok(
  /\/\^\\d\{6\}\$\/\.test\(otp\)/.test(authSrc),
  "verifySignupOtp must reject anything that is not six digits up front"
);

// ── OTP cannot be brute-forced or aimed at someone else ───────────────────
assert.ok(
  authSrc.includes("OTP_VERIFY_MAX_ATTEMPTS"),
  "verifySignupOtp must be rate limited -- a 6-digit code is guessable without it"
);
assert.ok(
  authSrc.includes("OTP_RESEND_MAX"),
  "resendSignupOtp must be rate limited -- it mails a code on every call"
);
// Both must read the pending email from the httpOnly cookie, never the form.
const verifyBody = authSrc.slice(authSrc.indexOf("export async function verifySignupOtp"));
assert.ok(
  verifyBody.includes("cookieStore.get('pending_signup_email')"),
  "verifySignupOtp must take the email from the cookie, not from client input"
);
assert.ok(
  !/const email = \(formData\.get\('email'\)/.test(verifyBody.slice(0, 400)),
  "verifySignupOtp must not trust a posted email address"
);
assert.ok(
  /export async function resendSignupOtp\(\)/.test(authSrc),
  "resendSignupOtp must take no arguments -- an email parameter is an open mail relay"
);

// ── Credentials are not left at rest ──────────────────────────────────────
// The column is named passwordHash but stores the raw password, so the row has
// to be destroyed once it has been replayed into auth.signUp.
assert.ok(
  /db\.delete\(signupOtps\)/.test(authSrc),
  "consumed signup rows must be deleted -- they hold the password in clear text"
);

// ── Randomness ────────────────────────────────────────────────────────────
assert.ok(
  !/Math\.random\(\)/.test(authSrc),
  "OTP generation must use the CSPRNG, never Math.random"
);
assert.ok(
  authSrc.includes("crypto.getRandomValues"),
  "OTP generation must draw from crypto.getRandomValues"
);

// ── Admin idle timeout ────────────────────────────────────────────────────
// Enforcement is the absence of a browser-expired cookie, so it survives a
// client with scripting disabled. Three layers must agree on the same rule.
assert.strictEqual(
  /ADMIN_IDLE_TIMEOUT_SECONDS = 15 \* 60/.test(adminAuthSrc),
  true,
  "the idle window must be 15 minutes"
);
assert.ok(
  adminAuthSrc.includes("admin_activity"),
  "login must set the idle cookie alongside the session cookie"
);
assert.ok(
  rbacSrc.includes("admin_activity"),
  "requireAdmin must refuse a session cookie with no idle cookie beside it"
);
assert.ok(
  proxySrc.includes("admin_activity"),
  "the proxy must turn an idle session away before the page renders"
);
// touchAdminSession may only extend a live session, never create one.
const touchBody = adminAuthSrc.slice(
  adminAuthSrc.indexOf("export async function touchAdminSession"),
  adminAuthSrc.indexOf("export async function loginAdmin")
);
assert.ok(
  touchBody.includes("admin_session") && touchBody.includes("admin_activity"),
  "touchAdminSession must require both cookies before extending the window"
);

// Logout must clear both, or the idle cookie outlives the session it guards.
const logoutBody = adminAuthSrc.slice(adminAuthSrc.indexOf("export async function logoutAdmin"));
assert.ok(
  logoutBody.includes("admin_session") && logoutBody.includes("admin_activity"),
  "logout must clear both cookies"
);
assert.ok(/maxAge: 0/.test(logoutBody), "logout must overwrite with an expired cookie, not only delete");

// ── "use server" may only export async functions ──────────────────────────
// A non-function value export makes the whole actions module fail to evaluate,
// so every server action on the importing page returns 500 with a digest and no
// usable message. ADMIN_IDLE_TIMEOUT_SECONDS shipped as `export const` and broke
// admin login this way. Type-only exports are erased at compile time and are fine.
const actionFiles = readdirSync(new URL("./", import.meta.url))
  .filter((f) => (f.endsWith(".ts") || f.endsWith(".tsx")) && !f.includes(".test."));
for (const file of actionFiles) {
  const src = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
  if (!/^\s*['"]use server['"]/.test(src)) continue;
  const valueExports = [...src.matchAll(/^export\s+(?:const|let|var|class|enum)\s+(\w+)\s*(=?)(.*)$/gm)]
    .filter(([, , eq, rest]) => !(eq === "=" && /^\s*(async\b|\([^)]*\)\s*=>\s*\{?\s*$)/.test(rest)))
    .map(([, name]) => name);
  assert.deepStrictEqual(
    valueExports,
    [],
    `${file} is "use server" and exports non-function value(s): ${valueExports.join(", ")}. ` +
      `Drop the export or move the value to a plain module.`
  );
}

// ── Unauthenticated /admin ────────────────────────────────────────────────
assert.ok(
  /path === "\/admin" \|\| path\.startsWith\("\/admin\/"\)/.test(proxySrc),
  "the admin gate must match /admin exactly as well as its children"
);
// /admin-login and /admin-invite must not be caught by that gate, or the only
// way to obtain the cookie becomes unreachable.
const gated = (p) => p === "/admin" || p.startsWith("/admin/");
assert.ok(gated("/admin"), "/admin is gated");
assert.ok(gated("/admin/projects"), "/admin/projects is gated");
assert.ok(!gated("/admin-login"), "/admin-login must stay reachable without the cookie");
assert.ok(!gated("/admin-invite"), "/admin-invite must stay reachable without the cookie");

// ── Neon session proxy dispatch ───────────────────────────────────────────
// The gate above was already exact, but the neonProxy handoff below it used a
// bare startsWith("/admin"), which re-caught /admin-login and /admin-invite and
// redirected them to /login — the pages that mint the admin cookie, gated on it.
// Assert the handoff reuses the exact-segment predicates, never a bare prefix.
// Comments are stripped first: the guard below is described in a comment in
// proxy.ts, and matching the prose instead of the code would fail on the fix.
const proxyCode = proxySrc
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");
assert.ok(
  !/startsWith\("\/admin"\)/.test(proxyCode),
  'a bare startsWith("/admin") also matches /admin-login and /admin-invite'
);
assert.ok(
  !/startsWith\("\/dashboard"\)/.test(proxyCode),
  'a bare startsWith("/dashboard") also matches sibling paths like /dashboards-x'
);
const proxied = (p) =>
  p === "/admin" || p.startsWith("/admin/") ||
  p === "/dashboard" || p.startsWith("/dashboard/");
assert.ok(proxied("/admin/insights"), "/admin/insights goes through the session proxy");
assert.ok(proxied("/dashboard"), "/dashboard goes through the session proxy");
assert.ok(!proxied("/admin-login"), "/admin-login must never reach the session proxy");
assert.ok(!proxied("/admin-invite"), "/admin-invite must never reach the session proxy");

// ── Signup password policy ────────────────────────────────────────────────
const policy = (pw) =>
  pw.length >= 10 &&
  /[A-Z]/.test(pw) &&
  /[0-9]/.test(pw) &&
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);

assert.ok(policy("Str0ngPass!x"), "a compliant password is accepted");
assert.ok(!policy("short1!A"), "under ten characters is rejected");
assert.ok(!policy("alllowercase1!"), "no uppercase is rejected");
assert.ok(!policy("NoDigitsHere!"), "no digit is rejected");
assert.ok(!policy("NoSpecial1234"), "no special character is rejected");

console.log("auth hardening self-check passed");
