"use client";

import React from "react";
import type { PlaylistItem } from "./types";
import { PlaylistItemRow } from "./sidebar/PlaylistItemRow";

interface PlayerSidebarProps {
  playlist: PlaylistItem[];
  currentLessonId: string;
  moduleTitle?: string;
  basePath: string;
  accentColor?: string;
  primaryColor?: string;
}

/**
 * Sidebar playlist displaying all lessons in the current module.
 */
export function PlayerSidebar({
  playlist,
  currentLessonId,
  moduleTitle,
  basePath,
  accentColor = "#E8A83C",
  primaryColor = "#1F7A7B",
}: PlayerSidebarProps) {
  return (
    <div
      className="border rounded-2xl shadow-xs overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#EEF0F2" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#EEF0F2" }}
      >
        <div className="flex items-center gap-2">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <h3 className="text-sm font-black text-[#1C2126]">
            {moduleTitle || "حصص الوحدة"} ({playlist.length})
          </h3>
        </div>
      </div>

      {/* Playlist items list */}
      <div className="max-h-[520px] overflow-y-auto overscroll-contain">
        <div className="p-2 space-y-1">
          {playlist.map((item, idx) => (
            <PlaylistItemRow
              key={item.id}
              item={item}
              index={idx}
              isActive={item.id === currentLessonId}
              basePath={basePath}
              primaryColor={primaryColor}
              accentColor={accentColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
