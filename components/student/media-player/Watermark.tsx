"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface WatermarkProps {
  studentName: string;
  studentCode: string;
  opacity?: number;
  intervalMs?: number;
}

/**
 * Dynamic watermark that floats over the video area.
 * Moves randomly every N seconds to make screen recording traceable.
 */
export function Watermark({
  studentName,
  studentCode,
  opacity = 0.12,
  intervalMs = 25000,
}: WatermarkProps) {
  const [position, setPosition] = useState(() => ({
    x: 10 + Math.random() * 75,
    y: 10 + Math.random() * 70,
  }));
  const containerRef = useRef<HTMLDivElement>(null);

  const randomizePosition = useCallback(() => {
    // Keep within 10-85% range to avoid clipping at edges
    const x = 10 + Math.random() * 75;
    const y = 10 + Math.random() * 70;
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    const interval = setInterval(randomizePosition, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, randomizePosition]);

  const text = `${studentName} • ${studentCode}`;

  return (
    <div
      ref={containerRef}
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
      {/* Primary watermark — moves randomly */}
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
          fontFamily: "inherit",
        }}
      >
        {text}
      </span>

      {/* Secondary watermark — subtle tiled pattern */}
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
          fontFamily: "inherit",
        }}
      >
        {studentCode}
      </span>
    </div>
  );
}
