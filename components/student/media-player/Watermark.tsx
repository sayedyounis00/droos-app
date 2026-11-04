"use client";

import React from "react";
import { useWatermarkPosition } from "./hooks/useWatermarkPosition";

interface WatermarkProps {
  studentName: string;
  studentCode: string;
  opacity?: number;
  intervalMs?: number;
}

/**
 * Dynamic floating watermark rendered across the video frame.
 * Randomly repositions over time to deter screen recording and leak sources.
 */
export function Watermark({
  studentName,
  studentCode,
  opacity = 0.12,
  intervalMs = 25000,
}: WatermarkProps) {
  const position = useWatermarkPosition(intervalMs);
  const text = `${studentName} • ${studentCode}`;

  return (
    <div
      data-watermark
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Primary dynamic watermark */}
      <span
        style={{
          position: "absolute",
          top: `${position.y}%`,
          right: `${position.x}%`,
          opacity,
          color: "#ffffff",
          fontSize: "clamp(10px, 1.2vw, 16px)",
          fontWeight: 700,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          transform: "rotate(-8deg)",
          transition: "top 2s ease-in-out, right 2s ease-in-out",
          textShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        {text}
      </span>

      {/* Secondary subtle anchor watermark */}
      <span
        style={{
          position: "absolute",
          bottom: `${85 - position.y}%`,
          left: `${85 - position.x}%`,
          opacity: opacity * 0.6,
          color: "#ffffff",
          fontSize: "clamp(8px, 0.9vw, 12px)",
          fontWeight: 600,
          whiteSpace: "nowrap",
          transform: "rotate(5deg)",
          transition: "bottom 2s ease-in-out, left 2s ease-in-out",
        }}
      >
        {text}
      </span>
    </div>
  );
}
