import type { PlayerState } from "../types";

export const DEFAULT_PLAYER_STATE: PlayerState = {
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
