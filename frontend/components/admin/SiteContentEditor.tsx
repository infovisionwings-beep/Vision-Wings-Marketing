"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Save, Loader2, RefreshCw, ChevronDown, ImageIcon, Film, X,
  AlertCircle, CheckCircle2, RotateCcw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import MediaPickerModal from "./MediaPickerModal";
import { getSettings, updateSettings } from "@/app/actions/settings";
import {
  CONTENT_SECTIONS, CONTENT_DEFAULTS, allFields,
  type ContentField,
} from "@/lib/content";

type Values = Record<string, string>;

/** Which media picker is open, and the field it will write back to. */
type PickerTarget = { key: string; kind: "photo" | "video" } | null;

export default function SiteContentEditor() {
  const [values, setValues] = useState<Values>({});
  const [saved, setSaved] = useState<Values>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [open, setOpen] = useState<string[]>([CONTENT_SECTIONS[0].id]);
  const [picker, setPicker] = useState<PickerTarget>(null);

  const fields = useMemo(() => allFields(CONTENT_SECTIONS), []);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const stored = (await getSettings()) || {};
      // Seed every known key so an untouched field still posts its default —
      // otherwise editing one field would leave the rest absent from the row set.
      const seeded: Values = {};
      for (const f of fields) {
        seeded[f.key] = typeof stored[f.key] === "string" ? stored[f.key] : f.default;
      }
      setValues(seeded);
      setSaved(seeded);
    } catch {
      setStatus({ ok: false, text: "Could not load the current content. The backend may be waking up — try Reload." });
    }
    setLoading(false);
  }, [fields]);

  useEffect(() => { load(); }, [load]);

  const dirtyKeys = useMemo(
    () => Object.keys(values).filter((k) => values[k] !== saved[k]),
    [values, saved]
  );

  // The form is long and a save is a whole-homepage change; don't lose it to a stray reload.
  useEffect(() => {
    if (dirtyKeys.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys.length]);

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    setStatus(null);

    // Send only what changed: a smaller upsert, and the audit log then records
    // what the admin actually edited rather than all ninety keys every time.
    const payload: Values = {};
    for (const k of dirtyKeys) payload[k] = values[k];

    const res = await updateSettings(payload);
    if (res.success) {
      setSaved(values);
      setStatus({ ok: true, text: `Saved ${dirtyKeys.length} change${dirtyKeys.length === 1 ? "" : "s"}. The site updates within a minute.` });
    } else {
      setStatus({ ok: false, text: res.error || "Could not save." });
    }
    setSaving(false);
  };

  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const sectionDirtyCount = (sectionId: string) => {
    const section = CONTENT_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return 0;
    const keys = new Set(section.blocks.flatMap((b) => b.fields.map((f) => f.key)));
    return dirtyKeys.filter((k) => keys.has(k)).length;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-navy-500">
        <Loader2 className="h-8 w-8 animate-spin text-bronze-600" />
        <p className="text-sm">Loading site content…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {status && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            status.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {status.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <p>{status.text}</p>
        </div>
      )}

      {/* Save bar sticks: with ninety fields the button would otherwise be a long scroll away. */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-200 bg-warm-50/95 p-3 shadow-sm backdrop-blur">
        <p className="pl-1 text-sm text-navy-600">
          {dirtyKeys.length === 0
            ? "No unsaved changes."
            : `${dirtyKeys.length} unsaved change${dirtyKeys.length === 1 ? "" : "s"}.`}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={load} disabled={saving} className="gap-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Reload
          </Button>
          <Button type="submit" variant="primary" disabled={saving || dirtyKeys.length === 0} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {CONTENT_SECTIONS.map((section) => {
          const isOpen = open.includes(section.id);
          const dirty = sectionDirtyCount(section.id);
          return (
            <section key={section.id} className="overflow-hidden rounded-2xl border border-navy-200 bg-white">
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-warm-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bronze-500"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold text-navy-950">{section.label}</span>
                      {dirty > 0 && (
                        <span className="rounded-full bg-bronze-100 px-2 py-0.5 text-[11px] font-semibold text-bronze-800">
                          {dirty} edited
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-navy-600">{section.description}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-navy-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </h2>

              {isOpen && (
                <div className="space-y-8 border-t border-navy-200 px-5 py-6">
                  {section.blocks.map((block) => (
                    <fieldset key={block.label} className="space-y-4">
                      <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-700">
                        {block.label}
                      </legend>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {block.fields.map((field) => (
                          <Field
                            key={field.key}
                            field={field}
                            value={values[field.key] ?? ""}
                            dirty={values[field.key] !== saved[field.key]}
                            onChange={(v) => set(field.key, v)}
                            onPick={(kind) => setPicker({ key: field.key, kind })}
                          />
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <MediaPickerModal
        kind={picker?.kind ?? "photo"}
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(url) => { if (picker) set(picker.key, url); }}
      />
    </form>
  );
}

function Field({
  field, value, dirty, onChange, onPick,
}: {
  field: ContentField;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
  onPick: (kind: "photo" | "video") => void;
}) {
  const id = `content-${field.key.replace(/\./g, "-")}`;
  const isMedia = field.type === "image" || field.type === "video";
  const isWide = field.type === "textarea" || field.type === "list" || isMedia;
  const atDefault = value === (CONTENT_DEFAULTS[field.key] ?? "");

  const inputClass =
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-navy-950 outline-none transition-all focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/40";

  return (
    <div className={isWide ? "lg:col-span-2" : ""}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-navy-800">
          {field.label}
          {dirty && <span className="ml-2 text-[11px] font-semibold text-bronze-700">edited</span>}
        </label>
        {!atDefault && (
          <button
            type="button"
            onClick={() => onChange(CONTENT_DEFAULTS[field.key] ?? "")}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-navy-500 outline-none transition-colors hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500"
            title="Restore the original copy"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {isMedia ? (
        <div className="space-y-2">
          {value ? (
            <div className="flex items-center gap-3 rounded-xl border border-navy-200 bg-warm-50 p-2">
              {field.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
              ) : (
                <video src={value} muted playsInline className="h-16 w-24 shrink-0 rounded-lg bg-navy-950 object-cover" />
              )}
              <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-navy-500">{value}</p>
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label={`Remove ${field.label}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-bronze-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-navy-300 bg-warm-50 px-4 py-3 text-sm text-navy-500">
              Nothing selected.
            </p>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={() => onPick(field.type === "image" ? "photo" : "video")}
            className="gap-2 text-xs"
          >
            {field.type === "image" ? <ImageIcon className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
            {value ? "Replace" : "Choose or upload"}
          </Button>
        </div>
      ) : field.type === "textarea" || field.type === "list" ? (
        <textarea
          id={id}
          rows={field.type === "list" ? 5 : 3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}

      {field.help && <p className="mt-1.5 text-xs text-navy-500">{field.help}</p>}
    </div>
  );
}
