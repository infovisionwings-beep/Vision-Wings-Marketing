// Self-check for the admin section access map.
// Run: node frontend/lib/auth/__adminAccess.test.mjs
//
// The map is read by three places that used to disagree: the nav filter, the
// dashboard tiles, and every page's requireAdmin list. These assertions pin the
// designations so a section cannot be shown to a role that gets bounced out.
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

// The module is TypeScript; evaluate the two data structures out of the source
// rather than adding a build step just to test a pair of plain objects.
const src = readFileSync(join(here, "adminAccess.ts"), "utf8");
const FULL_ACCESS_ROLES = JSON.parse(
  src.match(/FULL_ACCESS_ROLES = (\[[^\]]*\])/)[1].replace(/'/g, '"')
);
const SECTION_ROLES = JSON.parse(
  src.match(/SECTION_ROLES: Record<string, string\[\]> = (\{[\s\S]*?\n\})/)[1]
    .replace(/\/\/.*$/gm, "")
    .replace(/,(\s*\})/g, "$1")
    .replace(/"/g, '"')
);

const ALWAYS_ALLOWED = ["/admin"];

function canAccess(role, href) {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role)) return true;
  if (ALWAYS_ALLOWED.includes(href)) return true;
  const match = Object.keys(SECTION_ROLES)
    .filter((p) => href === p || href.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? SECTION_ROLES[match].includes(role) : false;
}

// ── The two designations ──────────────────────────────────────────────────────
// SEO: media library and insights, nothing else.
assert.ok(canAccess("SEO", "/admin"), "every admin lands on the dashboard");
assert.ok(canAccess("SEO", "/admin/media"), "SEO uploads media");
assert.ok(canAccess("SEO", "/admin/insights"), "SEO owns insights");
for (const denied of ["/admin/campaigns", "/admin/projects", "/admin/logos", "/admin/leads", "/admin/content", "/admin/new", "/admin/logs"]) {
  assert.ok(!canAccess("SEO", denied), `SEO must not reach ${denied}`);
}

// Content Manager: media library and campaigns, nothing else.
assert.ok(canAccess("Content Manager", "/admin"), "every admin lands on the dashboard");
assert.ok(canAccess("Content Manager", "/admin/media"), "Content Manager uploads media");
assert.ok(canAccess("Content Manager", "/admin/campaigns"), "Content Manager owns campaigns");
for (const denied of ["/admin/insights", "/admin/projects", "/admin/logos", "/admin/leads", "/admin/content", "/admin/new", "/admin/logs"]) {
  assert.ok(!canAccess("Content Manager", denied), `Content Manager must not reach ${denied}`);
}

// ── Nested routes follow their section ────────────────────────────────────────
// The whole point of prefix matching: /admin/insights/new must not fall through
// to "no rule matched, deny" for the role that owns /admin/insights.
assert.ok(canAccess("SEO", "/admin/insights/new"), "SEO reaches the insight editor");
assert.ok(canAccess("SEO", "/admin/insights/12/edit"), "SEO reaches an existing insight");
assert.ok(canAccess("Content Manager", "/admin/campaigns/new"));
assert.ok(canAccess("Content Manager", "/admin/campaigns/7/edit"));
assert.ok(!canAccess("Content Manager", "/admin/insights/new"), "and the deny side nests too");

// A prefix must not match a sibling that merely starts with the same letters.
assert.ok(!canAccess("SEO", "/admin/insights-archive"), "prefix match is path-segment aware");

// ── Full access and no access ─────────────────────────────────────────────────
for (const section of ["/admin", "/admin/media", "/admin/insights", "/admin/campaigns", "/admin/projects", "/admin/leads"]) {
  assert.ok(canAccess("Developer", section), "Developer reaches everything");
  assert.ok(canAccess("Admin", section), "Admin reaches every ordinary section");
}

assert.ok(!canAccess(null, "/admin"), "no role means no access");
assert.ok(!canAccess(undefined, "/admin/media"), "an unresolved role fails closed");
assert.ok(!canAccess("", "/admin"), "an empty role fails closed");
assert.ok(!canAccess("Nonsense", "/admin/media"), "an unknown role fails closed");

console.log("admin section access map: all assertions passed");
