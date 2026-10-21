"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  loadedFraction: number;
  onSeek: (time: number) => void;
  accentColor?: string;
}

/**
 * Custom interactive progress/seek bar for the video player.
 * Shows buffered region, current progress, and supports click + drag to seek.
 */
export function ProgressBar({
  currentTime,
  duration,
  loadedFraction,
  onSeek,
  accentColor = "#E8A83C",
}: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const buffered = loadedFraction * 100;

  const getPercentFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const bar = barRef.current;
      if (!bar) return 0;
      const rect = bar.getBoundingClientRect();
      // RTL: right is start, left is end
      const x = rect.right - e.clientX;
      return Math.max(0, Math.min(100, (x / rect.width) * 100));
    },
    []
  );

  const dragCleanupRef = useRef<(() => void) | null>(null);

  // Clean up any lingering listeners if unmounted while dragging
  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const percent = getPercentFromEvent(e);
      onSeek((percent / 100) * duration);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const p = getPercentFromEvent(moveEvent);
        onSeek((p / 100) * duration);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [duration, getPercentFromEvent, onSeek]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setHoverPercent(getPercentFromEvent(e));
    },
    [getPercentFromEvent]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverPercent(null);
  }, []);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hoverTime = hoverPercent !== null ? (hoverPercent / 100) * duration : null;

  return (
    <div className="w-full select-none" dir="rtl">
      {/* Time display */}
      <div className="flex items-center justify-between text-[11px] font-bold text-white/70 mb-1.5 px-0.5 tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress bar track */}
      <div
        ref={barRef}
        className="relative w-full group cursor-pointer"
        style={{ height: isDragging ? "8px" : "5px", transition: "height 0.15s ease" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="slider"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-label="شريط التقدم"
        tabIndex={0}
      >
        {/* Background track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        />

        {/* Buffered region */}
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            right: 0,
            width: `${buffered}%`,
            backgroundColor: "rgba(255,255,255,0.25)",
          }}
        />

        {/* Progress (played region) */}
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

        {/* Hover tooltip */}
        {hoverPercent !== null && hoverTime !== null && (
          <div
            className="absolute -top-8 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold whitespace-nowrap pointer-events-none"
            style={{
              right: `calc(${hoverPercent}% - 16px)`,
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
}
