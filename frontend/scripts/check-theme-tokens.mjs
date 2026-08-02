#!/usr/bin/env node
/**
 * Fails if the source uses a brand colour shade that `@theme` never defines.
 *
 * Tailwind v4 silently emits nothing for an unknown utility, so `border-navy-200`
 * against an undefined `navy-200` compiles away and the border quietly falls back
 * to `currentColor`. That is exactly how 293 usages went unnoticed. Undefined
 * shades are invisible at build time unless something looks for them — this does.
 *
 * Run: node scripts/check-theme-tokens.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const NAMESPACES = ["navy", "bronze", "warm"];
const PREFIXES = "bg|text|border|divide|ring|from|via|to|outline|decoration|shadow|accent|caret|fill|stroke|placeholder";

const defined = new Set();
for (const m of readFileSync(join(ROOT, "app/globals.css"), "utf8")
  .matchAll(new RegExp(`--color-(${NAMESPACES.join("|")})-(\\d+)\\s*:`, "g"))) {
  defined.add(`${m[1]}-${m[2]}`);
}

const used = new Map(); // "navy-200" -> Set of files
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (![".tsx", ".ts", ".jsx", ".js", ".css"].includes(extname(full))) continue;

    const src = readFileSync(full, "utf8");
    const re = new RegExp(`\\b(?:${PREFIXES})-((?:${NAMESPACES.join("|")}))-(\\d+)\\b`, "g");
    for (const m of src.matchAll(re)) {
      const shade = `${m[1]}-${m[2]}`;
      if (defined.has(shade)) continue;
      if (!used.has(shade)) used.set(shade, new Set());
      used.get(shade).add(full.slice(ROOT.length).replace(/\\/g, "/"));
    }
  }
};
for (const dir of ["app", "components"]) walk(join(ROOT, dir));

if (used.size === 0) {
  console.log(`✔ every brand shade used is defined in @theme (${defined.size} defined)`);
  process.exit(0);
}

console.error("✘ these shades are used but not defined in app/globals.css @theme:\n");
for (const [shade, files] of [...used].sort()) {
  const list = [...files];
  console.error(`  ${shade}  — ${list.length} file(s): ${list.slice(0, 3).join(", ")}${list.length > 3 ? ", …" : ""}`);
}
console.error("\nTailwind emits no rule for these, so borders fall back to currentColor");
console.error("and text inherits. Add them to @theme or change the call sites.");
process.exit(1);
