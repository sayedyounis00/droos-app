"use client";

import React from "react";
import { LessonNavigation } from "./LessonNavigation";
import { LessonTabs } from "./LessonTabs";
import type { PlaylistItem } from "../types";
import type { PlatformTheme } from "@/lib/themes";

interface LessonInfoCardProps {
  lessonTitle: string;
  moduleTitle?: string;
  description?: string | null;
  teacherNote?: string;
  pdfTitle?: string;
  prevLesson: PlaylistItem | null;
  nextLesson: PlaylistItem | null;
  basePath: string;
  theme: PlatformTheme;
}

/**
 * Details card below the video player containing title, navigation, and tabs.
 */
export function LessonInfoCard({
  lessonTitle,
  moduleTitle,
  description,
  teacherNote,
  pdfTitle,
  prevLesson,
  nextLesson,
  basePath,
  theme,
}: LessonInfoCardProps) {
  const colors = theme.light;

  return (
    <div
      className="p-5 sm:p-6 border shadow-xs rounded-2xl space-y-4"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      {/* Title + Prev/Next Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-1"
            style={{ color: colors.secondary }}
          >
            {moduleTitle || "الوحدة الدراسية"}
          </span>
          <h1
            className="text-xl sm:text-2xl font-black"
            style={{
              fontFamily: theme.fonts.display,
              color: colors.textPrimary,
            }}
          >
            {lessonTitle}
          </h1>
        </div>

        <LessonNavigation
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          basePath={basePath}
          borderColor={colors.border}
          textColor={colors.textPrimary}
          primaryColor={colors.primary}
        />
      </div>

      {/* Tabs */}
      <LessonTabs
        description={description}
        teacherNote={teacherNote}
        pdfTitle={pdfTitle}
        borderColor={colors.border}
        backgroundColor={colors.background}
        accentColor={colors.accent || "#E8A83C"}
        primaryColor={colors.primary}
      />
    </div>
  );
}
