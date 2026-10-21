"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useYouTubePlayer, extractYouTubeVideoId } from "./hooks/useYouTubePlayer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSecurityGuard } from "./hooks/useSecurityGuard";
import { PlayerControls } from "./PlayerControls";
import { Watermark } from "./Watermark";
import { PLAYBACK_RATES } from "./types";
import type { PlayerCallbacks } from "./types";

interface VideoPlayerProps {
  videoUrl?: string | null;
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
  videoUrl,
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
  const [showBigPlay, setShowBigPlay] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CONTAINER_ID = "droos-yt-player";

  const videoId = extractYouTubeVideoId(videoUrl);

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
      // In Phase 1 we just log — Phase 2 will pause and warn
      console.warn("[Droos Security] DevTools detected");
    },
    onTabBlur: () => {
      setIsBlurred(true);
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

  // No video URL state
  if (!videoId) {
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
      {(state.isBuffering || (!isReady && videoId)) && (
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
