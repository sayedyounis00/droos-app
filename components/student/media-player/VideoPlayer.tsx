"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSecurityGuard } from "./hooks/useSecurityGuard";
import { PlayerControls } from "./PlayerControls";
import { Watermark } from "./Watermark";
import { PLAYBACK_RATES } from "./types";
import type { PlayerCallbacks } from "./types";

interface VideoPlayerProps {
  /** Lesson ID — used to fetch video securely from API (never expose URL to client) */
  lessonId: string;
  /** Whether this lesson has a video (so we know to fetch or show placeholder) */
  hasVideo: boolean;
  lessonTitle: string;
  /** Watermark student identity (Phase 2 will use real data) */
  studentName?: string;
  studentCode?: string;
  /** Resume from this time */
  startTime?: number;
  /** Accent color for controls */
  accentColor?: string;
  /** Callbacks */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  /** Theater mode state from parent */
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

export function VideoPlayer({
  lessonId,
  hasVideo,
  lessonTitle,
  studentName = "طالب تجريبي",
  studentCode = "T3ST",
  startTime,
  accentColor = "#E8A83C",
  onTimeUpdate,
  onEnded,
  isTheaterMode = false,
  onToggleTheaterMode,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CONTAINER_ID = "droos-yt-player";

  // ── Secure video ID fetching ──
  // Never receive the URL from the server component.
  // Instead, fetch only the video ID from a protected API route.
  const [videoId, setVideoId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);

  useEffect(() => {
    if (!hasVideo || !lessonId) {
      setVideoId(null);
      return;
    }

    let cancelled = false;
    setIsFetchingVideo(true);
    setFetchError(false);

    fetch(`/api/lesson/${lessonId}/video-url`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data.videoId) {
          setVideoId(data.videoId);
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      })
      .finally(() => {
        if (!cancelled) setIsFetchingVideo(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId, hasVideo]);

  // YouTube Player Hook
  const callbacks: PlayerCallbacks = {
    onTimeUpdate: (currentTime, duration) => {
      onTimeUpdate?.(currentTime, duration);
    },
    onStateChange: (state) => {
      if (state === 0) onEnded?.(); // ENDED
      if (state === 1) setShowBigPlay(false); // PLAYING
    },
  };

  const { state, isReady, controls } = useYouTubePlayer({
    videoId,
    containerId: CONTAINER_ID,
    callbacks,
    startTime,
  });

  // Security Guard
  useSecurityGuard({
    onDevToolsDetected: () => {
      setIsDevToolsOpen(true);
      controls.pause();
    },
    onDevToolsClosed: () => {
      setIsDevToolsOpen(false);
    },
    onTabBlur: () => {
      setIsBlurred(true);
      controls.pause();
    },
    onTabFocus: () => {
      setIsBlurred(false);
    },
    enabled: true,
  });

  // Auto-hide controls after 3s of no mouse movement
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);

    if (state.isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [state.isPlaying]);

  // Show controls when paused
  useEffect(() => {
    if (!state.isPlaying) {
      setControlsVisible(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    } else {
      resetHideTimer();
    }
  }, [state.isPlaying, resetHideTimer]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard shortcuts
  const cycleSpeed = useCallback(
    (direction: "up" | "down") => {
      const idx = PLAYBACK_RATES.indexOf(state.playbackRate as typeof PLAYBACK_RATES[number]);
      if (direction === "up" && idx < PLAYBACK_RATES.length - 1) {
        controls.setPlaybackRate(PLAYBACK_RATES[idx + 1]);
      } else if (direction === "down" && idx > 0) {
        controls.setPlaybackRate(PLAYBACK_RATES[idx - 1]);
      }
    },
    [state.playbackRate, controls]
  );

  useKeyboardShortcuts({
    togglePlay: controls.togglePlay,
    seekRelative: controls.seekRelative,
    setVolume: controls.setVolume,
    toggleMute: controls.toggleMute,
    toggleFullscreen,
    toggleTheaterMode: onToggleTheaterMode || (() => {}),
    cycleSpeed,
    getVolume: () => state.volume,
    enabled: true,
  });

  // Click to play/pause on video area
  const handleVideoAreaClick = useCallback(() => {
    controls.togglePlay();
    resetHideTimer();
  }, [controls, resetHideTimer]);

  // Double click to fullscreen
  const handleDoubleClick = useCallback(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  // ── No video / placeholder state ──
  if (!hasVideo) {
    return (
      <div
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0D1420] flex flex-col items-center justify-center text-center p-6 text-white"
        data-player-area
      >
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" className="text-[#F3C97C]">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </div>
        <h4 className="text-base font-bold">حصة دراسية بدون رابط فيديو مباشر</h4>
        <p className="text-xs text-white/70 max-w-sm mt-1">
          هذا الدرس مسجل كحصة دراسية أو ملف تمارين. يمكنك مراجعة الملاحظات والملحقات أدناه.
        </p>
      </div>
    );
  }

  // ── Fetch error state ──
  if (fetchError) {
    return (
      <div
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0D1420] flex flex-col items-center justify-center text-center p-6 text-white"
        data-player-area
      >
        <div className="w-16 h-16 rounded-full bg-[#D9483D]/20 flex items-center justify-center mb-3">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#D9483D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h4 className="text-base font-bold">تعذّر تحميل الفيديو</h4>
        <p className="text-xs text-white/60 max-w-sm mt-1">
          يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-black/20 group"
      data-player-area
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (state.isPlaying) setControlsVisible(false);
      }}
      style={{
        cursor: controlsVisible ? "default" : "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* YouTube Player Container */}
      <div
        id={CONTAINER_ID}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }} // Prevent direct iframe interaction
      />

      {/* Click overlay — captures clicks instead of YouTube iframe */}
      <div
        className="absolute inset-0 z-10"
        onClick={handleVideoAreaClick}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: controlsVisible ? "pointer" : "none" }}
      />

      {/* Blur overlay — activates when tab is not focused */}
      {isBlurred && (
        <div
          className="absolute inset-0 z-25 flex items-center justify-center"
          style={{
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="text-center text-white space-y-2 animate-pulse">
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-[#F3C97C]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-sm font-bold">عُد للتبويب لمتابعة المشاهدة</p>
            <p className="text-[11px] text-white/60">يتم إيقاف العرض مؤقتاً لحماية المحتوى</p>
          </div>
        </div>
      )}

      {/* DevTools Security Overlay */}
      {isDevToolsOpen && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none"
          style={{
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            backgroundColor: "rgba(10, 15, 20, 0.94)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D9483D]/15 border border-[#D9483D]/30 flex items-center justify-center mb-4 text-[#D9483D] animate-pulse">
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mb-2">
            تم رصد فتح أدوات الفحص (Inspect / DevTools)
          </h3>
          <p className="text-xs text-white/70 max-w-md leading-relaxed mb-5">
            لحماية حقوق الملكية الفكرية وتأمين الدروس التعليمية، تم إيقاف المشغل وتعتيم المحتوى. يرجى إغلاق نافذة الفحص (Inspect) لمواصلة المشاهدة.
          </p>
          <button
            type="button"
            onClick={() => {
              const widthThreshold = window.outerWidth - window.innerWidth > 160;
              const heightThreshold = window.outerHeight - window.innerHeight > 160;
              if (!widthThreshold && !heightThreshold) {
                setIsDevToolsOpen(false);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white transition-all border border-white/10 cursor-pointer"
          >
            إعادة التحقق واستئناف المشاهدة
          </button>
        </div>
      )}

      {/* Watermark */}
      <Watermark
        studentName={studentName}
        studentCode={studentCode}
      />

      {/* Big centered play button — shown before first play */}
      {showBigPlay && isReady && !state.isPlaying && (
        <div
          className="absolute inset-0 z-12 flex items-center justify-center cursor-pointer"
          onClick={handleVideoAreaClick}
        >
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            <svg width={32} height={32} viewBox="0 0 24 24" fill="white" className="mr-[-2px]">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {(state.isBuffering || isFetchingVideo || (!isReady && videoId)) && (
        <div className="absolute inset-0 z-12 flex items-center justify-center bg-black/30">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${accentColor}60`, borderTopColor: "transparent" }}
          />
        </div>
      )}

      {/* Player Controls */}
      <PlayerControls
        state={{
          ...state,
          isFullscreen,
          isTheaterMode,
        }}
        onTogglePlay={controls.togglePlay}
        onSeek={controls.seekTo}
        onSeekRelative={controls.seekRelative}
        onSetVolume={controls.setVolume}
        onToggleMute={controls.toggleMute}
        onSetPlaybackRate={controls.setPlaybackRate}
        onSetQuality={controls.setQuality}
        onToggleFullscreen={toggleFullscreen}
        onToggleTheaterMode={onToggleTheaterMode || (() => {})}
        isVisible={controlsVisible}
        accentColor={accentColor}
      />

      {/* Anti-selection CSS */}
      <style jsx>{`
        div[data-player-area] * {
          -webkit-touch-callout: none;
        }
      `}</style>
    </div>
  );
}
