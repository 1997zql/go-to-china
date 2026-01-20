import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#F7F3E8",
          backgroundImage:
            "radial-gradient(520px 260px at 12% 12%, rgba(159,29,34,0.18), transparent 60%), radial-gradient(420px 220px at 85% 80%, rgba(212,175,55,0.22), transparent 60%)",
          color: "#2A1A1A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-1px",
              color: "#7A161B",
            }}
          >
            Go to China
          </div>
          <div style={{ fontSize: "34px", fontWeight: 600, color: "#2F1E1E" }}>
            Plan your China trip in minutes
          </div>
          <div style={{ fontSize: "26px", fontWeight: 500, color: "#A67700" }}>
            Answer 5 questions · Preview 3 chapters · Unlock full PDF
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            color: "#A67700",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI Trip Planner
        </div>
      </div>
    ),
    size
  );
}
