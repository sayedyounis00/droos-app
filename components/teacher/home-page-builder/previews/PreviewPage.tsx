import React from "react";
import type { PlatformTheme } from "@/lib/themes";
import type { CourseItem } from "@/lib/droos-data";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { PLATFORM_CONFIG } from "@/components/teacher/home-page-builder/editors/ContactEditor";
import type { HomePageData, SocialPlatform } from "../types";

interface PreviewPageProps {
  data: HomePageData;
  teachingYears: string[];
  courses?: CourseItem[];
  onViewAllCourses?: () => void;
  onViewCourse?: (courseId: string) => void;
  theme: PlatformTheme;
}

export function PreviewPage({
  data,
  teachingYears,
  courses = [],
  onViewAllCourses,
  onViewCourse,
  theme,
}: PreviewPageProps) {
  const colors = theme.light;

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Google Fonts Dynamic Load */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Baloo+Bhaijaan+2:wght@400;600;800&family=Cairo:wght@400;600;700;900&family=El+Messiri:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=Tajawal:wght@400;500;700;900&display=swap"
      />

      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: "#FFFFFF",
        }}
      >
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.accent} 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${colors.border} 0%, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold mb-6 backdrop-blur-md transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: `1px solid rgba(255, 255, 255, 0.25)`,
              borderRadius:
                theme.radius.badge === "rounded-full" ? "9999px" : theme.radius.cardCss,
              color: "#FFFFFF",
            }}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent }}
            />
            <span>{data.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-5xl font-black leading-tight mb-5 tracking-tight"
            style={{ fontFamily: theme.fonts.display }}
          >
            {data.hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
            {data.hero.subheadline}
          </p>

          {/* CTA Button */}
          <button
            className="inline-flex items-center gap-2 font-black px-8 py-4 text-sm transition-all active:scale-95"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              borderRadius: theme.radius.buttonCss,
              boxShadow: theme.shadow.button,
            }}
          >
            <span>{data.hero.ctaText}</span>
            <Icon name="arrow-left" size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Decorative Wave Divider */}
        <svg
          viewBox="0 0 1440 48"
          className="w-full h-8 sm:h-12"
          style={{ color: colors.background }}
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,48 C360,0 1080,48 1440,0 L1440,48 Z" />
        </svg>
      </section>

      {/* 2. About Section */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <div
          className="p-6 sm:p-8 transition-all flex flex-col sm:flex-row items-center gap-8"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: theme.radius.cardCss,
            boxShadow: theme.shadow.card,
          }}
        >
          {/* Avatar Icon */}
          <div
            className="flex-shrink-0 flex h-24 w-24 items-center justify-center text-4xl font-black text-white shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: colors.primary,
              borderRadius: theme.radius.cardCss,
            }}
          >
            {data.about.name.charAt(0)}
          </div>

          <div className="text-center sm:text-right">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold mb-3"
              style={{
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
                borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
              }}
            >
              <span>{data.about.subject}</span>
              <span>•</span>
              <span>{data.about.experience}</span>
            </div>

            <h2
              className="text-2xl font-black mb-3"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            >
              {data.about.name}
            </h2>

            <p
              className="text-sm leading-relaxed max-w-xl"
              style={{ color: colors.textSecondary }}
            >
              {data.about.bio}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Teaching Years Section (Static) */}
      <section className="py-14" style={{ backgroundColor: colors.surface }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-10">
            <h2
              className="text-2xl font-black mb-2"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            >
              السنوات والصفوف الدراسية
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              الصفوف والمراحل المتاحة للتسجيل مع المعلم (قسم ثابت تلقائي من النظام)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {teachingYears.map((year, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md min-w-0 flex flex-col items-center justify-between"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div
                  className="mb-3.5 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center text-lg sm:text-xl font-bold shrink-0"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    borderRadius: theme.radius.cardCss,
                  }}
                >
                  <Icon name="graduation-cap" size={20} strokeWidth={1.6} />
                </div>

                <h3 className="text-sm sm:text-base font-bold mb-2.5 text-center break-words max-w-full leading-snug" style={{ color: colors.textPrimary }}>
                  {year}
                </h3>

                <span
                  className="inline-block px-3 py-1 text-[11px] sm:text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.primary,
                    borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                  }}
                >
                  متاح للتسجيل
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.1 Real Courses Section from DB */}
      {courses && courses.length > 0 && (
        <section className="py-14" style={{ backgroundColor: colors.background }}>
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                >
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  <span>الكورسات الحالية المنشورة</span>
                </div>
                <h2
                  className="text-2xl font-black"
                  style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                >
                  الكورسات والدورات المتاحة
                </h2>
                <p className="text-xs sm:text-sm mt-1" style={{ color: colors.textSecondary }}>
                  اختر الدورة المناسبة لمرحلتك الدراسية واستكشف تفاصيل الحصص والدروس
                </p>
              </div>

              {onViewAllCourses && (
                <button
                  onClick={onViewAllCourses}
                  className="text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    borderRadius: theme.radius.buttonCss,
                  }}
                >
                  <span>عرض كل الوحدات</span>
                  <span>←</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.map((course) => {
                const modulesCount = course.modules?.length ?? 0;
                const lessonsCount = (course.modules ?? []).reduce(
                  (sum, m) => sum + (m.lessons?.length ?? 0),
                  0
                );
                return (
                  <div
                    key={course.id}
                    className="p-6 rounded-2xl flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: theme.radius.cardCss,
                      boxShadow: theme.shadow.card,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 text-[10px] font-black"
                          style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                            borderRadius:
                              theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                          }}
                        >
                          {course.grade_levels?.name_ar || "المرحلة الثانوية"}
                        </span>

                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold"
                          style={{ color: colors.textSecondary }}
                        >
                          <Icon name="book-open" size={12} strokeWidth={1.8} />
                          {modulesCount} وحدات • {lessonsCount} حصة
                        </span>
                      </div>

                      <h3
                        className="text-base sm:text-lg font-black mb-2"
                        style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                      >
                        {course.title}
                      </h3>

                      <p
                        className="text-xs leading-relaxed mb-6 line-clamp-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {course.description ||
                          "شرح شامل ومبسط للمنهج الدراسي مع ملخصات واختبارات دورية."}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onViewCourse) onViewCourse(course.id);
                        else if (onViewAllCourses) onViewAllCourses();
                      }}
                      className="w-full font-black text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                        borderRadius: theme.radius.buttonCss,
                      }}
                    >
                      <span>استعراض محتوى الدورة</span>
                      <span>←</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Testimonials Section */}
      <section className="py-14" style={{ backgroundColor: colors.background }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2
            className="text-2xl font-black text-center mb-10"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          >
            {data.testimonials.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {data.testimonials.testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 transition-all"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div className="mb-3" style={{ color: colors.accent }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                </div>

                <p
                  className="text-xs sm:text-sm leading-relaxed mb-5"
                  style={{ color: colors.textSecondary }}
                >
                  {t.text}
                </p>

                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: `1px solid ${colors.border}` }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold text-white"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: "9999px",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <span
                      className="text-xs font-bold block"
                      style={{ color: colors.textPrimary }}
                    >
                      {t.name}
                    </span>
                    <span
                      className="text-[10px] block"
                      style={{ color: colors.textSecondary }}
                    >
                      {t.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section
        className="py-16 text-center transition-all"
        style={{
          backgroundColor: colors.primary,
          color: "#FFFFFF",
        }}
      >
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-black mb-3" style={{ fontFamily: theme.fonts.display }}>
            {data.contact.title || "تواصل معنا"}
          </h2>

          <p className="text-xs sm:text-sm opacity-80 mb-8 max-w-md mx-auto">
            {data.contact.note}
          </p>

          {/* Dynamic Socials List */}
          {(() => {
            const hasSocials =
              Array.isArray(data.contact.socials) &&
              data.contact.socials.some((s) => Boolean(s.value?.trim()));

            const displayList = hasSocials
              ? (data.contact.socials || []).filter((s) => Boolean(s.value?.trim()))
              : [
                  ...(data.contact.phone
                    ? [{ platform: "phone" as SocialPlatform, value: data.contact.phone, label: "الهاتف" }]
                    : []),
                  ...(data.contact.whatsapp
                    ? [{ platform: "whatsapp" as SocialPlatform, value: data.contact.whatsapp, label: "واتساب" }]
                    : []),
                ];

            if (displayList.length === 0) return null;

            return (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
                {displayList.map((item, idx) => {
                  const isWhatsapp = item.platform === "whatsapp";
                  const defaultLabel = PLATFORM_CONFIG[item.platform as SocialPlatform]?.label ?? "";
                  const displayLabel = item.label || defaultLabel;

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black transition-all shadow-sm hover:opacity-95"
                      style={{
                        backgroundColor: isWhatsapp
                          ? colors.accent
                          : "rgba(255, 255, 255, 0.15)",
                        borderColor: isWhatsapp
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.25)",
                        borderWidth: "1px",
                        borderRadius: theme.radius.buttonCss,
                        color: isWhatsapp ? colors.primary : "#FFFFFF",
                        boxShadow: isWhatsapp ? theme.shadow.button : undefined,
                      }}
                    >
                      <SocialIcon
                        platform={item.platform as SocialPlatform}
                        size={15}
                        className="shrink-0"
                      />
                      <span>
                        {displayLabel ? `${displayLabel}: ` : ""}
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center text-xs py-6 opacity-60"
        style={{ backgroundColor: colors.background, color: colors.textSecondary }}
      >
        مدعوم بواسطة منصة <span className="font-bold" style={{ color: colors.primary }}>دُرُوس</span> — {theme.nameAr}
      </footer>
    </div>
  );
}
