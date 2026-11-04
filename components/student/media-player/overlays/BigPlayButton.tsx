import React from "react";

interface BigPlayButtonProps {
  accentColor?: string;
  onClick: () => void;
}

/**
 * Centered Big Play Button displayed before first playback.
 */
export function BigPlayButton({
  accentColor = "#E8A83C",
  onClick,
}: BigPlayButtonProps) {
  return (
    <div
      className="absolute inset-0 z-12 flex items-center justify-center cursor-pointer select-none"
      onClick={onClick}
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
  );
}
