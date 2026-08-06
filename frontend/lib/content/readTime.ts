/**
 * Read-time estimate, shared so the listing, the homepage section, the article
 * page and the saved-essays dashboard never disagree.
 *
 * The previous inline arithmetic divided the raw HTML length by 500, counting
 * every tag and inline style as prose — which advertised a 2,500-word article as
 * a 53-minute read. Measuring stripped text at roughly 5 characters per word and
 * 200 words per minute gives ~1,000 characters per minute.
 */
const CHARS_PER_MINUTE = 1000;
const MIN_MINUTES = 3;

/** Minutes only, for callers that render their own label. */
export function readMinutesFromLength(plainTextLength: number | null | undefined): number {
  const chars = Number(plainTextLength) || 1500;
  return Math.max(MIN_MINUTES, Math.ceil(chars / CHARS_PER_MINUTE));
}

/** For callers that already hold plain-text length (computed in SQL). */
export function readTimeFromLength(plainTextLength: number | null | undefined): string {
  return `${readMinutesFromLength(plainTextLength)} min read`;
}

/** For callers that hold the HTML body itself. */
export function readTimeFromHtml(html: string | null | undefined): string {
  return readTimeFromLength((html || "").replace(/<[^>]+>/g, "").length);
}
