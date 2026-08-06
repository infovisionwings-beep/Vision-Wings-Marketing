"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Loader2, Pencil, Archive, ArchiveRestore, Trash2,
  AlertCircle, CheckCircle2, Clock, ChevronDown, Star, RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { EditMediaModal } from "./EditMediaModal";
import MediaUploadModal from "./MediaUploadModal";
import { MEDIA_CATEGORIES } from "@/lib/media/categories";
import {
  getAdminMedia, softDeleteMedia, permanentlyDeleteMedia, updateMedia,
} from "@/app/actions/mediaActions";

type Kind = "photos" | "videos";
type StatusFilter = "active" | "archived" | "all";

export interface Asset {
  id: string;
  originalFileName: string;
  status: string;              // transcoding state
  publishStatus?: string;      // published | draft | archived
  category?: string | null;
  heading?: string | null;
  isStarred?: boolean;
  createdAt: string;
  errorMessage?: string | null;
  inputPath: string;
  webpPath?: string | null;
  thumbnailPath?: string | null;
  webmPath?: string | null;
  mp4Path?: string | null;
  logs?: { timestamp: string; stage: string; message: string }[];
}

const previewOf = (a: Asset, kind: Kind) =>
  kind === "photos"
    ? a.thumbnailPath || a.webpPath || a.inputPath
    : a.thumbnailPath || "";

/** The URL a section should actually reference once conversion has finished. */
const deliverableOf = (a: Asset, kind: Kind) =>
  kind === "photos"
    ? a.webpPath || a.inputPath
    : a.webmPath || a.mp4Path || a.inputPath;

const isProcessing = (a: Asset) =>
  a.status !== "completed" && a.status !== "failed";

/**
 * The media library as an asset manager rather than a pipeline console.
 *
 * The transcoding telemetry that used to fill this screen is infrastructure, not
 * a feature: it now collapses to a one-line status on the card, with the full
 * worker log behind a disclosure for when something actually fails.
 *
 * `onSelect` turns the same grid into the picker, so choosing media and managing
 * media are one UI instead of two.
 */
