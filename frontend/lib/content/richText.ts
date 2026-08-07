import { marked } from "marked";

/**
 * Heuristic used when a field accepts either format and nobody has said which:
 * real Markdown essentially never opens with a tag, and pasted HTML documents
 * and fragments do.
 *
 * Lifted out of InsightForm so the admin editor and the public renderers agree.
 * They had drifted: the editor used this test, while the project page asked only
 * whether the text started with "<", which treated a leading HTML comment as
 * Markdown and a Markdown line containing an inline <br> as a full document.
 */
export function looksLikeHtml(text: string): boolean {
  return /^\s*<(!doctype|html|body|div|p|h[1-6]|figure|table|ul|ol|blockquote|section|article|img|a)\b/i.test(text);
}

/**
 * Render a field that accepts Markdown or HTML down to HTML.
 *
 * HTML passes through untouched. Everything else goes through Markdown, which
 * also covers the plain-prose case — blank-line-separated text comes out as
 * paragraphs, which is all the previous hand-rolled `split("\n\n")` did.
 *
 * NOT a sanitiser. Callers render admin-authored content only, and the trust
 * boundary in this app is the admin form, which sanitises on the way in. Do not
 * point this at anything a reader can submit.
 */
export function toHtml(raw: string | null | undefined): string {
  const text = (raw || "")
    // Non-breaking spaces break word wrapping mid-word, and Markdown will not
    // treat an nbsp-indented line as a list item.
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ");

  if (!text.trim()) return "";
  if (looksLikeHtml(text)) return text;

  // `breaks` so a single newline inside a paragraph is honoured: people writing
  // in a plain textarea expect the line breaks they typed.
  return marked.parse(text, { async: false, gfm: true, breaks: true }) as string;
}
