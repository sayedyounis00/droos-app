"use client";

import { useRef, useEffect, useState } from "react";
import type { YTPlayer, PlayerState, PlayerCallbacks, YTPlayerState } from "../types";
import { loadYouTubeApi, extractYouTubeVideoId } from "../utils/youtubeApi";
import { DEFAULT_PLAYER_STATE } from "./playerConstants";
import { usePlayerTimePolling } from "./usePlayerTimePolling";
import { usePlayerCommands } from "./usePlayerCommands";

export { extractYouTubeVideoId };

interface UseYouTubePlayerOptions {
  videoId: string | null;
  containerId: string;
  callbacks?: PlayerCallbacks;
  startTime?: number;
}

/**
 * Custom hook to integrate YouTube IFrame Player with full lifecycle management.
 */
export function useYouTubePlayer({
  videoId,
  containerId,
  callbacks,
  startTime,
}: UseYouTubePlayerOptions) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<PlayerState>(DEFAULT_PLAYER_STATE);
  const [isReady, setIsReady] = useState(false);

  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Synchronize playback time & buffered progress
  const { startTimeUpdates, stopTimeUpdates } = usePlayerTimePolling({
    playerRef,
    setState,
    callbacksRef,
  });

  // Controls (play, pause, seek, volume, speed, quality)
  const controls = usePlayerCommands({ playerRef, setState });

  // Initialize YT.Player on container mount or videoId change
  useEffect(() => {
    if (!videoId) return;

    const currentVideoId: string = videoId;
    let destroyed = false;

    async function init() {
      await loadYouTubeApi();
      if (destroyed) return;

      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }

      const containerElem = document.getElementById(containerId);
      if (!containerElem) return;

      const player = new window.YT.Player(containerId, {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          cc_load_policy: 0,
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
          ...(startTime ? { start: Math.floor(startTime) } : {}),
          disablekb: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            if (destroyed) return;
            setIsReady(true);
            try {
              const duration = player.getDuration();
              const qualities = player.getAvailableQualityLevels();
              setState((prev) => ({ ...prev, duration, availableQualities: qualities }));
            } catch {
              // ignore
            }
            callbacksRef.current?.onReady?.();
          },

          onStateChange: (event: { data: number }) => {
            if (destroyed) return;
            const ytState = event.data as unknown as YTPlayerState;

            setState((prev) => ({
              ...prev,
              isPlaying: ytState === 1,
              isPaused: ytState === 2,
              isBuffering: ytState === 3,
              isEnded: ytState === 0,
            }));

            if (ytState === 1) {
              startTimeUpdates();
            } else if (ytState === 0) {
              stopTimeUpdates();
            }
            callbacksRef.current?.onStateChange?.(ytState);
          },

          onError: (event: { data: number }) => {
            if (destroyed) return;
            callbacksRef.current?.onError?.(event.data);
          },

          onPlaybackQualityChange: (event: { data: string }) => {
            if (destroyed) return;
            setState((prev) => ({ ...prev, quality: event.data }));
            callbacksRef.current?.onQualityChange?.(event.data);
          },

          onPlaybackRateChange: (event: { data: number }) => {
            if (destroyed) return;
            setState((prev) => ({ ...prev, playbackRate: event.data }));
            callbacksRef.current?.onPlaybackRateChange?.(event.data);
          },
        },
      });

      playerRef.current = player;
    }

    init();

    return () => {
      destroyed = true;
      stopTimeUpdates();
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
      setIsReady(false);
    };
  }, [videoId, containerId, startTime, startTimeUpdates, stopTimeUpdates]);

  return {
    player: playerRef,
    state,
    isReady,
    controls,
  };
}
