import React from "react";
import type { PlatformTheme } from "@/lib/themes";
import { Icon } from "@/components/ui/Icon";
import type { ModulesPageData } from "../types";

interface ModulesPagePreviewProps {
  data: ModulesPageData;
  theme: PlatformTheme;
  isLiveData?: boolean;
  onViewLessons?: () => void;
}

export function ModulesPagePreview({
  data,
  theme,
  isLiveData,
  onViewLessons,
}: ModulesPagePreviewProps) {
  const colors = theme.light;

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
          <span>بيانات حية من قاعدة البيانات — هذه هي الكورسات والوحدات الحقيقية التي أضفتها</span>
        </div>
      ) : (
        <div className="bg-[#E0A429] text-[#1C2126] px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <Icon name="alert-triangle" size={14} strokeWidth={2} />
          <span>بيانات تجريبية — أضف كورسات ودروس من تبويب &quot;إدارة الدروس&quot; لتظهر هنا بيانات حقيقية</span>
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

          {/* Search bar mockup */}
          <div className="mt-8 mx-auto max-w-lg relative">
            <input
              type="text"
              readOnly
              placeholder="ابحث عن اسم الوحدة أو الدرس..."
              className="w-full rounded-2xl py-3 px-5 pr-11 text-xs font-bold shadow-sm outline-none cursor-pointer"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A929B]">
              <Icon name="search" size={15} strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {data.modules.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border-2 border-dashed border-[#D3D7DC] bg-[#F7F8F9] max-w-xl mx-auto">
            <div className="flex justify-center mb-4 text-[#D3D7DC]">
              <Icon name="book-open" size={48} strokeWidth={1.2} />
            </div>
            <h3 className="text-base font-black text-[#1C2126] mb-1">لم يتم إضافة وحدات دراسية بعد</h3>
            <p className="text-xs text-[#8A929B] leading-relaxed">
              أضف دورات ووحدات جديدة من قسم &quot;إدارة الدروس&quot; في لوحة التحكم، وستظهر فوراً هنا لطلابك في المنصة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.modules.map((m) => (
              <div
                key={m.id}
                className="p-6 flex flex-col justify-between transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 text-[10px] font-black"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary,
                        borderRadius:
                          theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                      }}
                    >
                      {m.badge}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold"
                      style={{ color: colors.textSecondary }}
                    >
                      <Icon name="clock" size={12} strokeWidth={1.8} />
                      <span>{m.duration}</span>
                    </span>
                  </div>

                  <h3
                    className="text-base font-black mb-3"
                    style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                  >
                    {m.title}
                  </h3>

                  <p
                    className="text-xs leading-relaxed mb-6"
                    style={{ color: colors.textSecondary }}
                  >
                    {m.description}
                  </p>
                </div>

                <div>
                  {/* Progress bar mockup */}
                  <div className="mb-4">
                    <div
                      className="flex items-center justify-between text-[10px] font-bold mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      <span>معدل الإنجاز</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{ width: `${m.progress}%`, backgroundColor: colors.accent }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={onViewLessons}
                    className="w-full font-black text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#FFFFFF",
                      borderRadius: theme.radius.buttonCss,
                    }}
                  >
                    <span>عرض دروس الوحدة ({m.lessonsCount} درس)</span>
                    <span>←</span>
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
