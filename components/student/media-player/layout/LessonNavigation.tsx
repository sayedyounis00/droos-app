"use client";

import React from "react";
import Link from "next/link";
import type { PlaylistItem } from "../types";

interface LessonNavigationProps {
  prevLesson: PlaylistItem | null;
  nextLesson: PlaylistItem | null;
  basePath: string;
  borderColor: string;
  textColor: string;
  primaryColor: string;
}

/**
 * Navigation buttons for jumping to previous or next lesson in the playlist.
 */
export function LessonNavigation({
  prevLesson,
  nextLesson,
  basePath,
  borderColor,
  textColor,
  primaryColor,
}: LessonNavigationProps) {
  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      {prevLesson && (
        <Link
          href={`${basePath}/lesson/${prevLesson.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded-xl hover:bg-black/5 transition-colors"
          style={{ borderColor, color: textColor }}
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>الحصة السابقة</span>
        </Link>
      )}

      {nextLesson && (
        <Link
          href={`${basePath}/lesson/${nextLesson.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          <span>الحصة التالية</span>
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
