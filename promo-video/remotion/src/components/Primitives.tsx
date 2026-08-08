import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, SPRING, filmBackground, glassPanel } from "../theme";
import { useLayout } from "../LayoutContext";

/** Cinematic stage: film backdrop + vignette + grain. Wraps every scene. */
export const Stage: React.FC<{
  children: React.ReactNode;
  /** 1.0 = full grade. Acts I-II run desaturated to match the story. */
  grade?: number;
}> = ({ children, grade = 1 }) => (
  <AbsoluteFill style={filmBackground}>
    <AbsoluteFill style={{ filter: `saturate(${88 + grade * 12}%)` }}>{children}</AbsoluteFill>
    {/* Vignette */}
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    />
    <Grain />
  </AbsoluteFill>
);

/** 2-3% monochrome grain. Kills the clean-digital look; reads as film. */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        // Shifting the position each frame keeps the grain alive rather than static.
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>\")",
        backgroundPosition: `${(frame * 13) % 140}px ${(frame * 7) % 140}px`,
      }}
    />
  );
};

/** Frame-driven fade + rise. The workhorse entry animation. */
export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, distance = 34, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.enter });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Display headline. Sizes are authored for 16:9 and auto-scale in portrait. */
export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 78, weight = 300, color = C.warm50, style }) => {
  const { fs } = useLayout();
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: fs(size),
        fontWeight: weight,
        color,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 30, color = C.navy300, style }) => {
  const { fs } = useLayout();
  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        fontSize: fs(size),
        fontWeight: 500,
        color,
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Glass card surface. */
export const Glass: React.FC<{
  children?: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
}> = ({ children, radius = 20, style }) => (
  <div style={{ ...glassPanel(radius), ...style }}>{children}</div>
);

/**
 * Odometer-style counter. Driven by spring rather than a linear interpolate —
 * a linear ramp through Math.round visibly stutters.
 */
export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
  weight?: number;
}> = ({ to, from = 0, delay = 0, prefix = "", suffix = "", size = 96, color = C.warm50, weight = 600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs } = useLayout();
  const p = spring({ frame: frame - delay, fps, config: SPRING.settle });
  const value = Math.round(from + (to - from) * p);
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: fs(size),
        fontWeight: weight,
        color,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </div>
  );
};

/**
 * Specular sweep — the detail that makes a mark feel machined rather than
 * placed. Overlay-blended gradient travelling across the child.
 */
export const Sweep: React.FC<{
  start: number;
  duration?: number;
  children: React.ReactNode;
}> = ({ start, duration = 20, children }) => {
  const frame = useCurrentFrame();
  const active = frame >= start && frame <= start + duration;

  // A brightened DUPLICATE of the child, masked to a travelling diagonal band.
  // Masking the copy (rather than blending a gradient over the top) means the
  // shine can only ever appear on the artwork's own pixels — an overlay div
  // lights up the empty background around it and reads as a floating bar.
  const pos = interpolate(frame, [start, start + duration], [140, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const band = "linear-gradient(105deg, transparent 42%, #000 50%, transparent 58%)";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      {active ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            filter: "brightness(2.8) saturate(0.35)",
            WebkitMaskImage: band,
            maskImage: band,
            WebkitMaskSize: "300% 100%",
            maskSize: "300% 100%",
            WebkitMaskPosition: `${pos}% 0`,
            maskPosition: `${pos}% 0`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

/** Bronze bloom behind hero elements. Animates opacity only — never blur radius. */
export const Bloom: React.FC<{ delay?: number; size?: number; intensity?: number }> = ({
  delay = 0,
  size = 620,
  intensity = 0.38,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 26], [0, intensity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          opacity: o,
          background: `radial-gradient(circle, ${C.bronze500} 0%, transparent 68%)`,
          filter: "blur(70px)",
        }}
      />
    </AbsoluteFill>
  );
};
