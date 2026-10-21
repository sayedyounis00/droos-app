"use client";

import { useEffect, useCallback, useRef } from "react";

interface UseKeyboardShortcutsOptions {
  togglePlay: () => void;
  seekRelative: (delta: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  toggleTheaterMode: () => void;
  cycleSpeed: (direction: "up" | "down") => void;
  getVolume: () => number;
  enabled?: boolean;
}

/**
 * Keyboard shortcuts for the media player.
 * Only active when the player container is focused or no input is focused.
 */
export function useKeyboardShortcuts({
  togglePlay,
  seekRelative,
  setVolume,
  toggleMute,
  toggleFullscreen,
  toggleTheaterMode,
  cycleSpeed,
  getVolume,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const getVolumeRef = useRef(getVolume);
  getVolumeRef.current = getVolume;

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Skip if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          e.preventDefault();
          seekRelative(10);
          break;

        case "ArrowLeft":
          e.preventDefault();
          seekRelative(-10);
          break;

        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(100, getVolumeRef.current() + 5));
          break;

        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, getVolumeRef.current() - 5));
          break;

        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;

        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;

        case "t":
        case "T":
          e.preventDefault();
          toggleTheaterMode();
          break;

        case ">":
          e.preventDefault();
          cycleSpeed("up");
          break;

        case "<":
          e.preventDefault();
          cycleSpeed("down");
          break;
      }
    },
    [
      enabled,
      togglePlay,
      seekRelative,
      setVolume,
      toggleMute,
      toggleFullscreen,
      toggleTheaterMode,
      cycleSpeed,
    ]
  );

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler, enabled]);
}
