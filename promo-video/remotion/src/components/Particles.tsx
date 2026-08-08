import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, random } from "remotion";
import { C } from "../theme";

/**
 * One particle field, two directions.
 *
 * S07 ("customers lost") runs mode="disperse": particles drift out and dim.
 * S08 (logo reveal) runs mode="converge" with the SAME seed, so the exact
 * particles that escaped rush back in and form the wings. The narrative pivot
 * of the whole film is a single sign flip on the progress term.
 */
export const Particles: React.FC<{
  count?: number;
  mode: "disperse" | "converge";
  /** Frame the motion begins. */
  start?: number;
  /** Frames the motion takes. */
  duration?: number;
  /** How far out particles travel from centre, in px. */
  spread?: number;
  color?: string;
}> = ({ count = 140, mode, start = 0, duration = 70, spread = 620, color = C.bronze400 }) => {
  const frame = useCurrentFrame();

  // Seeded once so both scenes agree on where every particle lives.
  const seeds = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        angle: random(`a${i}`) * Math.PI * 2,
        dist: 0.35 + random(`d${i}`) * 0.65,
        size: 2 + random(`s${i}`) * 4.5,
        delay: random(`t${i}`) * 16,
        drift: (random(`r${i}`) - 0.5) * 0.6,
      })),
    [count]
  );

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {seeds.map((s, i) => {
        const local = frame - start - s.delay;
        const raw = interpolate(local, [0, duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Ease so particles decelerate as they arrive / accelerate as they leave.
        const eased = 1 - Math.pow(1 - raw, 3);
        // The sign flip. converge: outside -> centre. disperse: centre -> outside.
        const t = mode === "converge" ? 1 - eased : eased;

        const radius = t * spread * s.dist;
        const angle = s.angle + s.drift * eased;
        const x = Math.cos(angle) * radius;
        // Dispersing customers drift upward as they leave; converging ones fly straight in.
        const y = Math.sin(angle) * radius - (mode === "disperse" ? eased * 130 : 0);

        const opacity =
          mode === "disperse"
            ? interpolate(eased, [0, 0.55, 1], [0.95, 0.6, 0])
            : interpolate(eased, [0, 0.35, 1], [0, 0.85, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: color,
              opacity,
              transform: `translate(${x}px, ${y}px)`,
              boxShadow: `0 0 ${s.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
