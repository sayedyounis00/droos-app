"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Manages auto-hiding player controls during video playback.
 */
export function useControlsVisibility(isPlaying: boolean) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    hideControlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  const handleMouseMove = useCallback(() => {
    if (isPlaying) {
      resetHideTimer();
    }
  }, [isPlaying, resetHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setControlsVisible(false);
    }
  }, [isPlaying]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, []);

  const isControlsVisible = !isPlaying || controlsVisible;

  return {
    isControlsVisible,
    resetHideTimer,
    handleMouseMove,
    handleMouseLeave,
  };
}
