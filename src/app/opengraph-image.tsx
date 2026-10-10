import { ImageResponse } from "next/og";

export const alt = "SakaSense — Smart Soil Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(135deg, #050B08 0%, #0B1611 100%)",
        color: "#E8F5EC",
      }}
    >
      <div style={{ fontSize: 28, color: "#22E07A", letterSpacing: 6 }}>
        SMART SOIL INTELLIGENCE
      </div>
      <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, display: "flex" }}>
        Know your soil.
      </div>
      <div style={{ fontSize: 96, fontWeight: 700, color: "#22E07A", display: "flex" }}>
        Grow with confidence.
      </div>
      <div style={{ fontSize: 36, marginTop: 40, color: "#8FA89A" }}>SakaSense</div>
    </div>,
    size,
  );
}
