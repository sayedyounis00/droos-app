"use client";

import React from "react";

interface TeacherNoteBannerProps {
  note: string;
  accentColor: string;
  primaryColor: string;
}

/**
 * Visual banner showing direct instructions or guidance from the teacher.
 */
export function TeacherNoteBanner({ note, accentColor, primaryColor }: TeacherNoteBannerProps) {
  return (
    <div
      className="p-4 rounded-xl border flex items-start gap-3 text-xs"
      style={{
        backgroundColor: `${accentColor}15`,
        borderColor: `${accentColor}40`,
        color: primaryColor,
      }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5"
      >
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
      <div>
        <strong className="block font-black mb-0.5">توجيه من المعلم:</strong>
        <p>{note}</p>
      </div>
    </div>
  );
}
