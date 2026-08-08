import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, SPRING } from "../theme";
import { Bloom, Counter, Glass, Headline, Label, Rise, Stage, Sweep } from "../components/Primitives";
import { WingsMark } from "../components/WingsMark";
import { useLayout } from "../LayoutContext";

const centred: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

/** Shared result-scene shell so all four beats share one rhythm. */
const ResultShell: React.FC<{ eyebrow: string; children: React.ReactNode }> = ({ eyebrow, children }) => {
  const { fs, pad } = useLayout();
  return (
    <Stage>
      <Bloom delay={6} size={560} intensity={0.16} />
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(34) }}>
        <Rise delay={0}>
          <Headline size={66} weight={600}>
            {eyebrow}
          </Headline>
        </Rise>
        {children}
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S11 · Visibility — #47 climbs to #1 ─────────────────────────────────── */
export const S11Visibility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait } = useLayout();

  // Discrete rank steps, each a spring — reads as a climb, not a slide.
  const steps = [47, 12, 4, 1];
  const idx = Math.min(
    steps.length - 1,
    Math.floor(interpolate(frame, [14, 86], [0, steps.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
  );
  const rank = steps[idx];
  const pop = spring({ frame: frame - (14 + idx * 24), fps, config: SPRING.settle });
  const isTop = rank === 1;

  return (
    <ResultShell eyebrow="More Visibility">
      <div style={{ display: "flex", flexDirection: "column", gap: fs(10), width: isPortrait ? "94%" : 840 }}>
        {[0, 1, 2].map((i) => (
          <Glass
            key={i}
            radius={12}
            style={{
              height: fs(56),
              opacity: interpolate(pop, [0, 1], [0.55, 0.22]),
              display: "flex",
              alignItems: "center",
              paddingLeft: fs(20),
            }}
          >
            <div style={{ width: "40%", height: 6, borderRadius: 3, background: C.navy700 }} />
          </Glass>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: fs(22),
          transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`,
        }}
      >
        <Headline size={172} weight={600} color={isTop ? C.bronze400 : C.navy300}>
          #{rank}
        </Headline>
        {isTop ? (
          <div
            style={{
              width: fs(120),
              height: fs(6),
              borderRadius: 3,
              background: C.bronze500,
              boxShadow: `0 0 40px ${C.bronze500}`,
            }}
          />
        ) : null}
      </div>
    </ResultShell>
  );
};

/* ── S12 · Leads — enquiries stack in ────────────────────────────────────── */
const LEADS = [
  { via: "WhatsApp", text: "Table for 4 tonight?" },
  { via: "Website form", text: "Booking enquiry — 2 nights" },
  { via: "Missed call", text: "New patient appointment" },
];

export const S12Leads: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait } = useLayout();

  return (
    <ResultShell eyebrow="More Leads">
      <div style={{ display: "flex", flexDirection: "column", gap: fs(14), width: isPortrait ? "94%" : 780 }}>
        {LEADS.map((l, i) => {
          const p = spring({ frame: frame - 12 - i * 9, fps, config: SPRING.enter });
          return (
            <div
              key={l.via}
              style={{
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [70, 0])}px)`,
              }}
            >
              <Glass
                radius={16}
                style={{
                  padding: `${fs(18)}px ${fs(24)}px`,
                  display: "flex",
                  alignItems: "center",
                  gap: fs(18),
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: fs(10),
                    height: fs(10),
                    borderRadius: "50%",
                    background: C.bronze500,
                    boxShadow: `0 0 18px ${C.bronze500}`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: fs(24), color: C.warm50 }}>{l.text}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: fs(18), color: C.navy300, marginTop: 4 }}>{l.via}</div>
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
      <Rise delay={54}>
        <Label size={30} color={C.bronze400}>
          Enquiries, around the clock
        </Label>
      </Rise>
    </ResultShell>
  );
};

/* ── S13 · Bookings — a calendar fills ───────────────────────────────────── */
export const S13Bookings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fs, isPortrait } = useLayout();
  const cells = 35;
  const filled = interpolate(frame, [12, 88], [0, cells], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <ResultShell eyebrow="More Bookings">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: fs(9),
          width: isPortrait ? "90%" : 620,
        }}
      >
        {new Array(cells).fill(0).map((_, i) => {
          const on = i < filled;
          const ease = Math.max(0, Math.min(1, filled - i));
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 8,
                background: on ? C.bronze500 : "rgba(255,255,255,0.045)",
                border: `1px solid ${on ? "rgba(184,115,51,0.55)" : C.glassStroke}`,
                opacity: on ? 0.35 + ease * 0.65 : 1,
                boxShadow: on ? `0 0 ${ease * 22}px rgba(184,115,51,0.5)` : undefined,
              }}
            />
          );
        })}
      </div>
      <Rise delay={62}>
        <Label size={30} color={C.bronze400}>
          Rooms and tables, filled
        </Label>
      </Rise>
    </ResultShell>
  );
};

