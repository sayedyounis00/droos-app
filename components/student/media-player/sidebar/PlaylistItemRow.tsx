"use client";

import React from "react";
import Link from "next/link";
import type { PlaylistItem } from "../types";

interface PlaylistItemRowProps {
  item: PlaylistItem;
  index: number;
  isActive: boolean;
  basePath: string;
  primaryColor: string;
  accentColor: string;
}

/**
 * Individual lesson row item inside the player playlist sidebar.
 */
export function PlaylistItemRow({
  item,
  index,
  isActive,
  basePath,
  primaryColor,
  accentColor,
}: PlaylistItemRowProps) {
  return (
    <Link
      href={`${basePath}/lesson/${item.id}`}
      className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all duration-200 ${
        isActive ? "shadow-sm border font-bold" : "text-[#5B6270] hover:bg-[#F7F8F9]"
      }`}
      style={{
        backgroundColor: isActive ? `${primaryColor}0D` : "transparent",
        borderColor: isActive ? `${primaryColor}30` : "transparent",
        color: isActive ? primaryColor : undefined,
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Index number badge */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
            isActive ? "text-white" : "bg-[#EEF0F2] text-[#8A929B]"
          }`}
          style={isActive ? { backgroundColor: primaryColor } : undefined}
        >
          {index + 1}
        </div>

        <span className="truncate leading-snug">{item.title}</span>
      </div>

      {/* Playing state or arrow */}
      <div className="shrink-0 mr-2 flex items-center gap-1">
        {isActive ? (
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-[2px] h-3">
              <span
                className="w-[3px] rounded-full animate-pulse"
                style={{ backgroundColor: accentColor, height: "60%", animationDuration: "600ms" }}
              />
              <span
                className="w-[3px] rounded-full animate-pulse"
                style={{
                  backgroundColor: accentColor,
                  height: "100%",
                  animationDelay: "200ms",
                  animationDuration: "600ms",
                }}
              />
              <span
                className="w-[3px] rounded-full animate-pulse"
                style={{
                  backgroundColor: accentColor,
                  height: "40%",
                  animationDelay: "400ms",
                  animationDuration: "600ms",
                }}
              />
            </span>
            <span className="text-[10px] font-black" style={{ color: accentColor }}>
              الآن
            </span>
          </span>
        ) : (
          <svg width={13} height={13} viewBox="0 0 24 24" fill="#8A929B" className="opacity-50">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </div>
    </Link>
  );
}
