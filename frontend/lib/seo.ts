import type { Metadata } from "next";

/**
 * The canonical origin, with the `www` host.
 *
 * This is not arbitrary: the apex domain already answers with a 308 to
 * `www.visionwingsmarketing.com`, so `www` is what actually serves the site and
 * what every canonical, sitemap entry and `og:url` must agree on. Hard-coding it
 * in one place stops the two variants drifting apart across files.
 */
export const SITE_URL = "https://www.visionwingsmarketing.com";

/**
 * The site-wide social card, served straight out of public/.
 *
 * Everything that isn't an article shares this one image. Articles pass their
 * own hero through `image` below, so the only pages that fall back here are the
 * ones with no artwork of their own.
 */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_SIZE = { width: 1731, height: 909 };

interface PageSeo {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/work" or "/insights/some-slug". "" for home. */
  path: string;
  /** Absolute URL. Defaults to the generated site card. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Gated or transactional pages that must stay out of the index. */
  noindex?: boolean;
  /**
   * Bypass the root layout's "%s | Vision Wings Marketing" title template. The
   * homepage title already ends in the brand, and letting the template run over
   * it produced "... Marketing | Vision Wings Marketing".
   */
  absoluteTitle?: boolean;
}

/**
 * Build a page's metadata with a self-referencing canonical and page-specific
 * social tags.
 *
 * Both matter because Next.js does not derive one from the other: a page that
 * sets only `title` and `description` inherits the *root layout's* `openGraph`
 * block verbatim. Every page therefore advertised the homepage's title,
 * description and URL to every social crawler, so sharing an article or the
 * contact page produced an identical, wrong card. Routing all pages through one
 * helper keeps the canonical, the OG tags and the Twitter tags in agreement by
 * construction rather than by remembering to repeat them.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = "website",
  publishedTime,
  noindex = false,
  absoluteTitle = false,
}: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Vision Wings Marketing",
      locale: "en_US",
      type,
      // Dimensions are only declared for the site card, whose size we actually
      // know. An article hero is whatever the author uploaded, and asserting a
      // size we haven't measured just tells crawlers to lay out a card that
      // doesn't match the file they fetch.
      images: [
        image === OG_IMAGE
          ? { url: image, ...OG_IMAGE_SIZE, alt: title }
          : { url: image, alt: title },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
