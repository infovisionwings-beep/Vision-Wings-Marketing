/**
 * The one import site for editable content: `import { content } from "@/lib/content"`.
 *
 * Defaults are derived here from the section data rather than registered by a
 * side effect, so a consumer can never pull in the reader without the values it
 * reads — which would have silently rendered every unsaved field as empty.
 */

import { allFields, type ContentField, type ContentSection } from "./schema";
import { CONTENT_SECTIONS } from "./sections";

export type { ContentField, ContentSection, ContentBlock, FieldType } from "./schema";
export { allFields } from "./schema";
export { CONTENT_SECTIONS } from "./sections";

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  allFields(CONTENT_SECTIONS).map((f: ContentField) => [f.key, f.default])
);

/**
 * Read one field. Falls back to the schema default so a section always renders
 * real copy — an unsaved or blanked key must never surface as an empty heading.
 */
export function content(
  settings: Record<string, string> | null | undefined,
  key: string
): string {
  const saved = settings?.[key];
  if (typeof saved === "string" && saved.trim() !== "") return saved;
  return CONTENT_DEFAULTS[key] ?? "";
}

/** Read a `list` field as its lines, blank entries dropped. */
export function contentList(
  settings: Record<string, string> | null | undefined,
  key: string
): string[] {
  return content(settings, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** True when the admin has saved a value — used for genuinely optional media. */
export function hasContent(
  settings: Record<string, string> | null | undefined,
  key: string
): boolean {
  return content(settings, key).trim() !== "";
}

/** Guards against a key drifting out of the schema during a rename. */
export function isKnownKey(key: string): boolean {
  return key in CONTENT_DEFAULTS;
}
