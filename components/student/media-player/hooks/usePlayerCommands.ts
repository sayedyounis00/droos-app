"use client";

import { useCallback } from "react";
import type { YTPlayer, PlayerState } from "../types";

interface UsePlayerCommandsOptions {
  playerRef: React.RefObject<YTPlayer | null>;
  setState: React.Dispatch<React.SetStateAction<PlayerState>>;
}

/**
 * Encapsulates playback control actions (play, pause, seek, volume, speed, quality).
 */
export function usePlayerCommands({ playerRef, setState }: UsePlayerCommandsOptions) {
  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, [playerRef]);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, [playerRef]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const s = player.getPlayerState();
    if (s === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [playerRef]);

  const seekTo = useCallback(
    (seconds: number) => {
      playerRef.current?.seekTo(seconds, true);
    },
    [playerRef]
  );

  const seekRelative = useCallback(
    (delta: number) => {
      const player = playerRef.current;
      if (!player) return;
      const current = player.getCurrentTime();
      const duration = player.getDuration();
      const target = Math.max(0, Math.min(duration, current + delta));
      player.seekTo(target, true);
    },
    [playerRef]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const player = playerRef.current;
      if (!player) return;
      player.setVolume(Math.max(0, Math.min(100, vol)));
      if (vol > 0 && player.isMuted()) {
        player.unMute();
      }
      setState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
    },
    [playerRef, setState]
  );

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
  }, [playerRef, setState]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      playerRef.current?.setPlaybackRate(rate);
    },
    [playerRef]
  );

  const setQuality = useCallback(
    (quality: string) => {
      playerRef.current?.setPlaybackQuality(quality);
    },
    [playerRef]
  );

  return {
    play,
    pause,
    togglePlay,
    seekTo,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setQuality,
  };
}
