"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { UploadCloud, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { getBackendUrl } from "@/lib/utils/backendUrl";

const RULES = {
  photo: {
    accept: "image/jpeg,image/png,image/gif,image/webp",
    exts: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    types: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxBytes: 50 * 1024 * 1024,
    maxLabel: "50MB",
    defaultExt: ".jpg",
    folder: "photos",
    tokenUrl: "/api/photos/upload",
    registerUrl: "/api/photos",
    noun: "image",
    converts: "Converted to WebP automatically.",
    // Already in the target format, so there is nothing for the converter to do.
    optimalExt: ".webp",
    optimalLabel: "WebP",
  },
  video: {
    accept: "video/mp4,video/quicktime,video/webm",
    exts: [".mp4", ".mov", ".webm"],
    types: ["video/mp4", "video/quicktime", "video/webm"],
    maxBytes: 100 * 1024 * 1024,
    maxLabel: "100MB",
    defaultExt: ".mp4",
    folder: "videos",
    tokenUrl: "/api/videos/upload",
    registerUrl: "/api/videos",
    noun: "video",
    converts: "Converted to WebM and MP4 automatically.",
    // Already in the target format, so there is nothing for the converter to do.
    optimalExt: ".webm",
    optimalLabel: "WebM",
  },
} as const;

/**
 * Upload as a popup, so adding media is something you do from wherever you are
 * rather than a trip to a pipeline page. The transcoding itself runs in the
 * background; this closes as soon as the asset is registered.
 */
