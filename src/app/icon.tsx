import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {/* ">" chevron built from two rotated bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                width: 10,
                height: 3.4,
                background: "#f5f4ff",
                borderRadius: 2,
                transform: "rotate(38deg) translate(1px, 0px)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 3.4,
                background: "#f5f4ff",
                borderRadius: 2,
                transform: "rotate(-38deg) translate(1px, 0px)",
              }}
            />
          </div>
          {/* cursor underscore */}
          <div
            style={{
              width: 6,
              height: 3.4,
              background: "#f5f4ff",
              borderRadius: 2,
              marginLeft: 1,
              marginTop: 9,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
