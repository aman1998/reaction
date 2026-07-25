import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site-config";

export const alt = "Image to Dev — Turn images into React components";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -2,
            marginBottom: 24,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Turn images into React components
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          PNG · JPG · WebP · SVG → JSX · TSX
        </div>
      </div>
    ),
    { ...size },
  );
}
