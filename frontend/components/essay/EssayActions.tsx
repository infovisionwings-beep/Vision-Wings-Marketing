"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Check, Copy, Link2, Mail, Share2, X } from "lucide-react";
import { toggleSavedEssay } from "@/app/actions/savedEssays";

interface EssayActionsProps {
  /** Absent for the hardcoded fallback essays, which have no database row to save. */
  insightId?: number | null;
  title: string;
  initiallySaved?: boolean;
}

/** Brand marks, drawn rather than borrowed: lucide has no social glyphs. */
const XMark = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z" />
  </svg>
);
const LinkedInMark = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
  </svg>
);
const FacebookMark = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.12 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96H15.83c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07" />
  </svg>
);
const WhatsAppMark = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.1 8.1 0 0 1-2.39-1.47 9 9 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.61s.3-.35.45-.52a2 2 0 0 0 .3-.5.55.55 0 0 0-.03-.52c-.07-.15-.67-1.61-.92-2.21s-.49-.5-.67-.51h-.57a1.1 1.1 0 0 0-.8.37 3.35 3.35 0 0 0-1.04 2.48 5.8 5.8 0 0 0 1.22 3.09c.15.2 2.1 3.2 5.08 4.49a17 17 0 0 0 1.7.63 4.1 4.1 0 0 0 1.87.12 3.07 3.07 0 0 0 2.01-1.42 2.5 2.5 0 0 0 .17-1.41c-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1 1.51-12.4 9.86 9.86 0 0 1 16.83 6.98 9.87 9.87 0 0 1-9.96 10.05M20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88a11.8 11.8 0 0 0 1.58 5.94L.07 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.44h.01c6.54 0 11.87-5.33 11.87-11.88a11.8 11.8 0 0 0-3.46-8.4" />
  </svg>
);

/**
 * The two controls under an essay. Sharing is deliberately open to everyone —
 * a reader who has to sign in to pass a link on simply does not pass it on —
 * while saving needs an account and says so instead of failing quietly.
 */
export default function EssayActions({ insightId, title, initiallySaved = false }: EssayActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(initiallySaved);
  const [savePending, setSavePending] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  // The absolute URL is read at click time rather than built from a prop: the
  // canonical host differs between preview and production, and window.location
  // is the one source that is right in both.
  const shareUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  useEffect(() => {
    if (!shareOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!shareRef.current?.contains(e.target as Node)) setShareOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShareOpen(false);
        shareButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shareOpen]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(null), 4000);
    return () => clearTimeout(t);
  }, [saveMessage]);

  const handleShareClick = async () => {
    // On a phone the OS sheet reaches every app the reader actually has,
    // including ones no hardcoded list would cover. The menu is the fallback,
    // not the lesser path.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl() });
        return;
      } catch (err) {
        // A dismissed sheet is not a failure — leave the menu closed.
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    setShareOpen((open) => !open);
  };

  const copyLink = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard access is refused over plain http and in some embedded
      // browsers. Selecting the text is a worse experience than a real copy but
      // a far better one than a button that does nothing.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        window.prompt("Copy this link:", url);
      }
      document.body.removeChild(field);
    }
  };

  const handleSave = async () => {
    if (!insightId) {
      setSaveMessage("This essay cannot be saved yet.");
      return;
    }

    setSavePending(true);
    // Optimistic: the reader sees the mark fill immediately, and it is put back
    // if the server disagrees.
    const previous = saved;
    setSaved(!previous);

    try {
      const result = await toggleSavedEssay(insightId);

      if (result.requiresLogin) {
        setSaved(previous);
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (result.error) {
        setSaved(previous);
        setSaveMessage(result.error);
        return;
      }
      setSaved(result.saved);
      setSaveMessage(result.saved ? "Saved to your library." : "Removed from your library.");
    } catch {
      setSaved(previous);
      setSaveMessage("Could not save right now. Please try again.");
    } finally {
      setSavePending(false);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const targets = (url: string) => [
    { label: "X", href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(url)}`, Mark: XMark },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, Mark: LinkedInMark },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, Mark: FacebookMark },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(url)}`, Mark: WhatsAppMark },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(url)}`, Mark: Mail },
  ];

  const buttonClass =
    "inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-white border border-navy-200 hover:border-navy-400 font-semibold text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-bronze-500";

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <div className="relative" ref={shareRef}>
          <button
            ref={shareButtonRef}
            type="button"
            onClick={handleShareClick}
            aria-expanded={shareOpen}
            aria-haspopup="menu"
            className={buttonClass}
            data-interactive
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Essay</span>
          </button>

          {shareOpen && (
            <div
              role="menu"
              aria-label="Share this essay"
              /* Anchored to the button's left edge on narrow screens: right-0 on a
                 240px menu hanging off a button whose right edge sits at ~145px
                 pushed it 95px past the viewport, where the clipped container made
                 those items unreachable rather than merely ugly. */
              className="absolute bottom-full left-0 z-30 mb-2 w-60 rounded-2xl border border-navy-200 bg-white p-2 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] sm:left-auto sm:right-0"
            >
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-navy-400">
                  Share
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShareOpen(false);
                    shareButtonRef.current?.focus();
                  }}
                  aria-label="Close share menu"
                  className="rounded-md p-1 text-navy-400 outline-none hover:bg-navy-50 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-bronze-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {targets(shareUrl()).map(({ label, href, Mark }) => (
                <a
                  key={label}
                  role="menuitem"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex min-h-[44px] items-center gap-3 rounded-lg px-2.5 text-sm font-medium text-navy-800 outline-none transition-colors hover:bg-warm-100 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-bronze-500"
                  data-interactive
                >
                  <Mark className="h-4 w-4 text-navy-500" />
                  <span>{label}</span>
                </a>
              ))}

              <button
                role="menuitem"
                type="button"
                onClick={copyLink}
                className="mt-1 flex min-h-[44px] w-full items-center gap-3 rounded-lg border-t border-navy-100 px-2.5 text-sm font-medium text-navy-800 outline-none transition-colors hover:bg-warm-100 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-bronze-500"
                data-interactive
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-bronze-600" />
                    <span className="text-bronze-700">Link copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 text-navy-500" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={savePending}
          aria-pressed={saved}
          className={`${buttonClass} ${
            saved ? "border-bronze-500 bg-bronze-50 text-bronze-800 hover:border-bronze-600" : ""
          } disabled:opacity-60`}
          data-interactive
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="min-h-[16px] text-[11px] font-mono text-navy-500">
        {copied ? "Link copied to clipboard." : saveMessage}
      </p>
    </div>
  );
}
