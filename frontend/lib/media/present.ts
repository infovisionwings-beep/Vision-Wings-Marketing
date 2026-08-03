/**
 * Uploaded videos carry two sets of columns: the pipeline's own
 * (`originalFileName`, `thumbnailPath`, `durationSeconds`, `mp4Path`) and the
 * editorial fields an admin fills in afterwards (`heading`, `subHeading`,
 * `category`, `description`).
 *
 * Public sections used to read invented names — `title`, `thumbnailUrl`,
 * `client`, `duration` — none of which exist on the row. Every real upload
 * therefore resolved to `undefined` and fell through to placeholder copy and
 * stock photography. This module is the single place that mapping lives.
 */

/** Admin-entered heading wins; otherwise fall back to a readable filename. */
export function videoTitle(v: any): string {
  if (v?.heading) return String(v.heading);
  return String(v?.originalFileName || "Untitled")
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

/** `durationSeconds` is a numeric-string column, so coerce before formatting. */
export function videoDuration(v: any): string {
  const secs = Number(v?.durationSeconds);
  if (!Number.isFinite(secs) || secs <= 0) return "HD";
  const mins = Math.floor(secs / 60);
  return `${mins}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
}

export function videoPoster(v: any): string | undefined {
  return v?.thumbnailPath || undefined;
}

/** Source order matches what the inline player already shipped with. */
export function videoSource(v: any): string {
  return v?.webmPath || v?.mp4Path || v?.inputPath;
}

export function videoYear(v: any): string {
  const stamp = v?.processedAt || v?.createdAt;
  return stamp ? new Date(stamp).getFullYear().toString() : "";
}

export function videoDate(v: any): string {
  const stamp = v?.processedAt || v?.createdAt;
  if (!stamp) return "LIVE";
  return new Date(stamp)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

/* ── Photos ──
   Same shape of problem as videos: the row carries `heading` / `webpPath`,
   never `title` / `imageUrl`. */

export function photoTitle(p: any): string {
  if (p?.heading) return String(p.heading);
  return String(p?.originalFileName || "Untitled")
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

/** The webp rendition is the optimised one; the original is the safety net. */
export function photoSource(p: any): string {
  return p?.webpPath || p?.inputPath || p?.thumbnailPath;
}

export function photoAlt(p: any): string {
  return p?.altText || photoTitle(p);
}

export function photoYear(p: any): string {
  const stamp = p?.processedAt || p?.createdAt;
  return stamp ? new Date(stamp).getFullYear().toString() : "";
}
