import { ImageResponse } from "next/og";

// No og:image existed anywhere on the site, so every shared link rendered as a
// bare text row with no artwork. Generating the card here keeps it on-brand and
// in the repo, with no binary asset to upload or keep in sync.
export const alt = "Vision Wings Marketing — Strategic Growth & Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#B87333",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.18em",
          }}
        >
          VISION WINGS MARKETING
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              color: "#FAF7F2",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            We give wings to your vision.
          </div>
          <div style={{ color: "#94A3B8", fontSize: 30, maxWidth: "820px" }}>
            Brand strategy, performance marketing and conversion funnels for
            growth-stage businesses.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "72px", height: "4px", backgroundColor: "#B87333" }} />
          <div style={{ color: "#64748B", fontSize: 24 }}>
            visionwingsmarketing.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
