import { ImageResponse } from "next/og";
import { OG_MARK_DATA_URI } from "@/lib/og-mark";

export const alt = "Orbit Works: AI automation and IT services";
/**
 * SQUARE, deliberately.
 *
 * This was a 1200x630 banner. WhatsApp renders link previews as a small square
 * thumbnail and centre-crops whatever it is given, so the banner arrived as an
 * unreadable slice of the headline ("ng Solutions / Purpose."). A square card
 * survives that crop intact, and every other platform letterboxes a square far
 * more gracefully than a wide image survives being squared.
 *
 * Kept at 1200px: WhatsApp will not fetch previews much above ~600KB, and
 * next/og emits well under that at this size.
 */
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";

/**
 * Social share card. The real brand mark centred on the navy field with the
 * wordmark and tagline beneath, so a link shared anywhere reads as the logo
 * rather than as cropped marketing copy.
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1130 0%, #07091e 70%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_MARK_DATA_URI} width={520} height={520} alt="" />

        <div
          style={{
            marginTop: 24,
            fontSize: 108,
            fontWeight: 700,
            color: "#fdfcf7",
            letterSpacing: "-3px",
          }}
        >
          Orbit Works
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 36 }}>
          <div style={{ width: 70, height: 6, background: "#f3124e" }} />
          <div style={{ marginLeft: 22, fontSize: 38, color: "#c8d0de" }}>
            Your business, in orbit.
          </div>
          <div style={{ marginLeft: 22, width: 70, height: 6, background: "#f3124e" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
