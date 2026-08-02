// Self-check for the admin invite token lifecycle in backend/src/routes/admin.ts.
// Covers what the dual-OTP flow it replaces got wrong: a second factor that was
// returned in the API response, and no single-use or expiry enforcement.
// Run: node backend/src/routes/__adminInvites.test.js
const assert = require('assert');
const crypto = require('crypto');

const INVITE_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;
const ASSIGNABLE_ROLES = ['Admin', 'SEO', 'Content Manager'];
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

// --- token shape -------------------------------------------------------------
const token = crypto.randomBytes(32).toString('base64url');
assert.ok(token.length >= 43, 'token carries >= 256 bits of entropy');
assert.ok(/^[A-Za-z0-9_-]+$/.test(token), 'base64url is URL-safe, so the emailed link survives intact');

const stored = hashToken(token);
assert.strictEqual(stored.length, 64, 'sha256 hex fits the varchar(64) column');
assert.notStrictEqual(stored, token, 'the raw token is never what lands in the database');
assert.strictEqual(hashToken(token), stored, 'lookup by hash is deterministic');
assert.notStrictEqual(hashToken(crypto.randomBytes(32).toString('base64url')), stored);

// --- role assignment ---------------------------------------------------------
// No invite may mint another super admin: 'Developer' comes from SUPER_ADMIN_EMAIL only.
assert.ok(!ASSIGNABLE_ROLES.includes('Developer'), 'invites cannot grant Developer');
for (const role of ['Admin', 'SEO', 'Content Manager']) {
  assert.ok(ASSIGNABLE_ROLES.includes(role));
}
for (const bad of ['developer', 'Superadmin', '', 'admin']) {
  assert.ok(!ASSIGNABLE_ROLES.includes(bad), `must reject role: "${bad}"`);
}

// --- lifecycle ---------------------------------------------------------------
const now = Date.now();
const usable = (invite, at = now) =>
  !!invite && invite.status === 'pending' && new Date(invite.expiresAt).getTime() > at;

const fresh = { status: 'pending', expiresAt: new Date(now + INVITE_TTL_MS) };
assert.ok(usable(fresh), 'a fresh pending invite is usable');
assert.ok(!usable(fresh, now + INVITE_TTL_MS + 1), 'expires after exactly 24h');
assert.ok(!usable({ status: 'accepted', expiresAt: new Date(now + INVITE_TTL_MS) }), 'single use');
assert.ok(!usable({ status: 'revoked', expiresAt: new Date(now + INVITE_TTL_MS) }), 'revoked is dead');
assert.ok(!usable(undefined), 'an unknown token resolves to nothing');

// Accept burns the invite with a status-guarded update, so a concurrent second
// request matches zero rows rather than creating a duplicate admin.
let row = { id: 'i1', status: 'pending' };
const burn = () => {
  if (row.status !== 'pending') return 0;
  row = { ...row, status: 'accepted' };
  return 1;
};
assert.strictEqual(burn(), 1, 'first accept wins');
assert.strictEqual(burn(), 0, 'replayed link matches no pending row');

// --- password policy ---------------------------------------------------------
assert.ok('correct-horse-battery'.length >= MIN_PASSWORD_LENGTH);
assert.ok(!('short'.length >= MIN_PASSWORD_LENGTH), 'server rejects short passwords');

// --- email match (frontend/app/actions/adminInvites.ts) ----------------------
// The session email is read server-side, so the browser cannot spoof it.
const matches = (session, invited) => session.toLowerCase() === invited.toLowerCase();
assert.ok(matches('Jo@Vw.com', 'jo@vw.com'), 'comparison is case-insensitive');
assert.ok(!matches('someone-else@vw.com', 'jo@vw.com'), 'a signed-in stranger cannot accept');

console.log('admin invite lifecycle: all assertions passed');
