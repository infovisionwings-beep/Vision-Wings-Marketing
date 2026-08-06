"use client";

import { useEffect, ReactNode } from "react";

/**
 * Lenis is imported inside the effect rather than at module scope. It wraps
 * every page through the root layout, so a static import put the whole smooth
 * scrolling library in the first bundle every visitor downloads — before any
 * scrolling can happen. Loading it after mount costs nothing visible: the page
 * scrolls natively until Lenis takes over a frame later.
 *
 * It is also skipped entirely for readers who asked for reduced motion, who
 * should not be paying for a scroll-easing library they will never see.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      }

      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
