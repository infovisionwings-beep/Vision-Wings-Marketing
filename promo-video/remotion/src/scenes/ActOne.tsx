import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, SPRING } from "../theme";
import { Glass, Headline, Label, Rise, Stage } from "../components/Primitives";
import { Particles } from "../components/Particles";
import { useLayout } from "../LayoutContext";

const centred: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

/* ── S01 · Cold Open — a city of dark windows, one lit ───────────────────── */
export const S01ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();

  const cols = 26;
  const rows = 16;
  const windows = useMemo(
    () =>
      new Array(cols * rows).fill(0).map((_, i) => ({
        lit: random(`w${i}`) > 0.88,
        alpha: 0.04 + random(`o${i}`) * 0.1,
      })),
    []
  );

  // Slow push-in. Never linear.
  const scale = interpolate(frame, [0, 100], [1, 1.08]);
  const heroPulse = 0.75 + Math.sin(frame / 12) * 0.25;

  return (
    <Stage grade={0.15}>
      <AbsoluteFill style={{ ...centred, transform: `scale(${scale})` }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: Math.max(width, height) * 0.012,
            width: "115%",
            transform: "perspective(1400px) rotateX(24deg)",
          }}
        >
          {windows.map((w, i) => {
            const isHero = i === Math.floor(cols * rows * 0.46) + 3;
            return (
              <div
                key={i}
                style={{
                  aspectRatio: "1 / 1.6",
                  borderRadius: 2,
                  background: isHero
                    ? C.bronze400
                    : `rgba(200,215,240,${w.lit ? w.alpha + 0.05 : w.alpha * 0.35})`,
                  opacity: isHero ? heroPulse : 1,
                  boxShadow: isHero ? `0 0 46px ${C.bronze500}, 0 0 90px ${C.bronze600}` : undefined,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${C.void} 0%, transparent 35%, transparent 60%, ${C.void} 100%)`,
        }}
      />
    </Stage>
  );
};

/* ── S02 · Hook line one — rack focus out of bokeh ───────────────────────── */
export const S02HookOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad } = useLayout();
  // Focus pulls to the words: text sharpens as background softens.
  const blur = interpolate(frame, [0, 26], [14, 0], { extrapolateRight: "clamp" });
  const bgBlur = interpolate(frame, [0, 40], [6, 24], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const bokeh = useMemo(
    () =>
      new Array(22).fill(0).map((_, i) => ({
        x: random(`bx${i}`) * 100,
        y: random(`by${i}`) * 100,
        s: 40 + random(`bs${i}`) * 160,
        o: 0.05 + random(`bo${i}`) * 0.16,
      })),
    []
  );

  return (
    <Stage grade={0.2}>
      <AbsoluteFill style={{ filter: `blur(${bgBlur}px)` }}>
        {bokeh.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.s,
              height: b.s,
              borderRadius: "50%",
              background: i % 3 === 0 ? C.bronze500 : "#2E3F5C",
              opacity: b.o,
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ ...centred, padding: pad }}>
        <div style={{ filter: `blur(${blur}px)`, opacity }}>
          <Headline size={78}>Every day, remarkable businesses</Headline>
          <Headline size={78} weight={500}>
            go unnoticed.
          </Headline>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S03 · Hook turn — two equal businesses, one visible ─────────────────── */
export const S03HookTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isPortrait, pad, fs } = useLayout();

  const lift = spring({ frame: frame - 18, fps, config: SPRING.enter });
  const cardH = isPortrait ? 190 : 210;

  const Card: React.FC<{ visible: boolean }> = ({ visible }) => (
    <Glass
      radius={22}
      style={{
        width: isPortrait ? "100%" : 320,
        height: cardH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: visible ? `translateY(${-lift * 26}px) scale(${1 + lift * 0.05})` : "none",
        borderColor: visible ? `rgba(184,115,51,${0.25 + lift * 0.55})` : C.glassStroke,
        boxShadow: visible
          ? `${C.glassTop}, 0 0 ${lift * 70}px rgba(184,115,51,${lift * 0.45}), 0 24px 60px rgba(0,0,0,0.5)`
          : `${C.glassTop}, 0 24px 60px rgba(0,0,0,0.45)`,
        opacity: visible ? 1 : interpolate(lift, [0, 1], [1, 0.42]),
      }}
    >
      <div
        style={{
          width: "62%",
          height: 8,
          borderRadius: 4,
          background: visible ? C.bronze500 : C.navy800,
          opacity: visible ? 0.4 + lift * 0.6 : 0.5,
        }}
      />
    </Glass>
  );

  return (
    <Stage grade={0.35}>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(52) }}>
        <div
          style={{
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            gap: fs(34),
            width: isPortrait ? "78%" : "auto",
          }}
        >
          <Card visible={false} />
          <Card visible />
        </div>
        <Rise delay={26}>
          <Headline size={72}>Your competitors aren&rsquo;t better.</Headline>
          <Headline size={72} weight={500} color={C.bronze400}>
            They&rsquo;re simply easier to find.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S04 · Invisible — buried at #47 ─────────────────────────────────────── */
export const S04Invisible: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, pad, fs } = useLayout();
  const query = "best restaurant near me";
  const typed = query.slice(0, Math.floor(interpolate(frame, [4, 34], [0, query.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  return (
    <Stage grade={0.25}>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(30) }}>
        <Glass
          radius={999}
          style={{
            width: isPortrait ? "94%" : 700,
            padding: `${fs(20)}px ${fs(34)}px`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: fs(16),
              height: fs(16),
              borderRadius: "50%",
              border: `2px solid ${C.navy300}`,
              flexShrink: 0,
            }}
          />
          <div style={{ fontFamily: FONT_BODY, fontSize: fs(32), color: C.warm50 }}>
            {typed}
            {frame % 20 < 10 ? <span style={{ color: C.bronze400 }}>|</span> : null}
          </div>
        </Glass>

        <div style={{ display: "flex", flexDirection: "column", gap: fs(12), width: isPortrait ? "94%" : 700 }}>
          {[0, 1, 2].map((i) => (
            <Rise key={i} delay={34 + i * 4}>
              <Glass radius={14} style={{ height: fs(52), display: "flex", alignItems: "center", paddingLeft: fs(22) }}>
                <div style={{ width: "45%", height: 7, borderRadius: 4, background: C.navy700 }} />
              </Glass>
            </Rise>
          ))}

          <Rise delay={52}>
            <div style={{ display: "flex", alignItems: "center", gap: fs(20), opacity: 0.55, marginTop: fs(14) }}>
              <Headline size={64} weight={600} color={C.navy300}>
                #47
              </Headline>
              <Label size={28}>your business</Label>
            </div>
          </Rise>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S05 · Slow — the load that stalls ───────────────────────────────────── */
export const S05Slow: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, pad, fs } = useLayout();
  // Crawls to 71% then stalls. The stall is the point.
  const pct = interpolate(frame, [0, 44, 84], [0, 71, 71], { extrapolateRight: "clamp" });

  return (
    <Stage grade={0.25}>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(44) }}>
        <div style={{ width: isPortrait ? "88%" : 640 }}>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.bronze500, opacity: 0.75 }} />
          </div>
        </div>
        <Rise delay={46}>
          <Headline size={68}>4.3s to load.</Headline>
          <Headline size={68} weight={500} color={C.navy300}>
            53% already left.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S06 · Flat — engagement flatlines ───────────────────────────────────── */
export const S06Flat: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, pad, fs } = useLayout();
  const draw = interpolate(frame, [0, 54], [0, 1], { extrapolateRight: "clamp" });

  return (
    <Stage grade={0.2}>
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(36) }}>
        <div style={{ width: isPortrait ? "90%" : 760, position: "relative" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 1,
                background: "rgba(255,255,255,0.05)",
                marginBottom: fs(46),
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: `${draw * 100}%`,
              height: 2,
              background: C.navy300,
              opacity: 0.6,
            }}
          />
        </div>
        <Rise delay={40}>
          <Label size={28} style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Engagement
          </Label>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S07 · Lost — customers drift away (particles disperse) ──────────────── */
export const S07Lost: React.FC = () => {
  const { pad, fs } = useLayout();
  return (
    <Stage grade={0.2}>
      <Particles mode="disperse" start={0} duration={72} count={150} spread={640} />
      <AbsoluteFill style={{ ...centred, padding: pad, gap: fs(10) }}>
        <Rise delay={12}>
          <Label size={30} style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Customers lost this month
          </Label>
        </Rise>
        <Rise delay={20}>
          <Headline size={88} weight={600} color={C.navy300}>
            &minus;312
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};