export default function MediaUploadModal({
  kind,
  open,
  onClose,
  onUploaded,
}: {
  kind: "photo" | "video";
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const rules = RULES[kind];
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(0);
  // Files held back while the operator decides what to do about an unavailable
  // converter. Null means there is nothing waiting on a decision.
  const [pending, setPending] = useState<File[] | null>(null);
  const [servedAsIs, setServedAsIs] = useState(0);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) { e.stopPropagation(); onClose(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, busy, onClose]);

  useEffect(() => {
    if (!open) { setError(""); setProgress(null); setDone(0); setPending(null); setServedAsIs(0); }
  }, [open]);

  const isAlreadyOptimal = (file: File) =>
    file.name.toLowerCase().endsWith(rules.optimalExt);

  /**
   * Ask the backend whether conversion can run before uploading anything.
   *
   * An exhausted Upstash quota makes the queue refuse every job, and the asset
   * used to sit on "converting" forever with nothing explaining why. Checking
   * first turns that into a decision the operator makes knowingly. A failed
   * check is treated as unavailable, because that is the safer assumption.
   */
  const checkConversion = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/media/conversion-status`, { cache: "no-store" });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.available === true;
    } catch {
      return false;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");

    const list = Array.from(files);
    // A file already in the target format needs no converter, so it never has to
    // wait on this question.
    if (!list.every(isAlreadyOptimal)) {
      const available = await checkConversion();
      if (!available) {
        setPending(list);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    await uploadAll(list, false);
  };

  const uploadAll = async (list: File[], skipConversion: boolean) => {
    setPending(null);
    setBusy(true);

    for (const file of list) {
      const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || rules.defaultExt).toLowerCase();

      if (!rules.types.includes(file.type as never) && !rules.exts.includes(ext as never)) {
        setError(`"${file.name}" is not a supported ${rules.noun}. Allowed: ${rules.exts.join(", ")}`);
        break;
      }
      if (file.size > rules.maxBytes) {
        setError(`"${file.name}" is larger than ${rules.maxLabel}.`);
        break;
      }

      try {
        setProgress(0);
        // The id is minted here so the original and its renditions share one
        // folder, rather than the original landing in the blob store root.
        const id = crypto.randomUUID();
        const blob = await upload(`${rules.folder}/admin/${id}/original${ext}`, file, {
          access: "public",
          handleUploadUrl: rules.tokenUrl,
          onUploadProgress: (p) => setProgress(p.percentage),
        });

        const res = await fetch(`${getBackendUrl()}${rules.registerUrl}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            inputUrl: blob.url,
            originalFileName: file.name,
            originalSize: file.size,
            originalMimeType: file.type || (kind === "photo" ? "image/jpeg" : "video/mp4"),
            userId: "admin",
            // An already-optimal file is registered as "use as-is" too: there is
            // nothing to convert, so queueing it would only burn a Redis request.
            skipConversion: skipConversion || isAlreadyOptimal(file),
          }),
        });

        // Without this the blob upload "succeeds" while no record is created and
        // the conversion job is never queued — the file just sits unconverted.
        if (!res.ok) {
          const detail = await res.json().catch(() => null);
          throw new Error(detail?.error || `Backend rejected the upload (HTTP ${res.status}).`);
        }

        // The backend also falls back to serving the original if the queue dies
        // between the check and the upload, so trust its answer over our own.
        const body = await res.json().catch(() => null);
        if (body?.converted === false) setServedAsIs((n) => n + 1);

        setDone((n) => n + 1);
      } catch (err: any) {
        setError(err?.message || `Could not upload "${file.name}".`);
        break;
      } finally {
        setProgress(null);
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    onUploaded();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Upload ${rules.noun}`}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-navy-200 bg-warm-50 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-navy-800 bg-navy-950 p-4 text-warm-50">
          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
            <UploadCloud className="h-4 w-4 text-bronze-400" />
            Upload {rules.noun}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-400 outline-none transition-colors hover:bg-navy-800 hover:text-warm-50 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {done > 0 && !busy && !error && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {done} {rules.noun}{done === 1 ? "" : "s"} uploaded.{" "}
                {servedAsIs > 0
                  ? `${servedAsIs === done ? "Serving the original file" : `${servedAsIs} serving the original file`} — no conversion was run.`
                  : "Conversion runs in the background."}
              </p>
            </div>
          )}

          {/* Conversion is unreachable and the operator has to choose. Shown
              instead of silently uploading a file that would sit on
              "converting" forever with nothing to pick it up. */}
          {pending && !busy && (
            <div className="space-y-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
              <div className="flex items-start gap-3 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold">Automatic conversion is unavailable right now.</p>
                  <p>
                    {rules.converts.replace("automatically.", "")}is temporarily offline, so{" "}
                    {pending.length === 1 ? "this file" : `these ${pending.length} files`} cannot be
                    optimised.
                  </p>
                </div>
              </div>

              <ul className="ml-1 space-y-2 text-sm text-amber-900">
                <li className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>
                    <strong>Recommended:</strong> upload a {rules.optimalLabel} file instead. It is
                    already in the format we serve, so it needs no conversion and stays small.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>
                    <strong>Or continue:</strong> the {rules.noun} is used exactly as uploaded. It
                    works everywhere immediately, just at a larger file size
                    {kind === "video" ? " and with no generated poster frame" : ""}.
                  </span>
                </li>
              </ul>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="primary"
                  className="w-full justify-center sm:w-auto"
                  onClick={() => uploadAll(pending, true)}
                  data-interactive
                >
                  Continue &amp; use as-is
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center sm:w-auto"
                  onClick={() => { setPending(null); inputRef.current?.click(); }}
                  data-interactive
                >
                  Choose a {rules.optimalLabel} file
                </Button>
              </div>
            </div>
          )}

          {/* Uploading is now just "put the file in the library". Where a piece
              of media appears, and the wording that goes with it, is decided in
              Campaigns against a named section of the site — asking for a
              taxonomy here made the first step harder than it needed to be and
              the answer was never used to place anything. */}

          <input
            ref={inputRef}
            id="media-upload-input"
            type="file"
            multiple
            accept={rules.accept}
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor="media-upload-input"
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-navy-300 bg-white px-6 py-10 text-center transition-colors hover:border-bronze-500 ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            {busy ? <Loader2 className="h-7 w-7 animate-spin text-bronze-600" /> : <UploadCloud className="h-7 w-7 text-bronze-600" />}
            <span className="font-semibold text-navy-950">
              {busy ? "Uploading…" : `Choose ${rules.noun}s`}
            </span>
            <span className="text-xs text-navy-500">
              {rules.exts.join(", ")} · up to {rules.maxLabel} each. {rules.converts}
            </span>
          </label>

          {progress !== null && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-navy-600">
                <span>Uploading</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
                <div className="h-full rounded-full bg-bronze-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-navy-200 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
              {done > 0 ? "Done" : "Cancel"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
