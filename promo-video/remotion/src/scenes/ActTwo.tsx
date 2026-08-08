import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, SPRING } from "../theme";
import { Bloom, Glass, Headline, Label, Rise, Stage, Sweep } from "../components/Primitives";
import { Particles } from "../components/Particles";
import { WingsMark } from "../components/WingsMark";
import { useLayout } from "../LayoutContext";

const centred: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

/* ── S08 · Logo Reveal — the particles come back ─────────────────────────── */
export const S08Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait } = useLayout();

  // Mark strikes in after the particles have converged.
  const strike = spring({ frame: frame - 44, fps, config: SPRING.hero });
  const markOpacity = interpolate(frame, [42, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(strike, [0, 1], [1.15, 1]);

  return (
    <Stage>
      <Particles mode="converge" start={0} duration={54} count={150} spread={640} />
      <Bloom delay={44} size={isPortrait ? 520 : 700} intensity={0.4} />
      <AbsoluteFill style={{ ...centred, gap: fs(30) }}>
        <div style={{ transform: `scale(${scale})`, opacity: markOpacity }}>
          <Sweep start={56} duration={22}>
            <WingsMark size={fs(470)} color={C.bronze400} />
          </Sweep>
        </div>
        <Rise delay={62} distance={20}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: fs(42),
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.warm50,
            }}
          >
            VISION WINGS MARKETING
          </div>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S09 · Services constellation — one system, not eight vendors ────────── */
const SERVICES = [
  "Branding",
  "Web Development",
  "SEO",
  "Performance Marketing",
  "Google Business Profile",
  "Content Strategy",
  "Social Media",
  "AI-Powered Marketing",
];

export const S09Services: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait, pad } = useLayout();

  // Slow yaw across the scene — the plane is alive, never static.
  const yaw = interpolate(frame, [0, 134], [-6, 6]);

  return (
    <Stage>
      <Bloom delay={0} size={isPortrait ? 460 : 620} intensity={0.16} />
      <AbsoluteFill style={{ ...centred, padding: pad }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPortrait ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: fs(18),
            transform: `perspective(1600px) rotateX(${isPortrait ? 8 : 14}deg) rotateY(${yaw}deg)`,
            width: isPortrait ? "100%" : "84%",
          }}
        >
          {SERVICES.map((s, i) => {
            const p = spring({ frame: frame - 6 - i * 4, fps, config: SPRING.enter });
            return (
              <div
                key={s}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                }}
              >
                <Glass
                  radius={16}
                  style={{
                    padding: `${fs(22)}px ${fs(16)}px`,
                    minHeight: fs(86),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: fs(26),
                      fontWeight: 500,
                      color: C.warm50,
                      opacity: 0.92,
                      lineHeight: 1.25,
                    }}
                  >
                    {s}
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
        <Rise delay={54} style={{ marginTop: fs(46) }}>
          <Label size={28} color={C.bronze400} style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>
            One partner &middot; one system
          </Label>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

/* ── S10 · The Work — the only website footage in the film ───────────────── */
export const S10TheWork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fs, isPortrait, pad } = useLayout();

  const p = spring({ frame: frame - 4, fps, config: SPRING.enter });
  // Parallax: browser and phone drift at different rates. Different rate = depth.
  const browserX = interpolate(frame, [0, 134], [0, -30]);
  const phoneX = interpolate(frame, [0, 134], [0, 50]);
  // Page scrolls inside the frame.
  const scroll = interpolate(frame, [14, 120], [0, -220], { extrapolateRight: "clamp" });

  const browserW = isPortrait ? 620 : 1160;

  return (
    <Stage>
      <Bloom delay={0} size={isPortrait ? 520 : 760} intensity={0.2} />
      <AbsoluteFill style={{ ...centred, padding: pad }}>
        <div
          style={{
            position: "relative",
            opacity: p,
            transform: `perspective(1800px) rotateY(${isPortrait ? -10 : -18}deg) rotateX(6deg) translateX(${browserX}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              width: browserW,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${C.glassStroke}`,
              boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 90px rgba(184,115,51,0.18)`,
              background: C.navy950,
            }}
          >
            <div
              style={{
                height: fs(42),
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 18,
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
              ))}
              <div
                style={{
                  marginLeft: 18,
                  fontFamily: FONT_BODY,
                  fontSize: fs(16),
                  color: C.navy300,
                }}
              >
                visionwingsmarketing.com
              </div>
            </div>
            {/* Page content */}
            <div style={{ height: fs(400), overflow: "hidden", position: "relative" }}>
              <div style={{ transform: `translateY(${scroll}px)`, padding: fs(40) }}>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: fs(46),
                    fontWeight: 600,
                    color: C.warm50,
                    marginBottom: fs(20),
                  }}
                >
                  We give wings to your vision
                </div>
                {[0.7, 0.5, 0.62].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${w * 100}%`,
                      height: 9,
                      borderRadius: 5,
                      background: C.navy700,
                      marginBottom: 14,
                    }}
                  />
                ))}
                <div style={{ display: "flex", gap: 14, marginTop: fs(30) }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: fs(120),
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.045)",
                        border: `1px solid ${C.glassStroke}`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    marginTop: fs(30),
                    width: fs(180),
                    height: fs(46),
                    borderRadius: 999,
                    background: C.bronze500,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phone, front-right, in parallax */}
          <div
            style={{
              position: "absolute",
              right: isPortrait ? -30 : -90,
              bottom: -fs(60),
              width: fs(190),
              height: fs(380),
              borderRadius: 26,
              border: `1px solid rgba(255,255,255,0.14)`,
              background: C.navy900,
              boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
              transform: `translateX(${phoneX}px) rotateY(8deg)`,
              overflow: "hidden",
              padding: fs(14),
            }}
          >
            <div style={{ height: fs(60), borderRadius: 10, background: C.bronze600, opacity: 0.5, marginBottom: 10 }} />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: C.navy700,
                  marginBottom: 10,
                  width: `${85 - i * 12}%`,
                }}
              />
            ))}
          </div>
        </div>

        <Rise delay={60} style={{ marginTop: fs(90) }}>
          <Headline size={54} weight={400}>
            Senior practitioners. Never juniors.
          </Headline>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};
