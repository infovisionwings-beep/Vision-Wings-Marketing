// Self-check for admin role derivation and per-designation route access.
// Mirrors the logic in frontend/lib/auth/rbac.ts (requireAdmin) and the role lists
// in backend/src/routes/admin.ts, which must agree on the same role strings.
// Run: node backend/src/routes/__adminRoles.test.js
const assert = require('assert');

const MEDIA_ROLES = ['Developer', 'Admin', 'Content Manager'];
const CONTENT_ROLES = ['Developer', 'Admin', 'Content Manager', 'SEO'];
const BLOG_ROLES = ['Admin', 'SEO'];

// --- role derivation (frontend/lib/auth/rbac.ts) ------------------------------
// dbRole simulates the backend /is-admin lookup; null = not an admin.
function deriveRole({ email, superAdminEmail, jwtRole, dbRole, adminEmails = [] }) {
  const list = adminEmails.map((e) => e.toLowerCase()).filter(Boolean);
  if (email && email === superAdminEmail) return 'Developer';
  if (jwtRole) return jwtRole;
  if (email) return dbRole || (list.includes(email) ? 'Admin' : null);
  return null;
}

// requireAdmin's gate: no role => redirect('/'); Developer bypasses any role list.
const allowed = (role, requiredRoles) =>
  role !== null && (!requiredRoles || requiredRoles.includes(role) || role === 'Developer');

const SUPER = 'boss@visionwings.com';

// The reported bug: super admin with an expired admin_session was bounced from
// /admin/new and /admin/logs because the role defaulted to 'Admin'.
const superNoCookie = deriveRole({ email: SUPER, superAdminEmail: SUPER, jwtRole: null, dbRole: null });
assert.strictEqual(superNoCookie, 'Developer');
assert.ok(allowed(superNoCookie, ['Developer']), 'super admin must reach /new and /logs without the cookie');

// The auth bypass: a signed-in non-admin used to default to 'Admin' and pass.
const randomUser = deriveRole({ email: 'someone@gmail.com', superAdminEmail: SUPER, jwtRole: null, dbRole: null });
assert.strictEqual(randomUser, null, 'a signed-in non-admin must resolve to no role');
assert.ok(!allowed(randomUser, undefined), 'a signed-in non-admin must not reach /admin');

// A backend outage must fail closed, not fall back to 'Admin'.
assert.strictEqual(deriveRole({ email: 'cm@vw.com', superAdminEmail: SUPER, jwtRole: null, dbRole: null }), null);

// Empty env must not turn an anonymous request into the super admin.
assert.strictEqual(deriveRole({ email: '', superAdminEmail: '', jwtRole: null, dbRole: null }), null);

// DB-backed and JWT-backed roles resolve to themselves.
assert.strictEqual(deriveRole({ email: 'cm@vw.com', superAdminEmail: SUPER, jwtRole: null, dbRole: 'Content Manager' }), 'Content Manager');
assert.strictEqual(deriveRole({ email: 'seo@vw.com', superAdminEmail: SUPER, jwtRole: 'SEO', dbRole: null }), 'SEO');
assert.strictEqual(deriveRole({ email: 'ops@vw.com', superAdminEmail: SUPER, jwtRole: null, dbRole: null, adminEmails: ['ops@vw.com'] }), 'Admin');

// --- per-designation enforcement (backend/src/routes/admin.ts) ----------------
// SEO must not touch photos/videos; Content Manager must not touch blogs.
assert.ok(!allowed('SEO', MEDIA_ROLES), 'SEO must not edit or archive media');
assert.ok(!allowed('Content Manager', BLOG_ROLES), 'Content Manager must not edit blogs');
assert.ok(allowed('Content Manager', MEDIA_ROLES));
assert.ok(allowed('SEO', BLOG_ROLES));

// Admin does both; Developer does everything.
for (const roles of [MEDIA_ROLES, CONTENT_ROLES, BLOG_ROLES]) {
  assert.ok(allowed('Admin', roles), 'Admin covers both designations');
  assert.ok(allowed('Developer', roles), 'Developer is allowed everywhere');
}

// Only Developer reaches admin creation.
assert.ok(!allowed('Admin', ['Developer']), 'Admin must not be able to add other admins');
assert.ok(!allowed('SEO', ['Developer']));
assert.ok(!allowed('Content Manager', ['Developer']));

console.log('admin role derivation + designation access: all assertions passed');
