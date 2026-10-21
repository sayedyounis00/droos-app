"use client";

import React, { useState, useCallback } from "react";
import { useRtlDragSlider } from "./hooks/useRtlDragSlider";
import { formatTime } from "./utils/formatTime";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  loadedFraction: number;
  onSeek: (time: number) => void;
  accentColor?: string;
}

/**
 * Interactive seek bar for video playback with RTL orientation.
 */
export function ProgressBar({
  currentTime,
  duration,
  loadedFraction,
  onSeek,
  accentColor = "#E8A83C",
}: ProgressBarProps) {
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  const handleSeekPercent = useCallback(
    (percent: number) => {
      onSeek((percent / 100) * duration);
    },
    [duration, onSeek]
  );

  const { trackRef, isDragging, handleMouseDown, getPercentFromEvent } =
    useRtlDragSlider({ onValueChange: handleSeekPercent });

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const buffered = loadedFraction * 100;
  const hoverTime = hoverPercent !== null ? (hoverPercent / 100) * duration : null;

  return (
    <div className="w-full select-none" dir="rtl">
      {/* Time display */}
      <div className="flex items-center justify-between text-[11px] font-bold text-white/70 mb-1.5 px-0.5 tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full group cursor-pointer"
        style={{ height: isDragging ? "8px" : "5px", transition: "height 0.15s ease" }}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => setHoverPercent(getPercentFromEvent(e))}
        onMouseLeave={() => setHoverPercent(null)}
        role="slider"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-label="شريط التقدم"
        tabIndex={0}
      >
        <div className="absolute inset-0 rounded-full bg-white/15" />

        {/* Buffered region */}
        <div
          className="absolute top-0 bottom-0 rounded-full bg-white/25"
          style={{ right: 0, width: `${buffered}%` }}
        />

        {/* Progress played */}
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            right: 0,
            width: `${progress}%`,
            backgroundColor: accentColor,
            transition: isDragging ? "none" : "width 0.25s linear",
          }}
        />

        {/* Seek thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full shadow-md transition-transform"
          style={{
            right: `calc(${progress}% - 6px)`,
            width: "12px",
            height: "12px",
            backgroundColor: accentColor,
            transform: `translateY(-50%) scale(${isDragging || hoverPercent !== null ? 1.3 : 0})`,
            transition: isDragging ? "none" : "transform 0.15s ease, right 0.25s linear",
          }}
        />

        {/* Hover preview tooltip */}
        {hoverPercent !== null && hoverTime !== null && (
          <div
            className="absolute -top-8 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold whitespace-nowrap pointer-events-none"
            style={{ right: `calc(${hoverPercent}% - 16px)` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
}
