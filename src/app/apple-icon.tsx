import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8b7ef5 0%, #5643d6 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                width: 56,
                height: 18,
                background: "#f5f4ff",
                borderRadius: 9,
                transform: "rotate(38deg) translate(6px, 0px)",
              }}
            />
            <div
              style={{
                width: 56,
                height: 18,
                background: "#f5f4ff",
                borderRadius: 9,
                transform: "rotate(-38deg) translate(6px, 0px)",
              }}
            />
          </div>
          <div
            style={{
              width: 34,
              height: 18,
              background: "#f5f4ff",
              borderRadius: 9,
              marginLeft: 4,
              marginTop: 50,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
