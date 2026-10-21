"use client";

import React from "react";
import {
  PipIcon,
  TheaterIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from "./PlayerIcons";

interface ScreenModeControlsProps {
  isFullscreen: boolean;
  isTheaterMode: boolean;
  onToggleFullscreen: () => void;
  onToggleTheaterMode: () => void;
  controlBtnClass: string;
}

/**
 * Screen presentation controls: PiP, Theater mode, and Fullscreen toggle.
 */
export function ScreenModeControls({
  isFullscreen,
  isTheaterMode,
  onToggleFullscreen,
  onToggleTheaterMode,
  controlBtnClass,
}: ScreenModeControlsProps) {
  return (
    <>
      {/* Picture-in-Picture */}
      <button
        type="button"
        onClick={() => {}}
        className={`${controlBtnClass} hidden sm:flex`}
        aria-label="صورة داخل صورة"
        title="صورة داخل صورة"
      >
        <PipIcon size={18} />
      </button>

      {/* Theater Mode */}
      <button
        type="button"
        onClick={onToggleTheaterMode}
        className={`${controlBtnClass} hidden sm:flex`}
        aria-label={isTheaterMode ? "الوضع العادي" : "وضع المسرح"}
        title={isTheaterMode ? "الوضع العادي" : "وضع المسرح"}
      >
        <TheaterIcon size={18} />
      </button>

      {/* Fullscreen Toggle */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className={controlBtnClass}
        aria-label={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
        title={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
      >
        {isFullscreen ? <ExitFullscreenIcon size={19} /> : <FullscreenIcon size={19} />}
      </button>
    </>
  );
}
