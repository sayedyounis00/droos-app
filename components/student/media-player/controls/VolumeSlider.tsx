"use client";

import React, { useState, useCallback } from "react";
import { VolumeHighIcon, VolumeLowIcon, VolumeMuteIcon } from "./PlayerIcons";
import { useRtlDragSlider } from "../hooks/useRtlDragSlider";

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  accentColor?: string;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  controlBtnClass: string;
}

/**
 * Interactive RTL Volume Slider.
 */
export function VolumeSlider({
  volume,
  isMuted,
  accentColor = "#E8A83C",
  onSetVolume,
  onToggleMute,
  controlBtnClass,
}: VolumeSliderProps) {
  const [showSlider, setShowSlider] = useState(false);

  const handleVolumePercent = useCallback(
    (percent: number) => {
      onSetVolume(Math.round(percent));
    },
    [onSetVolume]
  );

  const { trackRef, isDragging, handleMouseDown } = useRtlDragSlider({
    onValueChange: handleVolumePercent,
  });

  const effectiveVolume = isMuted ? 0 : volume;

  const VolumeIcon =
    isMuted || volume === 0
      ? VolumeMuteIcon
      : volume < 50
        ? VolumeLowIcon
        : VolumeHighIcon;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    onSetVolume(Math.max(0, Math.min(100, effectiveVolume + delta)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onSetVolume(Math.min(100, effectiveVolume + 5));
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onSetVolume(Math.max(0, effectiveVolume - 5));
    }
  };

  const isVisible = showSlider || isDragging;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => {
        if (!isDragging) setShowSlider(false);
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        className={controlBtnClass}
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
        title={isMuted ? "تشغيل الصوت (M)" : "كتم الصوت (M)"}
      >
        <VolumeIcon size={19} />
      </button>

      <div
        className="overflow-hidden transition-all duration-200 flex items-center pr-1 pl-2"
        style={{
          width: isVisible ? "76px" : "0px",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onWheel={handleWheel}
      >
        <div
          ref={trackRef}
          className="relative w-full h-4 cursor-pointer group flex items-center"
          onMouseDown={handleMouseDown}
          role="slider"
          aria-valuenow={effectiveVolume}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="مستوى الصوت"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Background track */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/20" />

          {/* Filled track */}
          <div
            className="absolute right-0 h-1.5 rounded-full"
            style={{
              width: `${effectiveVolume}%`,
              backgroundColor: accentColor,
              transition: isDragging ? "none" : "width 0.1s ease",
            }}
          />

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-transform group-hover:scale-110"
            style={{
              right: `calc(${effectiveVolume}% - 6px)`,
              transition: isDragging ? "none" : "right 0.1s ease, transform 0.15s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
