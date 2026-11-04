"use client";

import React, { useState, useRef, useEffect } from "react";
import { QUALITY_LABELS } from "../types";

interface QualityMenuProps {
  currentQuality: string;
  availableQualities: string[];
  onSetQuality: (quality: string) => void;
  accentColor?: string;
  controlBtnClass: string;
}

export function QualityMenu({
  currentQuality,
  availableQualities,
  onSetQuality,
  accentColor = "#E8A83C",
  controlBtnClass,
}: QualityMenuProps) {
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

  if (availableQualities.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${controlBtnClass} text-[11px] font-black w-auto px-2`}
        aria-label="جودة الفيديو"
        title="جودة الفيديو"
      >
        {QUALITY_LABELS[currentQuality] || "جودة"}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#1C2126]/95 backdrop-blur-sm rounded-xl border border-white/10 py-1.5 min-w-[100px] shadow-2xl z-50">
          <button
            type="button"
            onClick={() => {
              onSetQuality("default");
              setIsOpen(false);
            }}
            className="block w-full text-right px-4 py-1.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            تلقائي
          </button>
          {availableQualities
            .filter((q) => q !== "auto")
            .map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  onSetQuality(q);
                  setIsOpen(false);
                }}
                className={`block w-full text-right px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  currentQuality === q
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={currentQuality === q ? { color: accentColor } : undefined}
              >
                {QUALITY_LABELS[q] || q}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
