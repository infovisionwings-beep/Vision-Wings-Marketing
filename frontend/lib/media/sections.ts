/**
 * Every place on the public site that shows uploaded media.
 *
 * This exists because the campaign editor described its slots in internal
 * vocabulary — "Campaign Showcase (01, 02, 03)", "Campaign Archive" — which
 * matches nothing a visitor or an editor ever sees on the page. Choosing where
 * a photo should appear meant already knowing how the code was wired.
 *
 * Each entry is named by the heading that actually renders above it, states
 * whether the slot is for stills or film, and lists only the fields that slot
 * really uses. Everything else was noise on the form: the archive grid, for
 * instance, never renders a duration, and the video showcase never renders a
 * quote.
 *
 * `key` is the value stored in `campaigns.section`, so these strings are a data
 * contract — renaming one orphans existing rows.
 */

export type MediaKind = "image" | "video";

export type CampaignField =
  | "title"
  | "subtitle"
  | "description"
  | "client"
  | "category"
  | "year"
  | "duration"
  | "coverImage"
  | "videoUrl"
  | "quoteText"
  | "ctas";

export interface SiteSection {
  /** Stored in campaigns.section. Changing this orphans existing rows. */
  key: string;
  /** The heading a visitor reads above this slot. */
  label: string;
  /** Where to look for it. */
  where: string;
  mediaKind: MediaKind;
  /** Only these are rendered; the editor hides the rest. */
  fields: CampaignField[];
  /** What the slot does, in the editor's language rather than the code's. */
  help: string;
}

export const SITE_SECTIONS: SiteSection[] = [
  {
    key: "hero",
    label: "We give wings to your vision",
    where: "Homepage — the first thing on the page",
    mediaKind: "image",
    fields: ["title", "description", "coverImage", "ctas"],
    help: "The opening statement and the image beside it. Only one campaign shows here at a time — the newest published one wins.",
  },
  {
    key: "archive",
    label: "Campaigns that soar.",
    where: "Homepage gallery, and the full archive at /work",
    mediaKind: "image",
    fields: ["title", "category", "year", "coverImage", "quoteText", "subtitle"],
    help: "The masonry gallery of work. Leave the image empty and fill the quote instead to place a pull-quote card between the pictures.",
  },
  {
    key: "showcases",
    label: "Brand Stories in High-Definition Motion.",
    where: "Homepage video section",
    mediaKind: "video",
    fields: ["title", "client", "category", "year", "duration", "coverImage", "videoUrl", "description"],
    help: "The featured film and the two cards beside it. The cover image is the still shown before playback.",
  },
];

export function getSection(key: string): SiteSection | undefined {
  return SITE_SECTIONS.find((s) => s.key === key);
}

export function sectionsFor(kind: MediaKind): SiteSection[] {
  return SITE_SECTIONS.filter((s) => s.mediaKind === kind);
}

export function sectionUses(key: string, field: CampaignField): boolean {
  return getSection(key)?.fields.includes(field) ?? false;
}

/**
 * `samples` was selectable in the editor but nothing ever rendered it: the
 * /videos page passes only transcoded uploads to the grid, never campaigns. Rows
 * saved against it are invisible on the site, so the editor now surfaces them
 * for re-filing rather than silently swallowing the work.
 */
export const ORPHANED_SECTION_KEYS = ["samples"];
