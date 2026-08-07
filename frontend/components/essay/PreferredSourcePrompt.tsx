"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Star, X, ArrowUpRight } from "lucide-react";

/** One key for the whole site, not one per article — dismissing this on a
 *  Tuesday essay means dismissing it, not deferring it to the next one.
 *  sessionStorage rather than localStorage: the reader sees it again on a new
 *  browser session, which is what "once per session" means here. */
const DISMISSED_KEY = "vw:preferred-source-prompt-dismissed";

/**
 * Asks a signed-in reader to add the site as a Google preferred source.
 *
 * Deliberately not shown the instant the page paints: a dialog that lands on
 * top of an article before it has been read is an interruption, not an ask.
 * It waits until the reader is far enough in to have got something out of it.
 */
const SCROLL_TRIGGER_RATIO = 0.4;

export default function PreferredSourcePrompt({ href }: { href: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // A short article that cannot be scrolled would never reach the ratio,
      // so treat "nothing to scroll" as already read.
      if (scrollable <= 0 || window.scrollY / scrollable >= SCROLL_TRIGGER_RATIO) {
        setIsOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mark dismissed on close however it happened, so the Escape key and the
  // backdrop are not quietly weaker than the close button.
  const close = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  // Portalled to <body> for the same reason the admin drawer is: the article
  // page has backdrop-filtered ancestors, and a filter makes an element the
  // containing block for its fixed-position descendants.
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
      <div
        className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferred-source-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-navy-200 bg-white p-6 shadow-2xl outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-navy-400 transition-colors outline-none hover:bg-warm-200 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <Star className="mt-0.5 h-5 w-5 shrink-0 text-bronze-600" />
          <div>
            <h2 id="preferred-source-title" className="font-display text-base font-bold text-navy-950">
              Follow Vision Wings on Google
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-600">
              Add us as a preferred source and our work shows up more often in your
              Top Stories and AI Overviews.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-semibold text-navy-600 transition-colors outline-none hover:bg-warm-200 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-bronze-500"
          >
            Not now
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={close}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-navy-950 px-4 text-sm font-bold text-warm-50 transition-colors outline-none hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500"
            data-interactive
          >
            <span>Add as preferred source</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
