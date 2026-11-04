"use client";

import React from "react";
import { PlayIcon, PauseIcon, Rewind10Icon, Forward10Icon } from "./PlayerIcons";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeekRelative: (delta: number) => void;
  controlBtnClass: string;
}

/**
 * Primary playback control buttons: Rewind 10s, Play/Pause, Forward 10s.
 * RTL ordered: Rewind (towards 0:00) on right, Forward (towards duration) on left.
 */
export function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onSeekRelative,
  controlBtnClass,
}: PlaybackControlsProps) {
  return (
    <>
      {/* Rewind 10s */}
      <button
        type="button"
        onClick={() => onSeekRelative(-10)}
        className={controlBtnClass}
        aria-label="ترجيع 10 ثوانٍ"
        title="ترجيع 10 ثوانٍ (-10)"
      >
        <Rewind10Icon size={19} />
      </button>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={`${controlBtnClass} w-9 h-9`}
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        title={isPlaying ? "إيقاف مؤقت (مسافة)" : "تشغيل (مسافة)"}
      >
        {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </button>

      {/* Forward 10s */}
      <button
        type="button"
        onClick={() => onSeekRelative(10)}
        className={controlBtnClass}
        aria-label="تقديم 10 ثوانٍ"
        title="تقديم 10 ثوانٍ (+10)"
      >
        <Forward10Icon size={19} />
      </button>
    </>
  );
}
