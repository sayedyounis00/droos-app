/**
 * Media Player Types — مشغل الوسائط الاحترافي
 */

// YouTube IFrame API player states
export enum YTPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  isEnded: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isTheaterMode: boolean;
  quality: string;
  availableQualities: string[];
  loadedFraction: number;
}

export interface PlayerCallbacks {
  onReady?: () => void;
  onStateChange?: (state: YTPlayerState) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (errorCode: number) => void;
  onQualityChange?: (quality: string) => void;
  onPlaybackRateChange?: (rate: number) => void;
}

export interface VideoInfo {
  videoId: string;
  title: string;
  lessonId: string;
  description?: string | null;
}

export interface PlaylistItem {
  id: string;
  module_id: string;
  title: string;
  content_type: string;
  video_url?: string | null;
  sort_order: number;
}

export interface WatermarkConfig {
  studentName: string;
  studentCode: string;
  opacity?: number;
  intervalMs?: number;
}

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export const QUALITY_LABELS: Record<string, string> = {
  highres: '4K',
  hd2160: '4K',
  hd1440: '1440p',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
  auto: 'تلقائي',
};

// YouTube IFrame API global type
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: YTPlayerConfig
      ) => YTPlayer;
      PlayerState: typeof YTPlayerState;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YTPlayerConfig {
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    onError?: (event: { data: number }) => void;
    onPlaybackQualityChange?: (event: { data: string }) => void;
    onPlaybackRateChange?: (event: { data: number }) => void;
  };
}

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  getAvailablePlaybackRates: () => number[];
  getPlaybackQuality: () => string;
  setPlaybackQuality: (quality: string) => void;
  getAvailableQualityLevels: () => string[];
  getPlayerState: () => number;
  getVideoLoadedFraction: () => number;
  destroy: () => void;
}
