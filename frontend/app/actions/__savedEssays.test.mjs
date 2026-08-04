// Self-check for the reader library and essay sharing.
// Run: node frontend/app/actions/__savedEssays.test.mjs
import assert from "node:assert";
import { readFileSync } from "node:fs";

const savedSrc = readFileSync(new URL("./savedEssays.ts", import.meta.url), "utf8");
const actionsSrc = readFileSync(
  new URL("../../components/essay/EssayActions.tsx", import.meta.url),
  "utf8"
);

// ── The library follows the admin ─────────────────────────────────────────
// "Saved until removed from admin" is not a cleanup job; it is the shape of the
// read. An inner join against insights plus the archived filter is what makes an
// archived essay leave every reader's library at once, so both must stay.
assert.ok(
  /\.innerJoin\(\s*insights/.test(savedSrc),
  "getSavedEssays must inner join insights -- a left join would keep rows for deleted essays"
);
assert.ok(
  /ne\(insights\.status, "archived"\)/.test(savedSrc),
  "getSavedEssays must exclude archived essays"
);
// Nothing about the essay may be copied into saved_essays, or it goes stale the
// moment an admin edits the title.
assert.ok(
  !/title:\s*varchar|insightTitle/.test(savedSrc),
  "saved_essays must store only the pairing, never a copy of the essay"
);

// A save must be refused for an essay that is not real and published.
assert.ok(
  /ne\(insights\.status, "archived"\)/.test(
    savedSrc.slice(savedSrc.indexOf("export async function toggleSavedEssay"))
  ),
  "toggleSavedEssay must verify the essay exists and is not archived before inserting"
);

// ── Identity is never taken from the client ───────────────────────────────
assert.ok(
  /async function currentUserId/.test(savedSrc),
  "the reader's id must be resolved from the session"
);
for (const fn of ["toggleSavedEssay", "isEssaySaved", "getSavedEssays", "removeSavedEssay"]) {
  const body = savedSrc.slice(savedSrc.indexOf(`export async function ${fn}`));
  const upToNext = body.slice(0, body.indexOf("\nexport async function", 1) + 1 || undefined);
  assert.ok(
    upToNext.includes("currentUserId()"),
    `${fn} must resolve the user from the session, never accept a user id argument`
  );
}
assert.ok(
  !/userId:\s*string/.test(savedSrc),
  "no exported action may take a userId parameter -- that is an authorization hole"
);

// Removal is scoped to the owner, so one reader cannot delete another's row.
const removeBody = savedSrc.slice(savedSrc.indexOf("export async function removeSavedEssay"));
assert.ok(
  /eq\(savedEssays\.userId, userId\)/.test(removeBody),
  "removeSavedEssay must scope the delete to the signed-in reader"
);

// ── Sharing works signed out ──────────────────────────────────────────────
// The share control must not depend on the session in any way.
assert.ok(
  !/getSession|requireAdmin|currentUserId/.test(actionsSrc),
  "sharing must not consult the session -- a reader who must sign in to pass a link on does not pass it on"
);
assert.ok(
  /navigator\.clipboard\.writeText/.test(actionsSrc),
  "copy link must use the clipboard API"
);
assert.ok(
  /document\.execCommand\("copy"\)/.test(actionsSrc),
  "copy link needs a fallback -- clipboard access is refused over plain http"
);

// Every target must be encoded, or a title with & or # truncates the share.
for (const network of ["x.com/intent/tweet", "linkedin.com/sharing", "facebook.com/sharer", "wa.me", "mailto:"]) {
  assert.ok(actionsSrc.includes(network), `share menu must offer ${network}`);
}
const targetsBlock = actionsSrc.slice(
  actionsSrc.indexOf("const targets ="),
  actionsSrc.indexOf("const buttonClass")
);
const rawInterpolations = targetsBlock.match(/\$\{(?!encodeURIComponent|encodedTitle)[^}]+\}/g) || [];
assert.deepStrictEqual(
  rawInterpolations,
  [],
  `every value in a share URL must be encoded, found raw: ${rawInterpolations.join(", ")}`
);

// Mirrors the encoding, to prove a hostile title cannot break out of the query.
const buildX = (title, url) =>
  `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
const nasty = buildX("Trust & Growth #2026 ?yes", "https://example.com/insights/a-b?x=1");
assert.ok(!nasty.slice("https://x.com/intent/tweet?".length).includes("#"), "# must be encoded");
assert.ok(
  nasty.split("&").length === 2,
  "an ampersand in the title must not add a query parameter"
);

// ── Saving needs an account, and says so ──────────────────────────────────
assert.ok(
  /requiresLogin/.test(savedSrc) && /requiresLogin/.test(actionsSrc),
  "a signed-out save must report back, not fail silently"
);
assert.ok(
  /\/login\?next=\$\{encodeURIComponent\(pathname\)\}/.test(actionsSrc),
  "the sign-in prompt must return the reader to the essay they were reading"
);

console.log("saved essays + sharing self-check passed");
