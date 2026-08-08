/**
 * Tokens lifted from frontend/app/globals.css so the film and the site cannot
 * drift apart. `void` and the glass values are film-only additions — the site
 * is light-mode and has no equivalent.
 */
export const C = {
  void: "#070B14",
  navy950: "#0F172A",
  navy900: "#16213D",
  navy800: "#22304D",
  navy700: "#2E3F5C",
  navy300: "#8891A3",
  bronze600: "#A15E28",
  bronze500: "#B87333",
  bronze400: "#C68E57",
  bronze300: "#D4A87A",
  warm50: "#FFF8EF",
  glass: "rgba(255,255,255,0.04)",
  glassStroke: "rgba(255,255,255,0.08)",
  glassTop: "inset 0 1px 0 rgba(255,255,255,0.12)",
} as const;

export const FONT_DISPLAY = '"League Spartan", system-ui, sans-serif';
export const FONT_BODY = '"DM Sans", system-ui, sans-serif';

/** Cinematic easing — the same curve as the site's --ease-out-expo token. */
export const EASE_OUT_EXPO = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const SPRING = {
  enter: { damping: 14, mass: 0.8, stiffness: 100 },
  hero: { damping: 12, mass: 1, stiffness: 90 },
  settle: { damping: 22, mass: 0.6, stiffness: 120 },
} as const;

/** Full-bleed cinematic backdrop shared by every scene. */
export const filmBackground: React.CSSProperties = {
  background: `radial-gradient(ellipse 120% 80% at 50% 40%, ${C.navy900} 0%, ${C.navy950} 45%, ${C.void} 100%)`,
};

/** Glassmorphism surface. The inset top highlight is what sells it as glass. */
export const glassPanel = (radius = 20): React.CSSProperties => ({
  background: C.glass,
  border: `1px solid ${C.glassStroke}`,
  borderRadius: radius,
  boxShadow: `${C.glassTop}, 0 24px 60px rgba(0,0,0,0.45)`,
  backdropFilter: "blur(24px)",
});
