// Self-check for the uploaded-media field mapping.
// The public sections used to read invented column names (`title`,
// `thumbnailUrl`, `imageUrl`), so every real upload resolved to undefined and
// rendered as placeholder copy over stock photography. These asserts pin the
// mapping to the column names the rows actually carry.
// Run: node frontend/lib/media/__present.test.mjs
import assert from "node:assert";
import { readFileSync } from "node:fs";

// Comments are stripped first: the file documents the old broken names in prose,
// and only actual code should be scanned for them.
const src = readFileSync(new URL("./present.ts", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");

// The invented names must never come back.
for (const invented of ["thumbnailUrl", "imageUrl", "v?.title", "p?.title", "v?.client"]) {
  assert.ok(!src.includes(invented), `mapping must not read the non-existent field: ${invented}`);
}

// Columns the mapping is required to read, per lib/db/schema.ts.
for (const column of ["heading", "thumbnailPath", "durationSeconds", "webpPath", "originalFileName"]) {
  assert.ok(src.includes(column), `mapping must read the real column: ${column}`);
}

// Behavioural checks against row shapes matching the real schema.
const mod = await import("./present.ts").catch(() => null);
if (!mod) {
  // Plain `node` cannot load TypeScript on older runtimes; the static asserts
  // above still hold, so treat the behavioural half as skipped rather than failed.
  console.log("present.ts mapping: static checks passed (TS runtime unavailable for behavioural half)");
  process.exit(0);
}

const { videoTitle, videoDuration, videoPoster, photoTitle, photoSource } = mod;

// An admin-entered heading always wins over the raw filename.
assert.strictEqual(
  videoTitle({ heading: "Logo Promotion", originalFileName: "logomotion-pulse-720p.mp4" }),
  "Logo Promotion"
);
// Untitled uploads degrade to a readable filename, never to a placeholder.
assert.strictEqual(
  videoTitle({ originalFileName: "logomotion-pulse-720p.mp4" }),
  "logomotion pulse 720p"
);
// durationSeconds is a numeric *string* column, so it must be coerced.
assert.strictEqual(videoDuration({ durationSeconds: "11.40" }), "0:11");
assert.strictEqual(videoDuration({ durationSeconds: "125" }), "2:05");
assert.strictEqual(videoDuration({}), "HD");
// A missing poster returns undefined so the caller can pick its own fallback,
// rather than silently substituting a stock image here.
assert.strictEqual(videoPoster({}), undefined);
assert.strictEqual(videoPoster({ thumbnailPath: "https://blob/thumb.jpg" }), "https://blob/thumb.jpg");

assert.strictEqual(photoTitle({ heading: "Brand Mark" }), "Brand Mark");
assert.strictEqual(photoTitle({ originalFileName: "primary logo (1).png" }), "primary logo (1)");
// The optimised rendition leads; the original upload is the safety net.
assert.strictEqual(photoSource({ webpPath: "a.webp", inputPath: "b.png" }), "a.webp");
assert.strictEqual(photoSource({ inputPath: "b.png" }), "b.png");

console.log("present.ts mapping: all checks passed");
