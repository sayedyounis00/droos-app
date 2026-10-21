"use client";

import React, { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { PlayerSidebar } from "./PlayerSidebar";
import { PlayerBreadcrumb } from "./layout/PlayerBreadcrumb";
import { LessonInfoCard } from "./layout/LessonInfoCard";
import type { PlaylistItem } from "./types";
import type { PlatformTheme } from "@/lib/themes";

interface LessonData {
  id: string;
  title: string;
  content_type: string;
  hasVideo: boolean;
  description?: string | null;
}

interface PlayerLayoutProps {
  lesson: LessonData;
  playlist: PlaylistItem[];
  courseTitle?: string;
  moduleTitle?: string;
  theme: PlatformTheme;
  slug: string;
  teacherNote?: string;
  pdfTitle?: string;
}

/**
 * Top-level lesson player page layout.
 * Composes PlayerBreadcrumb, VideoPlayer, LessonInfoCard, and PlayerSidebar.
 */
export function PlayerLayout({
  lesson,
  playlist,
  courseTitle,
  moduleTitle,
  theme,
  slug,
  teacherNote,
  pdfTitle,
}: PlayerLayoutProps) {
  const colors = theme.light;
  const basePath = `/p/${slug}`;
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Compute adjacent lessons
  const currentIndex = playlist.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? playlist[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < playlist.length - 1
      ? playlist[currentIndex + 1]
      : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen pb-20"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Top Breadcrumb */}
      <PlayerBreadcrumb
        basePath={basePath}
        courseTitle={courseTitle}
        moduleTitle={moduleTitle}
        primaryColor={colors.primary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
      />

      {/* Main Grid Layout */}
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
          isTheaterMode ? "max-w-full" : "max-w-7xl"
        }`}
      >
        <div
          className={`grid gap-6 sm:gap-8 ${
            isTheaterMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
          }`}
        >
          {/* Main Video & Lesson Content */}
          <div className={isTheaterMode ? "" : "lg:col-span-8"}>
            <div className="space-y-6">
              <VideoPlayer
                lessonId={lesson.id}
                hasVideo={lesson.hasVideo}
                lessonTitle={lesson.title}
                accentColor={colors.accent || "#E8A83C"}
                isTheaterMode={isTheaterMode}
                onToggleTheaterMode={() => setIsTheaterMode((v) => !v)}
              />

              <LessonInfoCard
                lessonTitle={lesson.title}
                moduleTitle={moduleTitle}
                description={lesson.description}
                teacherNote={teacherNote}
                pdfTitle={pdfTitle}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                basePath={basePath}
                theme={theme}
              />
            </div>
          </div>

          {/* Module Playlist Sidebar */}
          <div className={isTheaterMode ? "max-w-md" : "lg:col-span-4"}>
            <PlayerSidebar
              playlist={playlist}
              currentLessonId={lesson.id}
              moduleTitle={moduleTitle}
              basePath={basePath}
              accentColor={colors.accent || "#E8A83C"}
              primaryColor={colors.primary}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
