"use client";

import React from "react";
import Link from "next/link";
import type { PlaylistItem } from "./types";

interface PlayerSidebarProps {
  playlist: PlaylistItem[];
  currentLessonId: string;
  moduleTitle?: string;
  basePath: string;
  accentColor?: string;
  primaryColor?: string;
}

/**
 * Sidebar playlist showing all lessons in the current module.
 * Highlights the currently playing lesson.
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
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#EEF0F2",
      }}
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

      {/* Playlist items */}
      <div className="max-h-[520px] overflow-y-auto overscroll-contain">
        <div className="p-2 space-y-1">
          {playlist.map((item, idx) => {
            const isActive = item.id === currentLessonId;

            return (
              <Link
                key={item.id}
                href={`${basePath}/lesson/${item.id}`}
                className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? "shadow-sm border font-bold"
                    : "text-[#5B6270] hover:bg-[#F7F8F9]"
                }`}
                style={{
                  backgroundColor: isActive ? `${primaryColor}0D` : "transparent",
                  borderColor: isActive ? `${primaryColor}30` : "transparent",
                  color: isActive ? primaryColor : undefined,
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Number badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      isActive
                        ? "text-white"
                        : "bg-[#EEF0F2] text-[#8A929B]"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: primaryColor }
                        : undefined
                    }
                  >
                    {idx + 1}
                  </div>

                  {/* Title */}
                  <span className="truncate leading-snug">{item.title}</span>
                </div>

                {/* Status indicator */}
                <div className="shrink-0 mr-2 flex items-center gap-1">
                  {isActive ? (
                    <span className="flex items-center gap-1">
                      {/* Animated bars (playing indicator) */}
                      <span className="flex items-end gap-[2px] h-3">
                        <span
                          className="w-[3px] rounded-full animate-pulse"
                          style={{
                            backgroundColor: accentColor,
                            height: "60%",
                            animationDelay: "0ms",
                            animationDuration: "600ms",
                          }}
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
                      <span
                        className="text-[10px] font-black"
                        style={{ color: accentColor }}
                      >
                        الآن
                      </span>
                    </span>
                  ) : (
                    <svg
                      width={13}
                      height={13}
                      viewBox="0 0 24 24"
                      fill="#8A929B"
                      className="opacity-50"
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
