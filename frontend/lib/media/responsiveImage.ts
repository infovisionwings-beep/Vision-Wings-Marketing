/**
 * Builds a responsive srcSet for a plain <img> by routing it through Next's
 * image optimizer endpoint.
 *
 * Most covers on this site are raw <img> tags rather than next/image, because
 * they come from the database or Site Content and are laid out with CSS rather
 * than fixed dimensions. That meant a phone downloaded whatever width the
 * original URL happened to carry — Unsplash covers at w=1000–1600, uploaded
 * PNGs at full size — for a viewport 375px wide.
 *
 * Pointing the same URLs at /_next/image gets two things for free: the browser
 * picks a candidate that matches its viewport and DPR, and the optimizer
 * negotiates AVIF or WebP from the Accept header. No component rewrites, and it
 * works for any remote host already permitted in next.config remotePatterns.
 */

/** Must be a subset of deviceSizes/imageSizes in next.config, or the optimizer 400s. */
const COVER_WIDTHS = [640, 828, 1080, 1200, 1920];
const THUMB_WIDTHS = [96, 128, 256, 384];

export interface ResponsiveImageAttrs {
  /** Undefined rather than "" when there is no image: React omits the attribute
   *  entirely, where an empty src makes the browser re-request the current page
   *  and paint a broken-image box. */
  src?: string;
  srcSet?: string;
  sizes?: string;
}

function optimizerUrl(src: string, width: number, quality: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * @param sizes CSS `sizes` value describing the rendered width per breakpoint.
 *   Getting this right is what decides which candidate a phone downloads, so
 *   pass the real layout width rather than defaulting to 100vw.
 */
export function responsiveImage(
  src: string | null | undefined,
  sizes: string,
  opts: { thumb?: boolean; quality?: number } = {},
): ResponsiveImageAttrs {
  const { thumb = false, quality = 75 } = opts;

  // Nothing to gain, or the optimizer would reject it: SVGs are blocked unless
  // dangerouslyAllowSVG is set, and data/blob URLs carry their own bytes.
  if (!src || src.startsWith("data:") || src.startsWith("blob:") || /\.svg(\?|$)/i.test(src)) {
    return { src: src || undefined };
  }

  const widths = thumb ? THUMB_WIDTHS : COVER_WIDTHS;

  return {
    // Largest candidate as the fallback for anything that ignores srcSet.
    src: optimizerUrl(src, widths[widths.length - 1], quality),
    srcSet: widths.map((w) => `${optimizerUrl(src, w, quality)} ${w}w`).join(", "),
    sizes,
  };
}
