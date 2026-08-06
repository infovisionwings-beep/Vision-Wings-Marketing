"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CursorAperture = dynamic(() => import("./CursorAperture"), { ssr: false });

/**
 * The custom cursor is decoration that only ever runs on a fine pointer, but it
 * pulled framer-motion into the first bundle of every page — including on phones,
 * where it immediately returns null.
 *
 * This gates the import on the same media query the component itself checks, so
 * touch devices never download the animation library at all, and desktop
 * downloads it after the page is interactive rather than before.
 */
export default function DeferredCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Wait for the browser to go idle so the cursor never competes with
    // hydration or the LCP image for bandwidth.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => setEnabled(true), { timeout: 2000 })
      : window.setTimeout(() => setEnabled(true), 1000);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, []);

  return enabled ? <CursorAperture /> : null;
}
