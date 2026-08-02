// Self-check for the archive -> delete lifecycle in projects.ts and
// clientLogos.ts. Both permanent-delete actions refuse anything not already
// archived; this mirrors backend/src/routes/__mediaLifecycle.test.js for the
// two entities added on the frontend's own Neon connection.
// Run: node frontend/app/actions/__projectsAndLogosLifecycle.test.mjs
import assert from "node:assert";
import { readFileSync } from "node:fs";

const projectsSrc = readFileSync(new URL("./projects.ts", import.meta.url), "utf8");
const logosSrc = readFileSync(new URL("./clientLogos.ts", import.meta.url), "utf8");

// Mirrors deleteProject()'s and deleteClientLogo()'s guard.
const canDelete = (entity) => !!entity && entity.publishStatus === "archived";

assert.ok(!canDelete({ publishStatus: "active" }), "an active project/logo must be archived first");
assert.ok(!canDelete(undefined), "a missing row is a 404, not a delete");
assert.ok(canDelete({ publishStatus: "archived" }), "archived is deletable");

// The full path a user takes: create -> active -> archive -> delete, with
// restore re-protecting the row exactly like the media lifecycle does.
let row = { publishStatus: "active" };
assert.ok(!canDelete(row));
row = { ...row, publishStatus: "archived" }; // archiveProject/archiveClientLogo
assert.ok(canDelete(row));
row = { ...row, publishStatus: "active" }; // restoreProject/restoreClientLogo
assert.ok(!canDelete(row), "restoring must re-protect the row from deletion");

// Both delete actions must actually carry the guard in source, not just in
// this test's model of it -- a refactor that drops the check would otherwise
// pass silently.
for (const [label, src, fnName] of [
  ["deleteProject", projectsSrc, "deleteProject"],
  ["deleteClientLogo", logosSrc, "deleteClientLogo"],
]) {
  const fnMatch = src.match(new RegExp(`export async function ${fnName}[\\s\\S]*?\\n}`));
  assert.ok(fnMatch, `${label} not found in source`);
  assert.match(fnMatch[0], /publishStatus\s*!==\s*["']archived["']/,
    `${label} must refuse deleting anything that is not archived`);
}

// Public reads must exclude archived rows -- an archived project/logo staying
// visible on the live site would defeat the point of archiving it.
for (const [label, src, fnName] of [
  ["getProjects", projectsSrc, "getProjects"],
  ["getProjectBySlug", projectsSrc, "getProjectBySlug"],
  ["getClientLogos", logosSrc, "getClientLogos"],
]) {
  const fnMatch = src.match(new RegExp(`export async function ${fnName}[\\s\\S]*?\\n}`));
  assert.ok(fnMatch, `${label} not found in source`);
  assert.match(fnMatch[0], /ne\(\s*\w+\.publishStatus,\s*["']archived["']\s*\)/,
    `${label} must filter out archived rows for public callers`);
}

// The admin read must NOT filter by status -- otherwise an archived row could
// never be found again to restore or delete.
for (const [label, src, fnName] of [
  ["getAdminProjects", projectsSrc, "getAdminProjects"],
  ["getAdminClientLogos", logosSrc, "getAdminClientLogos"],
]) {
  const fnMatch = src.match(new RegExp(`export async function ${fnName}[\\s\\S]*?\\n}`));
  assert.ok(fnMatch, `${label} not found in source`);
  assert.doesNotMatch(fnMatch[0], /\.where\(/,
    `${label} must return every status, or archived rows become unreachable`);
}

console.log("projects + client-logos lifecycle: all assertions passed");
