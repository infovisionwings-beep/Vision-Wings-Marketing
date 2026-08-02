/**
 * Shared category list for uploaded media. It was duplicated verbatim inside
 * AdminPhotoManager and AdminVideoManager, so the two lists could drift and a
 * photo category could stop matching a video one.
 */
export const MEDIA_CATEGORIES = [
  "Brand Strategy & Positioning",
  "Digital Experience & Web Design",
  "Paid Ads & Performance Growth",
  "Video Production & Motion Graphics",
  "Growth Marketing & SEO",
  "PR & Executive Positioning",
  "Conversion Rate Optimization (CRO)",
  "Case Study & Portfolio Showcase",
  "Social Media & Campaign Creative",
  "General / Miscellaneous",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];
