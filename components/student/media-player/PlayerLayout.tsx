"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VideoPlayer } from "./VideoPlayer";
import { PlayerSidebar } from "./PlayerSidebar";
import type { PlaylistItem } from "./types";
import type { PlatformTheme } from "@/lib/themes";

interface LessonData {
  id: string;
  title: string;
  content_type: string;
  /** Whether this lesson has a video — the actual URL stays on the server */
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
 * Full lesson player page layout.
 * Composes VideoPlayer + PlayerSidebar + lesson details + tabs.
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

  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview");
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Find prev/next in playlist
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
      {/* Breadcrumb Navigation */}
      <div
        className="py-3 px-4 sm:px-6 lg:px-8 border-b text-xs font-medium"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#8A929B]">
            <Link
              href={basePath}
              className="hover:text-[#1F7A7B] transition-colors"
            >
              الرئيسية
            </Link>
            <span>/</span>
            <Link
              href={`${basePath}/courses`}
              className="hover:text-[#1F7A7B] transition-colors"
            >
              الكورسات
            </Link>
            {courseTitle && (
              <>
                <span>/</span>
                <span className="text-[#4A5158] font-bold">{courseTitle}</span>
              </>
            )}
            {moduleTitle && (
              <>
                <span>/</span>
                <span style={{ color: colors.primary }} className="font-bold">
                  {moduleTitle}
                </span>
              </>
            )}
          </div>

          <span className="text-[11px] text-[#8A929B] font-bold flex items-center gap-1.5">
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1F7A7B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span>مشغل الدروس</span>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
          isTheaterMode ? "max-w-full" : "max-w-7xl"
        }`}
      >
        <div
          className={`grid gap-6 sm:gap-8 ${
            isTheaterMode
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-12"
          }`}
        >
          {/* Main Content Area */}
          <div className={isTheaterMode ? "" : "lg:col-span-8"}>
            <div className="space-y-6">
              {/* Video Player */}
              <VideoPlayer
                lessonId={lesson.id}
                hasVideo={lesson.hasVideo}
                lessonTitle={lesson.title}
                accentColor={colors.accent || "#E8A83C"}
                isTheaterMode={isTheaterMode}
                onToggleTheaterMode={() => setIsTheaterMode((v) => !v)}
              />

              {/* Lesson Info Card */}
              <div
                className="p-5 sm:p-6 border shadow-xs rounded-2xl space-y-4"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                {/* Title + Nav */}
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
                      {lesson.title}
                    </h1>
                  </div>

                  {/* Prev / Next Buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {prevLesson && (
                      <Link
                        href={`${basePath}/lesson/${prevLesson.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded-xl hover:bg-black/5 transition-colors"
                        style={{
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
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
                        style={{ backgroundColor: colors.primary }}
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
                </div>

                {/* Tabs */}
                <div
                  className="pt-4 border-t flex items-center gap-4"
                  style={{ borderColor: colors.border }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "overview"
                        ? "border-[#1F7A7B] text-[#1F7A7B]"
                        : "border-transparent text-[#8A929B] hover:text-[#4A5158]"
                    }`}
                  >
                    شرح وملاحظات الدرس
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("pdf")}
                    className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "pdf"
                        ? "border-[#1F7A7B] text-[#1F7A7B]"
                        : "border-transparent text-[#8A929B] hover:text-[#4A5158]"
                    }`}
                  >
                    الملحقات والتمارين (PDF)
                  </button>
                </div>

                {/* Tab: Overview */}
                {activeTab === "overview" && (
                  <div className="pt-2 space-y-4 text-xs sm:text-sm text-[#5B6270] leading-relaxed">
                    <p>
                      {lesson.description ||
                        "في هذه الحصة يتم شرح المفاهيم التأسيسية وحل التطبيقات النموذجية خطوة بخطوة."}
                    </p>

                    {teacherNote && (
                      <div
                        className="p-4 rounded-xl border flex items-start gap-3 text-xs"
                        style={{
                          backgroundColor: `${colors.accent || "#E8A83C"}15`,
                          borderColor: `${colors.accent || "#E8A83C"}40`,
                          color: colors.primary,
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
                          <strong className="block font-black mb-0.5">
                            توجيه من المعلم:
                          </strong>
                          <p>{teacherNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Keyboard shortcuts hint */}
                    <div className="hidden sm:block pt-2">
                      <p className="text-[11px] text-[#8A929B] font-medium">
                        💡 اختصارات: مسافة = تشغيل/إيقاف • ← → = تقديم/ترجيع
                        10 ثواني • ↑ ↓ = مستوى الصوت • M = كتم • F = ملء
                        الشاشة • T = وضع المسرح
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: PDF */}
                {activeTab === "pdf" && (
                  <div className="pt-4">
                    <div
                      className="p-4 rounded-xl border flex items-center justify-between gap-4"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D9483D]/10 text-[#D9483D] flex items-center justify-center font-bold">
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </div>
                        <div>
                          <strong className="block text-xs font-bold text-[#1C2126]">
                            {pdfTitle || "ملخص الحصة والتمارين التطبيقية (PDF)"}
                          </strong>
                          <span className="text-[11px] text-[#8A929B]">
                            جاهز للطباعة والحل المنزلي
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "ملف التمارين متاح للطلاب المشتركين في المجموعة."
                          )
                        }
                        className="px-4 py-2 text-xs font-bold rounded-xl border border-[#D3D7DC] bg-white hover:bg-[#F7F8F9] text-[#1C2126] transition-colors shadow-2xs"
                      >
                        تحميل الملف
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Playlist */}
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
