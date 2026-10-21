"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { YTPlayer, PlayerState, PlayerCallbacks, YTPlayerState } from "../types";

/**
 * Extract YouTube video ID from various URL formats.
 */
export function extractYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match?.[1] ?? null;
}

/**
 * Load the YouTube IFrame API script once globally.
 */
let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise<void>((resolve) => {
    // Already loaded
    if (typeof window !== "undefined" && window.YT?.Player) {
      resolve();
      return;
    }

    // Set the global callback
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();
      resolve();
    };

    // Inject the script
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return apiLoadPromise;
}

const DEFAULT_STATE: PlayerState = {
  isPlaying: false,
  isPaused: true,
  isBuffering: false,
  isEnded: false,
  currentTime: 0,
  duration: 0,
  volume: 100,
  isMuted: false,
  playbackRate: 1,
  isFullscreen: false,
  isTheaterMode: false,
  quality: "auto",
  availableQualities: [],
  loadedFraction: 0,
};

interface UseYouTubePlayerOptions {
  videoId: string | null;
  containerId: string;
  callbacks?: PlayerCallbacks;
  startTime?: number;
}

export function useYouTubePlayer({
  videoId,
  containerId,
  callbacks,
  startTime,
}: UseYouTubePlayerOptions) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<PlayerState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);
  const timeUpdateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Time update polling (YouTube API doesn't have a native timeupdate event)
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
        // Player might be destroyed
      }
    }, 250); // 4x/sec for smooth progress bar
  }, []);

  const stopTimeUpdates = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Create / recreate player when videoId changes
  useEffect(() => {
    if (!videoId) return;

    // Narrow to string for the closure below
    const currentVideoId: string = videoId;
    let destroyed = false;

    async function init() {
      await loadYouTubeApi();
      if (destroyed) return;

      // Destroy previous player
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }

      // Ensure container element is mounted in DOM
      const containerElem = document.getElementById(containerId);
      if (!containerElem) return;

      const player = new window.YT.Player(containerId, {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,          // Hide native controls — we render our own
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,    // Hide annotations
          fs: 0,                // Disable native fullscreen button
          cc_load_policy: 0,
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
          ...(startTime ? { start: Math.floor(startTime) } : {}),
          disablekb: 1,         // Disable YouTube keyboard shortcuts (we handle our own)
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            if (destroyed) return;
            setIsReady(true);

            try {
              const duration = player.getDuration();
              const qualities = player.getAvailableQualityLevels();
              setState((prev) => ({
                ...prev,
                duration,
                availableQualities: qualities,
              }));
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

            // Start/stop time polling based on state
            if (ytState === 1) {
              startTimeUpdates();
            } else if (ytState === 2 || ytState === 0) {
              // Still poll when paused to catch seek
              // Stop only when ended
              if (ytState === 0) stopTimeUpdates();
            }

            callbacksRef.current?.onStateChange?.(ytState);
          },

          onError: (event: { data: number }) => {
            if (destroyed) return;
            callbacksRef.current?.onError?.(event.data);
          },

          onPlaybackQualityChange: (event: { data: string }) => {
            if (destroyed) return;
            setState((prev) => ({
              ...prev,
              quality: event.data,
            }));
            callbacksRef.current?.onQualityChange?.(event.data);
          },

          onPlaybackRateChange: (event: { data: number }) => {
            if (destroyed) return;
            setState((prev) => ({
              ...prev,
              playbackRate: event.data,
            }));
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

  // Controls
  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const s = player.getPlayerState();
    if (s === 1) player.pauseVideo();
    else player.playVideo();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const seekRelative = useCallback((delta: number) => {
    const player = playerRef.current;
    if (!player) return;
    const current = player.getCurrentTime();
    const duration = player.getDuration();
    const target = Math.max(0, Math.min(duration, current + delta));
    player.seekTo(target, true);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(Math.max(0, Math.min(100, vol)));
    if (vol > 0 && player.isMuted()) player.unMute();
    setState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      setState((prev) => ({ ...prev, isMuted: false }));
    } else {
      player.mute();
      setState((prev) => ({ ...prev, isMuted: true }));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
  }, []);

  const setQuality = useCallback((quality: string) => {
    playerRef.current?.setPlaybackQuality(quality);
  }, []);

  return {
    player: playerRef,
    state,
    isReady,
    controls: {
      play,
      pause,
      togglePlay,
      seekTo,
      seekRelative,
      setVolume,
      toggleMute,
      setPlaybackRate,
      setQuality,
    },
  };
}
