"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminNavList, AdminLogoutButton } from "./AdminNav";

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, focus moved into the panel and returned to the trigger on
  // close, and the page behind held still while the drawer is up.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
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
      document.body.style.overflow = overflow;
      (previouslyFocused ?? triggerRef.current)?.focus();
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-navy-950 transition-colors outline-none hover:bg-navy-100 focus-visible:ring-2 focus-visible:ring-bronze-500"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            tabIndex={-1}
            className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-navy-950 text-warm-50 shadow-xl outline-none animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between border-b border-navy-800 p-4">
              <div className="flex items-center gap-3">
                <img src="/logo-svg/Dark%20BG%20ICON.svg" alt="" className="h-6 w-auto" />
                <span className="font-display text-lg font-bold leading-none tracking-tight">
                  Vision Wings
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-300 transition-colors outline-none hover:bg-navy-900 hover:text-warm-50 focus-visible:ring-2 focus-visible:ring-bronze-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-4 py-6">
              <AdminNavList onNavigate={() => setIsOpen(false)} />
            </div>

            <div className="border-t border-navy-800 p-4">
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
