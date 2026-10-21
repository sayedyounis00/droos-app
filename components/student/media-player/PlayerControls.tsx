"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ProgressBar } from "./ProgressBar";
import { PLAYBACK_RATES, QUALITY_LABELS } from "./types";
import type { PlayerState } from "./types";

/* ─── SVG Icon Helpers ─── */
function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function VolumeHighIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function VolumeMuteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeLowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function FullscreenIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function ExitFullscreenIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function TheaterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function Rewind10Icon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Clockwise circle with arrow pointing right (rewind in RTL) */}
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <polyline points="21 3 21 8 16 8" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10
      </text>
    </svg>
  );
}

function Forward10Icon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Counter-clockwise circle with arrow pointing left (forward in RTL) */}
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10
      </text>
    </svg>
  );
}

function PipIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="12" y="10" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* ─── Main PlayerControls Component ─── */

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
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeTrackRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const qualityMenuRef = useRef<HTMLDivElement>(null);

  const dragCleanupRef = useRef<(() => void) | null>(null);

  // Close menus on outside click & cleanup dragging on unmount
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(e.target as Node)) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      dragCleanupRef.current?.();
    };
  }, []);

  // Compute volume percentage from mouse event in RTL track
  const getVolumeFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    const track = volumeTrackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    // RTL: right edge is 0% (next to speaker), left edge is 100% (full volume)
    const x = rect.right - e.clientX;
    return Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
  }, []);

  const handleVolumeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingVolume(true);
      setShowVolumeSlider(true);
      const newVol = getVolumeFromEvent(e);
      onSetVolume(newVol);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const vol = getVolumeFromEvent(moveEvent);
        onSetVolume(vol);
      };

      const handleMouseUp = () => {
        setIsDraggingVolume(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [getVolumeFromEvent, onSetVolume]
  );

  const handleVolumeWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 5 : -5;
      const current = state.isMuted ? 0 : state.volume;
      const nextVol = Math.max(0, Math.min(100, current + delta));
      onSetVolume(nextVol);
    },
    [state.isMuted, state.volume, onSetVolume]
  );

  const effectiveVolume = state.isMuted ? 0 : state.volume;

  const VolumeIcon =
    state.isMuted || state.volume === 0
      ? VolumeMuteIcon
      : state.volume < 50
        ? VolumeLowIcon
        : VolumeHighIcon;

  const controlBtnClass =
    "flex items-center justify-center w-9 h-9 rounded-lg text-white/85 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-90 cursor-pointer";

  return (
    <div
      className="absolute bottom-0 inset-x-0 z-20 transition-opacity duration-300 select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
      }}
      dir="rtl"
    >
      <div className="px-3 sm:px-5 pt-8 pb-3 space-y-1">
        {/* Progress Bar */}
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          loadedFraction={state.loadedFraction}
          onSeek={onSeek}
          accentColor={accentColor}
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-1">
          {/* Right side controls (RTL: these appear on the right) */}
          <div className="flex items-center gap-0.5">
            {/* Rewind 10s — on the right side towards 0:00 */}
            <button
              type="button"
              onClick={() => onSeekRelative(-10)}
              className={controlBtnClass}
              aria-label="ترجيع 10 ثوانٍ"
              title="ترجيع 10 ثوانٍ (-10)"
            >
              <Rewind10Icon size={19} />
            </button>

            {/* Play/Pause — in center between rewind and forward */}
            <button
              type="button"
              onClick={onTogglePlay}
              className={`${controlBtnClass} w-9 h-9`}
              aria-label={state.isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              title={state.isPlaying ? "إيقاف مؤقت (مسافة)" : "تشغيل (مسافة)"}
            >
              {state.isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
            </button>

            {/* Forward 10s — to the left towards video duration */}
            <button
              type="button"
              onClick={() => onSeekRelative(10)}
              className={controlBtnClass}
              aria-label="تقديم 10 ثوانٍ"
              title="تقديم 10 ثوانٍ (+10)"
            >
              <Forward10Icon size={19} />
            </button>

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => {
                if (!isDraggingVolume) setShowVolumeSlider(false);
              }}
            >
              <button
                type="button"
                onClick={onToggleMute}
                className={controlBtnClass}
                aria-label={state.isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                title={state.isMuted ? "تشغيل الصوت (M)" : "كتم الصوت (M)"}
              >
                <VolumeIcon size={19} />
              </button>

              {/* Custom Interactive Volume Slider */}
              <div
                className="overflow-hidden transition-all duration-200 flex items-center pr-1 pl-2"
                style={{
                  width: showVolumeSlider || isDraggingVolume ? "76px" : "0px",
                  opacity: showVolumeSlider || isDraggingVolume ? 1 : 0,
                  pointerEvents: showVolumeSlider || isDraggingVolume ? "auto" : "none",
                }}
                onWheel={handleVolumeWheel}
              >
                <div
                  ref={volumeTrackRef}
                  className="relative w-full h-4 cursor-pointer group flex items-center"
                  onMouseDown={handleVolumeMouseDown}
                  role="slider"
                  aria-valuenow={effectiveVolume}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="مستوى الصوت"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const current = effectiveVolume;
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      onSetVolume(Math.min(100, current + 5));
                    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      onSetVolume(Math.max(0, current - 5));
                    }
                  }}
                >
                  {/* Track background */}
                  <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/20" />

                  {/* Filled track (RTL: fills from right to left) */}
                  <div
                    className="absolute right-0 h-1.5 rounded-full"
                    style={{
                      width: `${effectiveVolume}%`,
                      backgroundColor: accentColor,
                      transition: isDraggingVolume ? "none" : "width 0.1s ease",
                    }}
                  />

                  {/* Thumb handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-transform group-hover:scale-110"
                    style={{
                      right: `calc(${effectiveVolume}% - 6px)`,
                      transition: isDraggingVolume ? "none" : "right 0.1s ease, transform 0.15s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Left side controls (RTL: these appear on the left) */}
          <div className="flex items-center gap-0.5">
            {/* Speed Selector */}
            <div className="relative" ref={speedMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowSpeedMenu((v) => !v);
                  setShowQualityMenu(false);
                }}
                className={`${controlBtnClass} text-[11px] font-black w-auto px-2`}
                aria-label="سرعة التشغيل"
                title="سرعة التشغيل"
              >
                {state.playbackRate === 1 ? "1x" : `${state.playbackRate}x`}
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-[#1C2126]/95 backdrop-blur-sm rounded-xl border border-white/10 py-1.5 min-w-[90px] shadow-2xl z-50">
                  {PLAYBACK_RATES.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => {
                        onSetPlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`block w-full text-right px-4 py-1.5 text-xs font-bold transition-colors ${
                        state.playbackRate === rate
                          ? "text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                      style={state.playbackRate === rate ? { color: accentColor } : undefined}
                    >
                      {rate === 1 ? "عادي" : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector */}
            {state.availableQualities.length > 0 && (
              <div className="relative" ref={qualityMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowQualityMenu((v) => !v);
                    setShowSpeedMenu(false);
                  }}
                  className={`${controlBtnClass} text-[11px] font-black w-auto px-2`}
                  aria-label="جودة الفيديو"
                  title="جودة الفيديو"
                >
                  {QUALITY_LABELS[state.quality] || "جودة"}
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full mb-2 left-0 bg-[#1C2126]/95 backdrop-blur-sm rounded-xl border border-white/10 py-1.5 min-w-[100px] shadow-2xl z-50">
                    <button
                      type="button"
                      onClick={() => {
                        onSetQuality("default");
                        setShowQualityMenu(false);
                      }}
                      className="block w-full text-right px-4 py-1.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      تلقائي
                    </button>
                    {state.availableQualities
                      .filter((q) => q !== "auto")
                      .map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            onSetQuality(q);
                            setShowQualityMenu(false);
                          }}
                          className={`block w-full text-right px-4 py-1.5 text-xs font-bold transition-colors ${
                            state.quality === q
                              ? "text-white"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                          style={state.quality === q ? { color: accentColor } : undefined}
                        >
                          {QUALITY_LABELS[q] || q}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* PiP — always rendered; no-op for YouTube iframes */}
            <button
              type="button"
              onClick={() => {
                // PiP only works with <video> elements, not iframes
                // For YouTube iframe, this will be limited
              }}
              className={`${controlBtnClass} hidden sm:flex`}
              aria-label="صورة داخل صورة"
              title="صورة داخل صورة"
            >
              <PipIcon size={18} />
            </button>

            {/* Theater Mode */}
            <button
              type="button"
              onClick={onToggleTheaterMode}
              className={`${controlBtnClass} hidden sm:flex`}
              aria-label={state.isTheaterMode ? "الوضع العادي" : "وضع المسرح"}
              title={state.isTheaterMode ? "الوضع العادي" : "وضع المسرح"}
            >
              <TheaterIcon size={18} />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={controlBtnClass}
              aria-label={state.isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
              title={state.isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
            >
              {state.isFullscreen ? (
                <ExitFullscreenIcon size={19} />
              ) : (
                <FullscreenIcon size={19} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
