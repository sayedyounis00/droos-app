"use client";

import React, { useRef, useState, useMemo } from "react";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { useSecurityGuard } from "./hooks/useSecurityGuard";
import { useLessonVideo } from "./hooks/useLessonVideo";
import { useFullscreen } from "./hooks/useFullscreen";
import { useControlsVisibility } from "./hooks/useControlsVisibility";
import { usePlayerShortcuts } from "./hooks/usePlayerShortcuts";
import { PlayerControls } from "./PlayerControls";
import { Watermark } from "./Watermark";
import { DevToolsOverlay } from "./overlays/DevToolsOverlay";
import { TabBlurOverlay } from "./overlays/TabBlurOverlay";
import { BigPlayButton } from "./overlays/BigPlayButton";
import {
  NoVideoPlaceholder,
  VideoErrorPlaceholder,
  LoadingSpinner,
} from "./overlays/PlayerPlaceholders";
import type { PlayerCallbacks } from "./types";

interface VideoPlayerProps {
  lessonId: string;
  hasVideo: boolean;
  lessonTitle: string;
  studentName?: string;
  studentCode?: string;
  startTime?: number;
  accentColor?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

const CONTAINER_ID = "droos-yt-player";

/**
 * Main Video Player component.
 * Declaratively composes YouTube embed, security guards, overlays, and custom controls.
 */
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
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(true);

  // 1. Fetch video ID securely
  const { videoId, fetchError, isFetchingVideo, retry } = useLessonVideo(lessonId, hasVideo);

  // 2. Fullscreen
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // 3. YouTube player callbacks
  const callbacks: PlayerCallbacks = useMemo(
    () => ({
      onTimeUpdate,
      onStateChange: (ytState) => {
        if (ytState === 0) onEnded?.();
        if (ytState === 1) setShowBigPlay(false);
      },
    }),
    [onTimeUpdate, onEnded]
  );

  // 4. YouTube player engine
  const { state, isReady, controls } = useYouTubePlayer({
    videoId,
    containerId: CONTAINER_ID,
    callbacks,
    startTime,
  });

  // 5. Controls visibility & auto-hide
  const { isControlsVisible, handleMouseMove, handleMouseLeave } =
    useControlsVisibility(state.isPlaying);

  // 6. Security guard (anti-inspect & tab blur)
  useSecurityGuard({
    onDevToolsDetected: () => {
      setIsDevToolsOpen(true);
      controls.pause();
    },
    onDevToolsClosed: () => setIsDevToolsOpen(false),
    onTabBlur: () => {
      setIsBlurred(true);
      controls.pause();
    },
    onTabFocus: () => setIsBlurred(false),
    enabled: true,
  });

  // 7. Keyboard shortcuts
  usePlayerShortcuts({
    togglePlay: controls.togglePlay,
    seekRelative: controls.seekRelative,
    setVolume: controls.setVolume,
    toggleMute: controls.toggleMute,
    setPlaybackRate: controls.setPlaybackRate,
    toggleFullscreen,
    toggleTheaterMode: onToggleTheaterMode,
    volume: state.volume,
    playbackRate: state.playbackRate,
    enabled: true,
  });

  // Early returns for placeholders
  if (!hasVideo) return <NoVideoPlaceholder />;
  if (fetchError) return <VideoErrorPlaceholder onRetry={retry} />;

  return (
    <div
      ref={containerRef}
      aria-label={`مشغل الفيديو: ${lessonTitle}`}
      className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-black/20 group select-none"
      data-player-area
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isControlsVisible ? "default" : "none" }}
    >
      {/* YouTube IFrame Embed Slot */}
      <div id={CONTAINER_ID} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Transparent Click Overlay */}
      <div
        className="absolute inset-0 z-10"
        onClick={controls.togglePlay}
        onDoubleClick={toggleFullscreen}
        style={{ cursor: isControlsVisible ? "pointer" : "none" }}
      />

      {/* Security Overlays */}
      {isBlurred && <TabBlurOverlay />}
      {isDevToolsOpen && (
        <DevToolsOverlay
          onCheckDevTools={() => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            if (!widthThreshold && !heightThreshold) {
              setIsDevToolsOpen(false);
            }
          }}
        />
      )}

      {/* Watermark */}
      <Watermark studentName={studentName} studentCode={studentCode} />

      {/* Big Play Button */}
      {showBigPlay && isReady && !state.isPlaying && (
        <BigPlayButton accentColor={accentColor} onClick={controls.togglePlay} />
      )}

      {/* Loading Spinner */}
      {(state.isBuffering || isFetchingVideo || (!isReady && videoId)) && (
        <LoadingSpinner accentColor={accentColor} />
      )}

      {/* Controls Bar */}
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
        isVisible={isControlsVisible}
        accentColor={accentColor}
      />
    </div>
  );
}
