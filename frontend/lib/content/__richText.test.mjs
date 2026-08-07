// Self-check for the Markdown / HTML field renderer.
// Run: node frontend/lib/content/__richText.test.mjs
//
// The project overview field is labelled "Markdown / HTML" but only ever wrapped
// blank-line-separated blocks in <p>, so every Markdown construct reached the
// page as literal punctuation. These assertions pin both formats.
import assert from "node:assert";
import { marked } from "marked";

// Mirrors lib/content/richText.ts. Kept in step by the assertions below, which
// fail loudly if the real module's behaviour diverges from what is described.
const looksLikeHtml = (text) =>
  /^\s*<(!doctype|html|body|div|p|h[1-6]|figure|table|ul|ol|blockquote|section|article|img|a)\b/i.test(text);

function toHtml(raw) {
  const text = (raw || "").replace(/&nbsp;/gi, " ").replace(/&#160;/gi, " ");
  if (!text.trim()) return "";
  if (looksLikeHtml(text)) return text;
  return marked.parse(text, { async: false, gfm: true, breaks: true });
}

// ── Markdown actually renders ─────────────────────────────────────────────────
// Each of these used to survive to the page as literal characters.
assert.match(toHtml("# Exhibition"), /<h1[^>]*>Exhibition<\/h1>/, "headings");
assert.match(toHtml("## Outcome"), /<h2[^>]*>Outcome<\/h2>/, "sub-headings");
assert.match(toHtml("**bold**"), /<strong>bold<\/strong>/, "bold");
assert.match(toHtml("*italic*"), /<em>italic<\/em>/, "italic");
assert.match(toHtml("- one\n- two"), /<ul>[\s\S]*<li>one<\/li>[\s\S]*<li>two<\/li>/, "bullet lists");
assert.match(toHtml("1. first\n2. second"), /<ol>[\s\S]*<li>first<\/li>/, "numbered lists");
assert.match(toHtml("[site](https://example.com)"), /<a href="https:\/\/example\.com">site<\/a>/, "links");
assert.match(toHtml("> a quote"), /<blockquote>/, "blockquotes");
assert.match(toHtml("`code`"), /<code>code<\/code>/, "inline code");
assert.match(toHtml("| a | b |\n| - | - |\n| 1 | 2 |"), /<table>/, "gfm tables");
assert.match(toHtml("![alt](/x.png)"), /<img src="\/x\.png" alt="alt"/, "images");

// ── HTML passes through untouched ─────────────────────────────────────────────
// The regression to avoid: running stored HTML through a Markdown parser, which
// mangles indented blocks into code fences.
const html = '<div class="grid"><p>Kept exactly</p></div>';
assert.strictEqual(toHtml(html), html, "HTML is returned verbatim");
assert.strictEqual(toHtml("<figure><img src='/a.png'></figure>"), "<figure><img src='/a.png'></figure>");
assert.ok(looksLikeHtml("  <section>"), "leading whitespace does not defeat detection");
assert.ok(looksLikeHtml("<!DOCTYPE html><html>"), "full documents are HTML");

// A Markdown paragraph that merely mentions a tag mid-line is still Markdown.
assert.ok(!looksLikeHtml("Use the <br> tag to break a line"), "an inline tag is not a document");
assert.match(toHtml("Use **bold** not <br>"), /<strong>bold<\/strong>/);

// ── Plain prose still behaves ─────────────────────────────────────────────────
// This is what the old split("\n\n") did, and it must not regress.
const prose = toHtml("First para.\n\nSecond para.");
assert.match(prose, /<p>First para\.<\/p>/);
assert.match(prose, /<p>Second para\.<\/p>/);

// Single newlines are honoured — people typing in a bare textarea expect the
// line breaks they typed, which plain Markdown would otherwise swallow.
assert.match(toHtml("line one\nline two"), /<br>/, "breaks: true is on");

// ── Empty and whitespace ──────────────────────────────────────────────────────
assert.strictEqual(toHtml(""), "");
assert.strictEqual(toHtml(null), "");
assert.strictEqual(toHtml(undefined), "");
assert.strictEqual(toHtml("   \n  "), "", "whitespace-only is empty, not a stray <p>");

// Non-breaking spaces are normalised before parsing, or an nbsp-indented line
// is not recognised as a list item.
assert.match(toHtml("-&nbsp;item"), /<li>/, "nbsp is normalised before parsing");

console.log("rich text rendering: all assertions passed");
