// Self-check for admin role derivation and per-designation route access.
// Mirrors the logic in frontend/lib/auth/rbac.ts (requireAdmin) and the role lists
// in backend/src/routes/admin.ts, which must agree on the same role strings.
// Run: node backend/src/routes/__adminRoles.test.js
const assert = require('assert');

// Mirrors adminAccess.ts: FULL_ACCESS_ROLES plus each section's extra roles.
// SEO owns written content, Content Manager owns campaigns, both upload media.
const MEDIA_ROLES = ['Developer', 'Admin', 'SEO', 'Content Manager'];
const CAMPAIGN_ROLES = ['Developer', 'Admin', 'Content Manager'];
const BLOG_ROLES = ['Developer', 'Admin', 'SEO'];
// Sections outside both designations — projects, logos, leads, site content.
const FULL_ACCESS_ONLY = ['Developer', 'Admin'];

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
// Both designations upload media; each owns exactly one publishing surface.
assert.ok(allowed('SEO', MEDIA_ROLES), 'SEO uploads to the shared media library');
assert.ok(allowed('Content Manager', MEDIA_ROLES), 'Content Manager uploads too');

assert.ok(allowed('SEO', BLOG_ROLES), 'SEO owns written content');
assert.ok(!allowed('Content Manager', BLOG_ROLES), 'Content Manager must not edit insights');

assert.ok(allowed('Content Manager', CAMPAIGN_ROLES), 'Content Manager owns campaigns');
assert.ok(!allowed('SEO', CAMPAIGN_ROLES), 'SEO must not edit campaigns');

// Neither designation reaches the sections outside both remits.
assert.ok(!allowed('SEO', FULL_ACCESS_ONLY), 'SEO must not reach projects/logos/leads/site content');
assert.ok(!allowed('Content Manager', FULL_ACCESS_ONLY), 'Content Manager must not either');

// Admin covers every ordinary section; Developer covers everything.
for (const roles of [MEDIA_ROLES, CAMPAIGN_ROLES, BLOG_ROLES, FULL_ACCESS_ONLY]) {
  assert.ok(allowed('Admin', roles), 'Admin covers every ordinary section');
  assert.ok(allowed('Developer', roles), 'Developer is allowed everywhere');
}

// Only Developer reaches admin creation. Admin is full-access by being listed
// in every section, NOT by bypassing the role check — if it ever bypasses, it
// passes this gate too and can mint other admins.
assert.ok(!allowed('Admin', ['Developer']), 'Admin must not be able to add other admins');
assert.ok(!allowed('SEO', ['Developer']));
assert.ok(!allowed('Content Manager', ['Developer']));

console.log('admin role derivation + designation access: all assertions passed');
