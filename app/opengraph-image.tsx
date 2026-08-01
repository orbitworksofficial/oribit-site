import { ImageResponse } from "next/og";

export const alt = "OrbitWorks: Crafting Solutions With Purpose";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card (Open Graph). A branded navy card with the orbit mark, the
 * wordmark, tagline and a crimson footer rule. Rendered by next/og at build/
 * request time — no external assets, so it always resolves.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1130 0%, #07091e 70%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* orbit mark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 96,
                height: 44,
                border: "6px solid #f3124e",
                borderRadius: 999,
                transform: "rotate(-28deg)",
              }}
            />
            <div style={{ width: 46, height: 46, borderRadius: 999, background: "#f3124e" }} />
          </div>
          <div style={{ marginLeft: 28, fontSize: 44, fontWeight: 700, color: "#fdfcf7" }}>
            OrbitWorks
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              color: "#fdfcf7",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            Crafting Solutions
          </div>
          <div style={{ fontSize: 78, fontWeight: 700, color: "#f3124e", lineHeight: 1.05, letterSpacing: "-2px" }}>
            With Purpose.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#c8d0de", maxWidth: 900 }}>
            Cloud, software, data, AI and digital marketing: strategy through delivery, in one team.
          </div>
        </div>

        {/* footer rule */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 90, height: 6, background: "#f3124e" }} />
          <div style={{ marginLeft: 20, fontSize: 26, color: "#a7adbe" }}>
            Your business, in orbit.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
