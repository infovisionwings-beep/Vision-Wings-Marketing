// Self-check for the editable-content contract.
// The admin form and the site sections both walk this schema, so a duplicate key
// or an empty default silently corrupts real page copy.
// Run: node frontend/lib/content/__contentSchema.test.mjs
import assert from "node:assert";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./sections.ts", import.meta.url), "utf8");

// Every key declared in the schema, in order.
const keys = [...src.matchAll(/^\s*(?:text|area|image|video|list)\(\s*"([^"]+)"/gm)].map((m) => m[1]);
assert.ok(keys.length > 55, `expected the full homepage schema, found ${keys.length} keys`);

// The 4 metrics ($45M+ etc.) were replaced by the client logo marquee, which is
// its own CRUD (Admin -> Client Logos), not a Site Content field. They must not
// come back as orphaned, unrendered form fields.
for (const removed of ["about.metric1_value", "about.metric2_value", "about.metric3_value", "about.metric4_label"]) {
  assert.ok(!keys.includes(removed), `metric field should have been removed, not reintroduced: ${removed}`);
}

// Duplicates would make one field silently overwrite another on save.
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
assert.deepStrictEqual(dupes, [], `duplicate content keys: ${dupes.join(", ")}`);

// Keys are namespaced so a section's fields can be grouped and diffed.
for (const k of keys) {
  assert.match(k, /^[a-z][a-z0-9_]*[._][a-z0-9_.]+$/, `key is not namespaced: ${k}`);
}

// The section components read these exact keys; a rename in one place only is
// the failure this catches.
for (const required of [
  "hero.title", "hero.cta_primary_link", "hero.image",
  "about.heading", "about.photo", "about.pillar3_body",
  "services.heading", "services.card1_title", "services.card4_image",
  "services.card5_tools", "services.strength3_desc", "services.industries",
  "work.heading",
  "featured_videos_title_line1", "featured_videos_description",
  "insights.heading", "insights.cta_link",
  "contact.heading", "contact.email", "contact.location",
]) {
  assert.ok(keys.includes(required), `schema is missing key: ${required}`);
}

// The three keys the old hardcoded editor wrote must keep their exact names, or
// copy already saved in production would be orphaned by the rewrite.
for (const legacy of [
  "featured_videos_title_line1",
  "featured_videos_title_line2",
  "featured_videos_description",
]) {
  assert.ok(keys.includes(legacy), `legacy settings key dropped: ${legacy}`);
}

// `content()` falls back to the default, so a text field that renders as visible
// copy may not default to empty — that would be a blank heading on a fresh
// install. The one exception is alt text belonging to an optional image: with no
// image chosen there is nothing to describe.
const OPTIONAL_EMPTY = new Set(["hero.image_alt"]);
const textDefaults = [...src.matchAll(/^\s*(text|area|list)\(\s*"([^"]+)",\s*"[^"]*",\s*\n?\s*"([^"]*)"/gm)];
for (const [, , key, def] of textDefaults) {
  if (OPTIONAL_EMPTY.has(key)) continue;
  assert.notStrictEqual(def.trim(), "", `text field has an empty default: ${key}`);
}

// Each exemption must really be alt text for a media field that is itself
// optional, so the list cannot quietly become a dumping ground.
for (const key of OPTIONAL_EMPTY) {
  assert.match(key, /_alt$/, `only alt text may default to empty: ${key}`);
  const mediaKey = key.replace(/_alt$/, "");
  assert.ok(keys.includes(mediaKey), `${key} has no media field ${mediaKey}`);
  assert.match(src, new RegExp(`image\\(\\s*"${mediaKey.replace(".", "\\.")}",[^)]*""`, "s"),
    `${mediaKey} must default to empty for ${key} to be exempt`);
}

console.log(`content schema: ${keys.length} keys, all assertions passed`);
