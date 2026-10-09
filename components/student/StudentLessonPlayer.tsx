"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { PlatformTheme } from "@/lib/themes";
import { getYouTubeEmbedUrl } from "@/components/teacher/home-page-builder/utils";

interface PlaylistItem {
  id: string;
  module_id: string;
  title: string;
  content_type: string;
  video_url?: string | null;
  sort_order: number;
}

interface StudentLessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    content_type: string;
    video_url?: string | null;
    description?: string | null;
  };
  playlist: PlaylistItem[];
  courseTitle?: string;
  moduleTitle?: string;
  theme: PlatformTheme;
  slug: string;
  teacherNote?: string;
  pdfTitle?: string;
}

export function StudentLessonPlayer({
  lesson,
  playlist,
  courseTitle,
  moduleTitle,
  theme,
  slug,
  teacherNote,
  pdfTitle,
}: StudentLessonPlayerProps) {
  const colors = theme.light;
  const basePath = `/p/${slug}`;

  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview");

  const youtubeEmbedUrl = getYouTubeEmbedUrl(lesson.video_url);

  // Find index of current lesson in playlist for prev/next
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
      {/* Top Breadcrumb Navigation */}
      <div
        className="py-3 px-4 sm:px-6 lg:px-8 border-b text-xs font-medium"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#8A929B]">
            <Link href={basePath} className="hover:text-[#1F7A7B] transition-colors">
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
                <span className="text-[#1F7A7B] font-bold">{moduleTitle}</span>
              </>
            )}
          </div>

          <span className="text-[11px] text-[#8A929B] font-bold flex items-center gap-1.5">
            <Icon name="video" size={13} className="text-[#1F7A7B]" />
            <span>مشغل الدروس</span>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (Video & Details): 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black border border-black/10">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={lesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lesson.video_url && lesson.video_url.endsWith(".mp4") ? (
              <video
                src={lesson.video_url}
                controls
                className="w-full h-full"
                poster="/video-poster.jpg"
              >
                متصفحك لا يدعم تشغيل هذا الفيديو.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#0D1420] text-white space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#F3C97C]">
                  <Icon name="play" size={28} />
                </div>
                <h4 className="text-base font-bold">حصة دراسية بدون رابط فيديو مباشر</h4>
                <p className="text-xs text-white/70 max-w-sm">
                  هذا الدرس مسجل كحصة دراسية أو ملف تمارين. يمكنك مراجعة الملاحظات والملحقات أدناه.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Title and Prev/Next Navigation */}
          <div
            className="p-6 border shadow-xs rounded-2xl space-y-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
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
                {prevLesson ? (
                  <Link
                    href={`${basePath}/lesson/${prevLesson.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded-xl hover:bg-black/5 transition-colors"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <Icon name="arrow-right" size={13} />
                    <span>الحصة السابقة</span>
                  </Link>
                ) : null}

                {nextLesson ? (
                  <Link
                    href={`${basePath}/lesson/${nextLesson.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <span>الحصة التالية</span>
                    <Icon name="arrow-left" size={13} />
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Tabs for Overview / PDF */}
            <div className="pt-4 border-t flex items-center gap-4" style={{ borderColor: colors.border }}>
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

            {/* Tab 1 Content: Overview */}
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
                      backgroundColor: `${colors.accent}15`,
                      borderColor: `${colors.accent}40`,
                      color: colors.primary,
                    }}
                  >
                    <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-black mb-0.5">توجيه من المعلم:</strong>
                      <p>{teacherNote}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2 Content: PDF */}
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
                      <Icon name="file-text" size={20} />
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
                    onClick={() => alert("ملف التمارين متاح للطلاب المشتركين في المجموعة.")}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-[#D3D7DC] bg-white hover:bg-[#F7F8F9] text-[#1C2126] transition-colors shadow-2xs"
                  >
                    تحميل الملف
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Playlist: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="p-5 border rounded-2xl shadow-xs"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2">
                <Icon name="list" size={16} className="text-[#1F7A7B]" />
                <h3 className="text-sm font-black text-[#1C2126]">
                  حصص هذه الوحدة ({playlist.length})
                </h3>
              </div>
            </div>

            {/* List of lessons */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pl-1">
              {playlist.map((item, idx) => {
                const isActive = item.id === lesson.id;

                return (
                  <Link
                    key={item.id}
                    href={`${basePath}/lesson/${item.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all ${
                      isActive
                        ? "shadow-sm border font-bold text-[#1F7A7B]"
                        : "text-[#5B6270] hover:bg-black/5"
                    }`}
                    style={{
                      backgroundColor: isActive ? `${colors.primary}12` : "transparent",
                      borderColor: isActive ? `${colors.primary}30` : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isActive
                            ? "bg-[#1F7A7B] text-white"
                            : "bg-[#EEF0F2] text-[#8A929B]"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="shrink-0 mr-2">
                      {isActive ? (
                        <span className="text-[10px] font-bold text-[#1F7A7B]">يعمل الآن</span>
                      ) : (
                        <Icon name="play" size={12} className="text-[#8A929B]" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
