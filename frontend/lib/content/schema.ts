/**
 * The editable-content contract.
 *
 * One declaration per field, consumed by both sides:
 *   - the site sections render `content(settings, key)`
 *   - /admin/content builds its whole form by walking CONTENT_SECTIONS
 *
 * Adding an editable field is a single entry here — no admin markup to write
 * and no chance of the form and the page disagreeing about what exists.
 *
 * Values live in the existing site_settings key/value table, so this adds no
 * schema migration. A key that has never been saved falls back to the `default`
 * recorded here, which is the copy that was previously hardcoded in the section.
 */

export type FieldType = "text" | "textarea" | "image" | "video" | "list";

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  /** Shown under the input in the admin form. */
  help?: string;
}

export interface ContentBlock {
  /** Sub-heading inside a section's editor, e.g. "Pillar 1" or "Card 3". */
  label: string;
  fields: ContentField[];
}

export interface ContentSection {
  /** Matches the site section's DOM id where one exists. */
  id: string;
  label: string;
  description: string;
  blocks: ContentBlock[];
}

/** Field constructors — keep the section data below readable. */
export const text = (key: string, label: string, def: string, help?: string): ContentField =>
  ({ key, label, type: "text", default: def, help });

export const area = (key: string, label: string, def: string, help?: string): ContentField =>
  ({ key, label, type: "textarea", default: def, help });

export const image = (key: string, label: string, def = "", help?: string): ContentField =>
  ({ key, label, type: "image", default: def, help });

export const video = (key: string, label: string, def = "", help?: string): ContentField =>
  ({ key, label, type: "video", default: def, help });

export const list = (key: string, label: string, def: string, help = "One per line."): ContentField =>
  ({ key, label, type: "list", default: def, help });

/** Every field in declaration order, flattened across sections and blocks. */
export function allFields(sections: ContentSection[]): ContentField[] {
  return sections.flatMap((s) => s.blocks.flatMap((b) => b.fields));
}
