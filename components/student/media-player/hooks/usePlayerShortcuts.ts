"use client";

import { useCallback } from "react";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { PLAYBACK_RATES } from "../types";

interface UsePlayerShortcutsOptions {
  togglePlay: () => void;
  seekRelative: (delta: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  toggleTheaterMode?: () => void;
  volume: number;
  playbackRate: number;
  enabled?: boolean;
}

/**
 * Connects media player controls to keyboard shortcuts.
 */
export function usePlayerShortcuts({
  togglePlay,
  seekRelative,
  setVolume,
  toggleMute,
  setPlaybackRate,
  toggleFullscreen,
  toggleTheaterMode,
  volume,
  playbackRate,
  enabled = true,
}: UsePlayerShortcutsOptions) {
  const cycleSpeed = useCallback(
    (direction: "up" | "down") => {
      const idx = PLAYBACK_RATES.indexOf(playbackRate as (typeof PLAYBACK_RATES)[number]);
      if (direction === "up" && idx < PLAYBACK_RATES.length - 1) {
        setPlaybackRate(PLAYBACK_RATES[idx + 1]);
      } else if (direction === "down" && idx > 0) {
        setPlaybackRate(PLAYBACK_RATES[idx - 1]);
      }
    },
    [playbackRate, setPlaybackRate]
  );

  useKeyboardShortcuts({
    togglePlay,
    seekRelative,
    setVolume,
    toggleMute,
    toggleFullscreen,
    toggleTheaterMode: toggleTheaterMode || (() => {}),
    cycleSpeed,
    getVolume: () => volume,
    enabled,
  });
}
