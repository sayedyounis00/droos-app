"use client";

import { useRef, useCallback, useEffect } from "react";
import type { YTPlayer, PlayerState, PlayerCallbacks } from "../types";

interface UsePlayerTimePollingOptions {
  playerRef: React.RefObject<YTPlayer | null>;
  setState: React.Dispatch<React.SetStateAction<PlayerState>>;
  callbacksRef: React.RefObject<PlayerCallbacks | undefined>;
}

/**
 * Handles polling interval (4x/sec) to sync current playback time,
 * duration, and buffered fraction from the YouTube player instance.
 */
export function usePlayerTimePolling({
  playerRef,
  setState,
  callbacksRef,
}: UsePlayerTimePollingOptions) {
  const timeUpdateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimeUpdates = useCallback(() => {
    if (timeUpdateIntervalRef.current) return;

    timeUpdateIntervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      try {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const loadedFraction = player.getVideoLoadedFraction();
        const volume = player.getVolume();
        const isMuted = player.isMuted();
        const playbackRate = player.getPlaybackRate();

        setState((prev) => ({
          ...prev,
          currentTime,
          duration,
          loadedFraction,
          volume,
          isMuted,
          playbackRate,
        }));

        callbacksRef.current?.onTimeUpdate?.(currentTime, duration);
      } catch {
        // Player may be destroyed or unloading
      }
    }, 250);
  }, [playerRef, setState, callbacksRef]);

  const stopTimeUpdates = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeUpdates();
    };
  }, [stopTimeUpdates]);

  return { startTimeUpdates, stopTimeUpdates };
}
