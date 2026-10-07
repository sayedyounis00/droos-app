import { useState } from "react";
import type { PlatformTheme } from "@/lib/themes";
import { Icon } from "@/components/ui/Icon";
import type { LessonsPageData } from "../types";

interface LessonsPagePreviewProps {
  data: LessonsPageData;
  theme: PlatformTheme;
  isLiveData?: boolean;
  onSelectLesson?: (lessonId: string) => void;
}

export function LessonsPagePreview({
  data,
  theme,
  isLiveData,
  onSelectLesson,
}: LessonsPagePreviewProps) {
  const colors = theme.light;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = data.lessons.filter(
    (l) =>
      !searchQuery.trim() ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Live data indicator */}
      {isLiveData ? (
        <div className="bg-[#2E9E5B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>بيانات حية من قاعدة البيانات — هذه هي الدروس الحقيقية التي أضفتها</span>
        </div>
      ) : (
        <div className="bg-[#E0A429] text-[#1C2126] px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <Icon name="alert-triangle" size={14} strokeWidth={2} />
          <span>بيانات تجريبية — أضف حصص ودروس من تبويب &quot;إدارة الدروس&quot; لتظهر هنا بيانات حقيقية</span>
        </div>
      )}

      {/* Header Banner */}
      <section
        className="py-12 px-6 text-center shadow-sm"
        style={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-2xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          >
            {data.title}
          </h1>

          <p
            className="text-xs sm:text-base max-w-xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            {data.subtitle}
          </p>

          {/* Real-time search bar */}
          <div className="mt-8 mx-auto max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم الدرس أو الدورة..."
              className="w-full rounded-2xl py-3 px-5 pr-11 pl-10 text-xs font-bold shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#1F7A7B]/20"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A929B]">
              <Icon name="search" size={15} strokeWidth={1.8} />
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A929B] hover:text-[#1C2126]"
              >
                <Icon name="x" size={13} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Lessons List */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border-2 border-dashed border-[#D3D7DC] bg-[#F7F8F9] max-w-xl mx-auto">
            <div className="flex justify-center mb-4 text-[#D3D7DC]">
              <Icon name="tv" size={48} strokeWidth={1.2} />
            </div>
            <h3 className="text-base font-black text-[#1C2126] mb-1">لا توجد دروس مطابقة</h3>
            <p className="text-xs text-[#8A929B] leading-relaxed">
              {searchQuery
                ? "جرّب البحث بكلمة أخرى أو تصفح باقي الدروس."
                : "أضف حصص ودروس جديدة من تبويب إدارة الدروس لتظهر هنا."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((l) => (
              <div
                key={l.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => onSelectLesson?.(l.id)}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl shadow-md cursor-pointer transition-transform hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.accent,
                    }}
                  >
                    ▶
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: l.isFree ? `${colors.accent}30` : `${colors.primary}15`,
                          color: colors.primary,
                          borderRadius: "9999px",
                        }}
                      >
                        {l.isFree ? (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="sparkles" size={9} strokeWidth={2} />
                            <span>درس مجاني</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="lock" size={9} strokeWidth={2} />
                            <span>مشتركين</span>
                          </span>
                        )}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: colors.textSecondary }}
                      >
                        {l.module}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectLesson?.(l.id)}
                      className="text-sm sm:text-base font-bold cursor-pointer hover:underline"
                      style={{ color: colors.textPrimary }}
                    >
                      {l.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: colors.textSecondary }}
                  >
                    <Icon name="clock" size={12} strokeWidth={1.8} />
                    <span>{l.duration}</span>
                  </span>

                  <button
                    onClick={() => onSelectLesson?.(l.id)}
                    className="px-4 py-2 text-xs font-black rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                      borderRadius: theme.radius.buttonCss,
                    }}
                  >
                    مشاهدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