export default function MediaAssetGrid({
  kind,
  onSelect,
}: {
  kind: Kind;
  /** The full asset comes with the URL: callers that embed video need both
   *  renditions to write a dual-source tag, not just one URL. */
  onSelect?: (url: string, asset: Asset) => void;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const noun = kind === "photos" ? "photo" : "video";

  const load = useCallback(async () => {
    const res = await getAdminMedia(kind);
    if (res.success) {
      setAssets(res.data || []);
      setError("");
    } else {
      setError(res.error || "Could not load media.");
    }
    setLoading(false);
  }, [kind]);

  useEffect(() => { load(); }, [load]);

  // Poll only while something is mid-conversion, instead of every 4s forever.
  const anyProcessing = assets.some(isProcessing);
  useEffect(() => {
    if (!anyProcessing) return;
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [anyProcessing, load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((a) => {
      const archived = a.publishStatus === "archived";
      if (statusFilter === "active" && archived) return false;
      if (statusFilter === "archived" && !archived) return false;
      if (category !== "ALL" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.originalFileName.toLowerCase().includes(q) ||
        (a.heading || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q)
      );
    });
  }, [assets, query, category, statusFilter]);

  const archivedCount = assets.filter((a) => a.publishStatus === "archived").length;

  const act = async (id: string, fn: () => Promise<{ success?: boolean; error?: string }>) => {
    setBusyId(id);
    const res = await fn();
    if (res.error) setError(res.error);
    else setError("");
    await load();
    setBusyId(null);
  };

  const togglePublish = (a: Asset) => {
    const nextStatus = a.publishStatus === "published" ? "draft" : "published";
    return act(a.id, () => updateMedia(kind, a.id, { ...a, publishStatus: nextStatus }));
  };

  const archive = (a: Asset) => act(a.id, () => softDeleteMedia(kind, a.id));

  const restore = (a: Asset) =>
    act(a.id, () => updateMedia(kind, a.id, { ...a, publishStatus: "draft" }));

  const destroy = (a: Asset) => {
    if (!confirm(`Permanently delete "${a.heading || a.originalFileName}"?\n\nThis removes the file from storage and cannot be undone.`)) return;
    return act(a.id, () => permanentlyDeleteMedia(kind, a.id));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind}…`}
            aria-label={`Search ${kind}`}
            className="min-h-[44px] w-full rounded-xl border border-navy-200 bg-white pl-9 pr-4 text-navy-950 outline-none focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/40"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="min-h-[44px] rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-950 outline-none focus:border-bronze-500"
        >
          <option value="ALL">All categories</option>
          {MEDIA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filter by status"
          className="min-h-[44px] rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-950 outline-none focus:border-bronze-500"
        >
          <option value="active">Active</option>
          <option value="archived">Archived{archivedCount ? ` (${archivedCount})` : ""}</option>
          <option value="all">All</option>
        </select>

        <Button type="button" variant="secondary" onClick={load} className="gap-2 text-xs" aria-label="Refresh">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>

        <Button type="button" variant="primary" onClick={() => setUploadOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-navy-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-300 bg-warm-50 px-6 py-16 text-center">
          <p className="font-semibold text-navy-950">
            {assets.length === 0 ? `No ${kind} yet.` : `No ${kind} match those filters.`}
          </p>
          <p className="mt-1 text-sm text-navy-500">
            {assets.length === 0 ? `Upload your first ${noun} to get started.` : "Try clearing the search or category."}
          </p>
          {assets.length === 0 && (
            <Button type="button" variant="primary" onClick={() => setUploadOpen(true)} className="mt-5 gap-2">
              <Plus className="h-4 w-4" />
              Upload {noun}
            </Button>
          )}
        </div>
      ) : (
        // Masonry via CSS columns rather than a fixed grid. Every tile used to be
        // forced to 16:9, so a portrait photo sat letterboxed inside a landscape
        // box and a phone showed one tall card at a time. Columns let each brick
        // take its own height, which fits how mixed this library actually is.
        <ul className="columns-2 gap-4 xl:columns-3">
          {visible.map((a) => {
            const preview = previewOf(a, kind);
            const processing = isProcessing(a);
            const failed = a.status === "failed";
            const archived = a.publishStatus === "archived";
            const busy = busyId === a.id;

            return (
              <li
                key={a.id}
                className={`mb-4 flex break-inside-avoid flex-col overflow-hidden rounded-2xl border bg-white transition-colors ${
                  archived ? "border-navy-200 opacity-70" : "border-navy-200"
                }`}
              >
                <div className="relative bg-navy-950">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt=""
                      className="block h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    // No image to size the brick, so this one keeps a reserved box.
                    <div className="flex aspect-video items-center justify-center text-xs font-mono text-navy-400">
                      {processing ? "Processing…" : "No preview"}
                    </div>
                  )}

                  <span
                    className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      failed ? "bg-red-100 text-red-800"
                      : processing ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {failed ? <AlertCircle className="h-3 w-3" />
                      : processing ? <Clock className="h-3 w-3" />
                      : <CheckCircle2 className="h-3 w-3" />}
                    {failed ? "Failed" : processing ? "Converting" : "Ready"}
                  </span>

                  {archived && (
                    <span className="absolute right-2 top-2 rounded-full bg-navy-950/85 px-2 py-0.5 text-[11px] font-semibold text-warm-50">
                      Archived
                    </span>
                  )}
                  {!archived && (
                    <button
                      type="button"
                      onClick={() => togglePublish(a)}
                      disabled={busy}
                      className={`absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all shadow-md active:scale-95 ${
                        a.publishStatus === "published"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                      title="Click to toggle Public / Draft status"
                    >
                      {a.publishStatus === "published" ? "Published" : "Draft"}
                    </button>
                  )}
                  {a.isStarred && !archived && (
                    <Star className="absolute right-2 top-2 h-4 w-4 fill-bronze-400 text-bronze-400" aria-label="Starred" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-950" title={a.originalFileName}>
                      {a.heading || a.originalFileName}
                    </p>
                    <p className="truncate text-xs text-navy-500">{a.category || "Uncategorised"}</p>
                  </div>

                  {failed && (
                    <p className="rounded-lg bg-red-50 p-2 text-xs text-red-800">
                      {a.errorMessage || "Conversion failed."}
                    </p>
                  )}

                  {/* The worker log is diagnostics, not the main event — collapsed. */}
                  {(failed || processing) && a.logs && a.logs.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedLog(expandedLog === a.id ? null : a.id)}
                        aria-expanded={expandedLog === a.id}
                        className="inline-flex items-center gap-1 text-xs text-navy-500 outline-none hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500"
                      >
                        <ChevronDown className={`h-3 w-3 transition-transform ${expandedLog === a.id ? "rotate-180" : ""}`} />
                        Conversion log
                      </button>
                      {expandedLog === a.id && (
                        <div className="mt-2 max-h-32 overflow-auto rounded-lg bg-navy-950 p-2 font-mono text-[10px] leading-relaxed text-navy-300">
                          {a.logs.map((l, i) => (
                            <div key={i}>
                              <span className="text-navy-500">[{l.timestamp}]</span> {l.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-navy-100 pt-3">
                    {onSelect && !archived && (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => onSelect(deliverableOf(a, kind), a)}
                        disabled={processing}
                        className="gap-1.5 text-xs"
                        title={processing ? "Wait for conversion to finish" : undefined}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Use this
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditing(a)}
                      disabled={busy}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                      aria-label={`Edit ${a.originalFileName}`}
                      title="Edit details"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {archived ? (
                      <>
                        <button
                          type="button"
                          onClick={() => restore(a)}
                          disabled={busy}
                          className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                          aria-label={`Restore ${a.originalFileName}`}
                          title="Restore from archive"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArchiveRestore className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => destroy(a)}
                          disabled={busy}
                          className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                          aria-label={`Delete ${a.originalFileName} permanently`}
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => archive(a)}
                        disabled={busy}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                        aria-label={`Archive ${a.originalFileName}`}
                        title="Archive"
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <MediaUploadModal
        kind={kind === "photos" ? "photo" : "video"}
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={load}
      />

      {editing && (
        <EditMediaModal
          media={editing}
          type={kind}
          onClose={() => setEditing(null)}
          onRefresh={load}
        />
      )}
    </div>
  );
}