/* ── S14 · Sales — revenue curve draws ───────────────────────────────────── */
export const S14Sales: React.FC = () => {
  const frame = useCurrentFrame();
  const { fs, isPortrait } = useLayout();
  const draw = interpolate(frame, [10, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w = isPortrait ? 640 : 900;
  const h = fs(230);
  const pts = [0, 0.12, 0.2, 0.34, 0.46, 0.63, 0.78, 1];
  const path = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - v * h * 0.92;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <ResultShell eyebrow="More Sales">
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bronze500} stopOpacity="0.5" />
            <stop offset="100%" stopColor={C.bronze500} stopOpacity="0" />
          </linearGradient>
          <clipPath id="reveal">
            <rect x="0" y="0" width={w * draw} height={h} />
          </clipPath>
        </defs>
        <g clipPath="url(#reveal)">
          <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#rev)" />
          <path
            d={path}
            fill="none"
            stroke={C.bronze400}
            strokeWidth={4}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 14px ${C.bronze500})` }}
          />
        </g>
      </svg>
      <Rise delay={62}>
        <Label size={30} color={C.bronze400}>
          Growth you can measure
        </Label>
      </Rise>
    </ResultShell>
  );
};

/* ── S15 · Speed & Mobile ────────────────────────────────────────────────── */
export const S15Speed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait, pad } = useLayout();
  const ring = spring({ frame: frame - 14, fps, config: SPRING.settle });
  const R = fs(74);
  const circ = 2 * Math.PI * R;

  return (
    <Stage>
      <Bloom delay={8} size={520} intensity={0.16} />
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(40) }}>
        <div style={{ display: "flex", gap: fs(22), alignItems: "center" }}>
          {[0, 1, 2].map((i) => {
            const p = spring({ frame: frame - i * 6, fps, config: SPRING.enter });
            return (
              <div
                key={i}
                style={{
                  width: fs(120),
                  height: fs(240),
                  borderRadius: 20,
                  border: `1px solid rgba(255,255,255,0.14)`,
                  background: C.navy900,
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
                  padding: fs(12),
                  boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ height: fs(42), borderRadius: 8, background: C.bronze600, opacity: 0.55, marginBottom: 8 }} />
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ height: 6, borderRadius: 3, background: C.navy700, marginBottom: 7, width: `${80 - j * 14}%` }} />
                ))}
              </div>
            );
          })}
          <div style={{ position: "relative", width: R * 2 + 20, height: R * 2 + 20 }}>
            <svg width={R * 2 + 20} height={R * 2 + 20}>
              <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={9} />
              <circle
                cx={R + 10}
                cy={R + 10}
                r={R}
                fill="none"
                stroke={C.bronze500}
                strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - circ * 0.98 * ring}
                transform={`rotate(-90 ${R + 10} ${R + 10})`}
                style={{ filter: `drop-shadow(0 0 16px ${C.bronze500})` }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Counter to={98} delay={14} size={62} color={C.warm50} />
            </div>
          </div>
        </div>
        <Rise delay={44}>
          <Headline size={60} weight={400}>
            Mobile-first. Built to convert.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S16 · Craft — one frame per sector ──────────────────────────────────── */
const SECTORS = ["Hotels", "Restaurants", "Clinics", "Schools", "Retail", "Startups"];

export const S16Craft: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait, pad } = useLayout();

  return (
    <Stage>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(38) }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPortrait ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: fs(18),
            width: isPortrait ? "100%" : "80%",
          }}
        >
          {SECTORS.map((s, i) => {
            const p = spring({ frame: frame - 4 - i * 4, fps, config: SPRING.enter });
            // Depth of field falls off toward the edges.
            const edge = i === 0 || i === SECTORS.length - 1 ? 1.6 : 0;
            return (
              <div
                key={s}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`,
                  filter: `blur(${edge}px)`,
                }}
              >
                <Glass radius={16} style={{ height: fs(150), padding: fs(18), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ height: fs(52), borderRadius: 10, background: "rgba(184,115,51,0.28)" }} />
                  <div style={{ fontFamily: FONT_BODY, fontSize: fs(24), color: C.warm50, textAlign: "left" }}>{s}</div>
                </Glass>
              </div>
            );
          })}
        </div>
        <Rise delay={40}>
          <Headline size={58} weight={400}>
            Built for your sector.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S17 · Partnership — two panels lock together ────────────────────────── */
