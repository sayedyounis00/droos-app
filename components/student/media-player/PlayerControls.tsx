"use client";

import React from "react";
import { ProgressBar } from "./ProgressBar";
import { PlaybackControls } from "./controls/PlaybackControls";
import { VolumeSlider } from "./controls/VolumeSlider";
import { SpeedMenu } from "./controls/SpeedMenu";
import { QualityMenu } from "./controls/QualityMenu";
import { ScreenModeControls } from "./controls/ScreenModeControls";
import type { PlayerState } from "./types";

interface PlayerControlsProps {
  state: PlayerState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSeekRelative: (delta: number) => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onSetPlaybackRate: (rate: number) => void;
  onSetQuality: (quality: string) => void;
  onToggleFullscreen: () => void;
  onToggleTheaterMode: () => void;
  isVisible: boolean;
  accentColor?: string;
}

const CONTROL_BTN_CLASS =
  "flex items-center justify-center w-9 h-9 rounded-lg text-white/85 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-90 cursor-pointer";

/**
 * Main Player Controls Bar.
 * Orchestrates seekbar, playback actions, volume, settings, and display mode toggles.
 */
export function PlayerControls({
  state,
  onTogglePlay,
  onSeek,
  onSeekRelative,
  onSetVolume,
  onToggleMute,
  onSetPlaybackRate,
  onSetQuality,
  onToggleFullscreen,
  onToggleTheaterMode,
  isVisible,
  accentColor = "#E8A83C",
}: PlayerControlsProps) {
  return (
    <div
      className="absolute bottom-0 inset-x-0 z-20 transition-opacity duration-300 select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
      }}
      dir="rtl"
    >
      <div className="px-3 sm:px-5 pt-8 pb-3 space-y-1">
        {/* Seek / Progress Bar */}
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          loadedFraction={state.loadedFraction}
          onSeek={onSeek}
          accentColor={accentColor}
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-1">
          {/* Right side: Playback & Volume (RTL start) */}
          <div className="flex items-center gap-0.5">
            <PlaybackControls
              isPlaying={state.isPlaying}
              onTogglePlay={onTogglePlay}
              onSeekRelative={onSeekRelative}
              controlBtnClass={CONTROL_BTN_CLASS}
            />

            <VolumeSlider
              volume={state.volume}
              isMuted={state.isMuted}
              accentColor={accentColor}
              onSetVolume={onSetVolume}
              onToggleMute={onToggleMute}
              controlBtnClass={CONTROL_BTN_CLASS}
            />
          </div>

          {/* Left side: Speed, Quality & Screen Modes (RTL end) */}
          <div className="flex items-center gap-0.5">
            <SpeedMenu
              currentRate={state.playbackRate}
              onSetPlaybackRate={onSetPlaybackRate}
              accentColor={accentColor}
              controlBtnClass={CONTROL_BTN_CLASS}
            />

            <QualityMenu
              currentQuality={state.quality}
              availableQualities={state.availableQualities}
              onSetQuality={onSetQuality}
              accentColor={accentColor}
              controlBtnClass={CONTROL_BTN_CLASS}
            />

            <ScreenModeControls
              isFullscreen={state.isFullscreen}
              isTheaterMode={state.isTheaterMode}
              onToggleFullscreen={onToggleFullscreen}
              onToggleTheaterMode={onToggleTheaterMode}
              controlBtnClass={CONTROL_BTN_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
