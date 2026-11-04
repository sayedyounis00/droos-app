"use client";

import React, { useState, useRef, useEffect } from "react";
import { PLAYBACK_RATES } from "../types";

interface SpeedMenuProps {
  currentRate: number;
  onSetPlaybackRate: (rate: number) => void;
  accentColor?: string;
  controlBtnClass: string;
}

export function SpeedMenu({
  currentRate,
  onSetPlaybackRate,
  accentColor = "#E8A83C",
  controlBtnClass,
}: SpeedMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${controlBtnClass} text-[11px] font-black w-auto px-2`}
        aria-label="سرعة التشغيل"
        title="سرعة التشغيل"
      >
        {currentRate === 1 ? "1x" : `${currentRate}x`}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#1C2126]/95 backdrop-blur-sm rounded-xl border border-white/10 py-1.5 min-w-[90px] shadow-2xl z-50">
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => {
                onSetPlaybackRate(rate);
                setIsOpen(false);
              }}
              className={`block w-full text-right px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currentRate === rate
                  ? "text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={currentRate === rate ? { color: accentColor } : undefined}
            >
              {rate === 1 ? "عادي" : `${rate}x`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