export const S17Partnership: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, pad, isPortrait } = useLayout();
  const join = spring({ frame: frame - 8, fps, config: SPRING.enter });
  const gap = interpolate(join, [0, 1], [180, 4]);
  const seam = interpolate(join, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" });

  const panel = (
    <Glass
      radius={18}
      style={{
        width: isPortrait ? fs(280) : fs(300),
        height: fs(210),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "55%", height: 7, borderRadius: 4, background: C.navy700 }} />
    </Glass>
  );

  return (
    <Stage>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(44) }}>
        <div style={{ position: "relative", display: "flex", gap, alignItems: "center" }}>
          {panel}
          {panel}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "-6%",
              width: 3,
              height: "112%",
              marginLeft: -1.5,
              background: C.bronze400,
              opacity: seam,
              boxShadow: `0 0 ${seam * 44}px ${C.bronze500}`,
            }}
          />
        </div>
        <Rise delay={34}>
          <Headline size={58} weight={400}>
            Senior-led. Fully transparent.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S18 · Ending — Your Vision. Amplified. ──────────────────────────────── */
export const S18Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, pad } = useLayout();

  const mark = spring({ frame: frame - 4, fps, config: SPRING.hero });
  // Push-in resolves, then locks absolutely still for the final beats.
  const scale = interpolate(frame, [0, 60], [1.06, 1], { extrapolateRight: "clamp" });
  // Fade to black.
  const blackout = interpolate(frame, [138, 162], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <Stage>
      <Bloom delay={4} size={760} intensity={0.34} />
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(26), transform: `scale(${scale})` }}>
        <div style={{ opacity: mark, transform: `scale(${interpolate(mark, [0, 1], [0.86, 1])})` }}>
          <Sweep start={26} duration={24}>
            <WingsMark size={fs(300)} color={C.bronze400} />
          </Sweep>
        </div>

        <Rise delay={30} distance={22}>
          <Headline size={96} weight={300}>
            Your Vision.
          </Headline>
          <Headline size={96} weight={600} color={C.bronze400}>
            Amplified.
          </Headline>
        </Rise>

        <Rise delay={62} distance={16} style={{ marginTop: fs(26) }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: fs(38),
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.warm50,
            }}
          >
            VISION WINGS MARKETING
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: fs(30),
              color: C.navy300,
              marginTop: fs(12),
            }}
          >
            visionwingsmarketing.com
          </div>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: blackout, pointerEvents: "none" }} />
    </Stage>
  );
};
