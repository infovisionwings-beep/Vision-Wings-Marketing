"use client";

import { useEffect, useRef } from "react";
import { Image as ImageIcon, Film, X } from "lucide-react";
import { AdminPhotoManager } from "./AdminPhotoManager";
import { AdminVideoManager } from "./AdminVideoManager";

/**
 * The one media picker. CampaignForm and InsightForm each carried their own copy
 * of this overlay (four near-identical blocks), which is why the picker was
 * unreachable from anywhere else — including the section editors that need it
 * most. Both managers already accept `isModal` + an `onSelect*` callback; this
 * just gives them a shared, focus-trapped shell.
 *
 * Upload lives inside the picker: the dropzone is the first thing in each
 * manager, so "choose media" and "add media" are the same popup rather than a
 * separate page in the nav.
 */
export default function MediaPickerModal({
  kind,
  open,
  onClose,
  onSelect,
  title,
}: {
  kind: "photo" | "video";
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, focus starts inside, and focus cannot tab out of the dialog.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isPhoto = kind === "photo";
  const Icon = isPhoto ? ImageIcon : Film;
  const heading = title || (isPhoto ? "Choose or upload an image" : "Choose or upload a video");

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="bg-warm-50 w-full max-w-5xl h-[85vh] rounded-2xl border border-navy-800 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-4 bg-navy-950 text-warm-50 flex items-center justify-between border-b border-navy-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="w-4 h-4 text-bronze-400 shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider truncate">{heading}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close media picker"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy-400 transition-colors outline-none hover:bg-navy-800 hover:text-warm-50 focus-visible:ring-2 focus-visible:ring-bronze-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isPhoto ? (
            <AdminPhotoManager isModal onSelectPhoto={(url: string) => { onSelect(url); onClose(); }} />
          ) : (
            <AdminVideoManager isModal onSelectVideo={(url: string) => { onSelect(url); onClose(); }} />
          )}
        </div>
      </div>
    </div>
  );
}
