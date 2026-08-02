// Self-check for safeRedirectPath in frontend/app/actions/auth.ts.
// A login page is the classic open-redirect target, so `next` is attacker-supplied
// input at a trust boundary and must only ever yield a same-origin path.
// Run: node backend/src/routes/__safeRedirect.test.js
const assert = require('assert');

function safeRedirectPath(next) {
  if (typeof next !== 'string' || !next.startsWith('/')) return null;
  if (next.startsWith('//') || next.startsWith('/\\')) return null;
  return next;
}

// The case this exists for: returning an invitee to their invite after sign-in.
assert.strictEqual(safeRedirectPath('/admin-invite?token=abc'), '/admin-invite?token=abc');
assert.strictEqual(safeRedirectPath('/admin/logs'), '/admin/logs');

// Off-origin destinations the browser would happily follow.
for (const hostile of [
  '//evil.com',              // protocol-relative — browsers treat as absolute
  '//evil.com/admin',
  '/\\evil.com',             // backslash variant some parsers normalise to //
  'https://evil.com',
  'http://evil.com',
  'javascript:alert(1)',
  '',
]) {
  assert.strictEqual(safeRedirectPath(hostile), null, `must reject: ${JSON.stringify(hostile)}`);
}

// Non-strings from FormData.get() (File, null) must not slip through.
for (const bad of [null, undefined, 42, {}, ['/admin']]) {
  assert.strictEqual(safeRedirectPath(bad), null, `must reject non-string: ${JSON.stringify(bad)}`);
}

// Callers fall back to the homepage rather than redirecting to a rejected value.
const destination = (next) => safeRedirectPath(next) || '/';
assert.strictEqual(destination('//evil.com'), '/');
assert.strictEqual(destination('/admin-invite?token=abc'), '/admin-invite?token=abc');

console.log('safe redirect path: all assertions passed');
