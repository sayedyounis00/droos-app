import { useState } from "react";
import type { PlatformTheme } from "@/lib/themes";
import { Icon } from "@/components/ui/Icon";
import type { LessonDetailData } from "../types";
import { getYouTubeEmbedUrl } from "../utils";

interface PlaylistItem {
  id: string;
  title: string;
  duration?: string;
  content_type?: string;
  video_url?: string | null;
}

interface LessonDetailPreviewProps {
  data: LessonDetailData;
  theme: PlatformTheme;
  videoUrl?: string | null;
  playlistLessons?: PlaylistItem[];
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
}

export function LessonDetailPreview({
  data,
  theme,
  videoUrl,
  playlistLessons = [],
  currentLessonId,
  onSelectLesson,
}: LessonDetailPreviewProps) {
  const colors = theme.light;
  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview");
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen pb-16"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Top Breadcrumb */}
      <div className="bg-[#0A3536] text-white py-3 px-6 text-xs font-bold border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="book-open" size={13} strokeWidth={1.8} />
            {data.moduleName}
          </span>

          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/70">
            <Icon name="video" size={11} strokeWidth={1.8} />
            مشغّل فيديو دُرُوس التفاعلي
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Container (YouTube Embed or Simulated Player) */}
          {youtubeEmbedUrl ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <iframe
                src={youtubeEmbedUrl}
                title={data.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group"
              style={{ backgroundColor: "#0D1420" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8A83C] text-[#0F4E4F] shadow-2xl transition-transform hover:scale-110 active:scale-95"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل الفيديو"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1.5" />
                    <rect x="14" y="5" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 fill-current translate-x-[-1px]" viewBox="0 0 24 24">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                )}
              </button>

              <div className="absolute bottom-4 right-4 left-4 z-10 flex items-center justify-between text-white text-xs font-bold">
                <span>
                  {isPlaying
                    ? "جاري تشغيل الفيديو..."
                    : "مشغّل فيديو تجريبي — اضغط للتشغيل"}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                  1080p Full HD
                </span>
              </div>
            </div>
          )}

          {/* Lesson Header */}
          <div
            className="p-6 rounded-2xl shadow-sm border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: theme.radius.cardCss,
            }}
          >
            <h1
              className="text-lg sm:text-2xl font-black mb-4"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            >
              {data.title}
            </h1>

            {/* Tab Controls */}
            <div className="flex items-center gap-2 border-b border-[#EEF0F2] pb-3 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  activeTab === "overview"
                    ? "bg-[#EAF4F4] text-[#1F7A7B]"
                    : "text-[#4A5158] hover:bg-[#F7F8F9]"
                }`}
              >
                <Icon name="file-text" size={13} strokeWidth={1.8} />
                <span>الوصف والملاحظات</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pdf")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  activeTab === "pdf"
                    ? "bg-[#EAF4F4] text-[#1F7A7B]"
                    : "text-[#4A5158] hover:bg-[#F7F8F9]"
                }`}
              >
                <Icon name="paperclip" size={13} strokeWidth={1.8} />
                <span>ملحقات PDF والتمارين</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  {data.description}
                </p>

                <div className="p-4 rounded-xl border border-[#CFE6E6] bg-[#EAF4F4]/50">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#0F4E4F] mb-1">
                    <Icon name="lightbulb" size={12} strokeWidth={1.8} />
                    <span>ملاحظة المعلم للطلاب:</span>
                  </span>
                  <p className="text-xs text-[#1C2126]">{data.teacherNote}</p>
                </div>
              </div>
            )}

            {activeTab === "pdf" && (
              <div className="p-4 rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4F4] text-[#1F7A7B]">
                    <Icon name="file-text" size={18} strokeWidth={1.6} />
                  </div>
                  <span className="text-xs font-bold">{data.pdfTitle}</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  تحميل PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Lesson Playlist Sidebar */}
        <div
          className="p-5 rounded-2xl shadow-sm border h-fit space-y-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: theme.radius.cardCss,
          }}
        >
          <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-3">
            <h3
              className="inline-flex items-center gap-1.5 text-sm font-black"
              style={{ color: colors.textPrimary }}
            >
              <Icon name="list" size={14} strokeWidth={1.8} />
              <span>
                قائمة دروس الوحدة ({playlistLessons.length > 0 ? playlistLessons.length : 6} دروس)
              </span>
            </h3>
            {playlistLessons.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4F4] text-[#1F7A7B]">
                تفاعلية
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {playlistLessons.length > 0 ? (
              playlistLessons.map((item, idx) => {
                const isActive = item.id === currentLessonId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectLesson?.(item.id)}
                    className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-[#EAF4F4] text-[#1F7A7B] font-black border-2 border-[#1F7A7B]/40 shadow-sm"
                        : "hover:bg-[#F7F8F9] text-[#4A5158] font-medium border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="flex h-2 w-2 rounded-full bg-[#2E9E5B] flex-shrink-0" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-[#8A929B] flex-shrink-0 fill-current" viewBox="0 0 24 24">
                          <polygon points="6 4 19 12 6 20 6 4" />
                        </svg>
                      )}
                      <span className="line-clamp-1">
                        {idx + 1}. {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-75">
                      {isActive ? "نشط الآن" : item.duration || "فيديو"}
                    </span>
                  </button>
                );
              })
            ) : (
              <>
                <div className="p-3 rounded-xl bg-[#EAF4F4] text-[#1F7A7B] font-bold border border-[#CFE6E6] flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[#2E9E5B] flex-shrink-0" />
                    1. مقدمة الأعداد المركبة
                  </span>
                  <span className="text-[10px]">نشط الآن</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between">
                  <span>2. الشكل الجبري والشكل القطبي</span>
                  <span className="text-[10px]">38 د</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between">
                  <span>3. نظرية ديموافر وتطبيقاتها</span>
                  <span className="text-[10px]">45 د</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between opacity-60">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="lock" size={11} strokeWidth={2} />
                    <span>4. الجذور التكعيبية للواحد الصحيح</span>
                  </span>
                  <span className="text-[10px]">مشتركين</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
