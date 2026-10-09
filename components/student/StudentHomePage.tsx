"use client";

import React from "react";
import Link from "next/link";
import type { PlatformTheme } from "@/lib/themes";
import type { CourseItem } from "@/lib/droos-data";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { PLATFORM_CONFIG } from "@/components/teacher/home-page-builder/editors/ContactEditor";
import type { HomePageData, SocialPlatform } from "@/components/teacher/home-page-builder/types";

interface StudentHomePageProps {
  data: HomePageData;
  teachingYears: string[];
  courses: CourseItem[];
  theme: PlatformTheme;
  slug: string;
}

export function StudentHomePage({
  data,
  teachingYears,
  courses,
  theme,
  slug,
}: StudentHomePageProps) {
  const colors = theme.light;
  const basePath = `/p/${slug}`;

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 text-center sm:text-right"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: "#FFFFFF",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.accent} 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${colors.border} 0%, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto sm:mx-0">
            {/* Badge */}
            {data.hero.badge && (
              <div className="inline-flex items-center gap-2 mb-6">
                <span
                  className="px-4 py-1.5 text-xs font-black tracking-wide uppercase inline-flex items-center gap-1.5 shadow-sm"
                  style={{
                    backgroundColor: `${colors.accent}25`,
                    color: colors.accent,
                    border: `1px solid ${colors.accent}40`,
                    borderRadius: theme.radius.badge,
                  }}
                >
                  <Icon name="sparkles" size={13} strokeWidth={2} />
                  <span>{data.hero.badge}</span>
                </span>
              </div>
            )}

            {/* Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight mb-6"
              style={{ fontFamily: theme.fonts.display }}
            >
              {data.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg opacity-90 leading-relaxed mb-8 max-w-2xl text-[#EDEFF1]">
              {data.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <Link
                href={`${basePath}/courses`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-black shadow-lg transition-all hover:opacity-95 active:scale-95"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                  borderRadius: theme.radius.buttonCss,
                }}
              >
                <Icon name="book-open" size={18} strokeWidth={2} />
                <span>{data.hero.ctaText || "استكشف الكورسات المتاحة"}</span>
              </Link>

              {data.contact.whatsapp && (
                <a
                  href={`https://wa.me/2${data.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-all border border-white/20 active:scale-95"
                  style={{ borderRadius: theme.radius.buttonCss }}
                >
                  <Icon name="phone" size={16} strokeWidth={2} />
                  <span>تواصل للحجز المباشر</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Teaching Years Section */}
      <section
        className="py-12 border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: colors.secondary }}
              >
                المراحل والصفوف المتاحة
              </span>
              <h2
                className="text-xl sm:text-2xl font-black"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                الصفوف الدراسية التي يدرسها المعلم
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {teachingYears.map((year, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    borderRadius: theme.radius.badge,
                  }}
                >
                  <Icon name="check-circle" size={14} className="text-[#2E9E5B]" />
                  <span>{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: colors.secondary }}
              >
                الدورات والشروحات المتاحة
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                أحدث الكورسات والوحدات الدراسية
              </h2>
            </div>

            <Link
              href={`${basePath}/courses`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold hover:underline"
              style={{ color: colors.primary }}
            >
              <span>عرض جميع الكورسات</span>
              <Icon name="arrow-left" size={14} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div
              className="rounded-3xl p-12 text-center border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: `${colors.accent}20`,
                  color: colors.accent,
                }}
              >
                <Icon name="book-open" size={24} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                جاري إعداد الكورسات ونشرها قريباً
              </h3>
              <p className="mt-1 text-xs text-[#8A929B] max-w-md mx-auto">
                يقوم المعلم حالياً بإعداد المحتوى ورفعه على المنصة، تفضل بالتواصل معه مباشرة للاستفسار عن مواعيد المجموعات.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => {
                const totalModules = course.modules?.length ?? 0;
                const totalLessons = (course.modules ?? []).reduce(
                  (sum, m) => sum + (m.lessons?.length ?? 0),
                  0
                );
                const firstLesson = course.modules?.[0]?.lessons?.[0];

                return (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between p-6 border transition-all duration-200 hover:-translate-y-1 shadow-sm"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: theme.radius.cardCss,
                    }}
                  >
                    <div>
                      {/* Grade Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="px-3 py-1 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${colors.primary}12`,
                            color: colors.primary,
                            borderRadius: theme.radius.badge,
                          }}
                        >
                          {course.grade_levels?.name_ar || "المرحلة التعليمية"}
                        </span>
                        <span className="text-[11px] font-bold text-[#8A929B] flex items-center gap-1">
                          <Icon name="layers" size={12} />
                          <span>{totalModules} وحدات</span>
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3
                        className="text-lg font-black mb-2 leading-snug"
                        style={{
                          fontFamily: theme.fonts.display,
                          color: colors.textPrimary,
                        }}
                      >
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-[#5B6270] mb-6 line-clamp-3">
                        {course.description || "شرح شامل ومفصل مع حل تمارين متنوعة وتدريب مكثف على نماذج الامتحانات."}
                      </p>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
                      <span className="text-xs font-bold text-[#8A929B] flex items-center gap-1">
                        <Icon name="play-circle" size={14} className="text-[#2E9E5B]" />
                        <span>{totalLessons} حصة تعليمية</span>
                      </span>

                      {firstLesson ? (
                        <Link
                          href={`${basePath}/lesson/${firstLesson.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black transition-all hover:opacity-90"
                          style={{
                            backgroundColor: colors.primary,
                            color: "#FFFFFF",
                            borderRadius: theme.radius.buttonCss,
                          }}
                        >
                          <span>ابدأ المشاهدة</span>
                          <Icon name="chevron-left" size={12} />
                        </Link>
                      ) : (
                        <Link
                          href={`${basePath}/courses`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all hover:opacity-90"
                          style={{
                            backgroundColor: `${colors.border}80`,
                            color: colors.textPrimary,
                            borderRadius: theme.radius.buttonCss,
                          }}
                        >
                          <span>تفاصيل الدورة</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. About Teacher Section */}
      <section
        id="about"
        className="py-16 sm:py-20 border-t border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Card / Experience Badge */}
            <div className="lg:col-span-5">
              <div
                className="p-8 text-center sm:text-right border relative overflow-hidden"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderRadius: theme.radius.cardCss,
                }}
              >
                <div
                  className="w-20 h-20 mx-auto sm:mx-0 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md mb-6"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Icon name="user" size={36} strokeWidth={1.8} />
                </div>

                <h3
                  className="text-2xl font-black mb-1"
                  style={{
                    fontFamily: theme.fonts.display,
                    color: colors.textPrimary,
                  }}
                >
                  {data.about.name}
                </h3>
                <span
                  className="text-sm font-bold block mb-4"
                  style={{ color: colors.secondary }}
                >
                  معلم مادة {data.about.subject}
                </span>

                <div
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold mb-4 shadow-2xs"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent,
                    borderRadius: theme.radius.badge,
                    border: `1px solid ${colors.accent}40`,
                  }}
                >
                  <Icon name="star" size={14} />
                  <span>{data.about.experience || "خبرة تدريسية متميزة"}</span>
                </div>
              </div>
            </div>

            {/* Teacher Bio Text */}
            <div className="lg:col-span-7 space-y-4">
              <span
                className="text-xs font-bold uppercase tracking-wider block"
                style={{ color: colors.secondary }}
              >
                نبذة عن المعلم
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black leading-tight"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                منهجية تدريس واضحة تحقق لك الفهم قبل الحفظ
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6270] whitespace-pre-line">
                {data.about.bio}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                {data.contact.whatsapp && (
                  <a
                    href={`https://wa.me/2${data.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95"
                    style={{
                      backgroundColor: "#25D366",
                      borderRadius: theme.radius.buttonCss,
                    }}
                  >
                    <Icon name="message-square" size={14} />
                    <span>تواصل مع مستر {data.about.name.split(" ")[0]} مباشرة</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      {data.testimonials.testimonials.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: colors.secondary }}
              >
                قصص النجاح
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                {data.testimonials.title || "ماذا يقول أوائل الطلاب؟"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.testimonials.testimonials.map((t, index) => (
                <div
                  key={index}
                  className="p-6 border flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-1"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: theme.radius.cardCss,
                  }}
                >
                  <p className="text-xs sm:text-sm leading-relaxed text-[#5B6270] mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
                    <div>
                      <strong className="block text-xs font-black" style={{ color: colors.textPrimary }}>
                        {t.name}
                      </strong>
                      <span className="text-[11px] text-[#8A929B]">{t.grade}</span>
                    </div>

                    <div className="flex text-[#E8A83C]">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="star" size={12} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Contact Section */}
      <section
        id="contact"
        className="py-16 text-center"
        style={{
          backgroundColor: colors.primary,
          color: "#FFFFFF",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ fontFamily: theme.fonts.display }}>
            {data.contact.title || "تواصل معنا للاشتراك والاستفسار"}
          </h2>
          <p className="text-xs sm:text-sm opacity-85 mb-8 max-w-md mx-auto leading-relaxed">
            {data.contact.note || "للتسجيل والاستفسار تواصل معنا يومياً من 10 صباحاً حتى 10 مساءً"}
          </p>

          {/* Social and Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {data.contact.phone && (
              <a
                href={`tel:${data.contact.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black bg-white text-[#1C2126] shadow-sm hover:bg-opacity-95 active:scale-95 transition-all"
                style={{ borderRadius: theme.radius.buttonCss }}
              >
                <Icon name="phone" size={14} className="text-[#1F7A7B]" />
                <span className="dir-ltr">{data.contact.phone}</span>
              </a>
            )}

            {data.contact.whatsapp && (
              <a
                href={`https://wa.me/2${data.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black bg-[#25D366] text-white shadow-sm hover:opacity-95 active:scale-95 transition-all"
                style={{ borderRadius: theme.radius.buttonCss }}
              >
                <Icon name="message-square" size={14} />
                <span>واتساب: {data.contact.whatsapp}</span>
              </a>
            )}

            {/* Custom Socials */}
            {(data.contact.socials || []).map((social, idx) => {
              const config = PLATFORM_CONFIG[social.platform as SocialPlatform];
              return (
                <a
                  key={idx}
                  href={social.value.startsWith("http") ? social.value : `https://${social.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all"
                  style={{ borderRadius: theme.radius.buttonCss }}
                >
                  <SocialIcon platform={social.platform as SocialPlatform} size={14} />
                  <span>{social.label || config?.label || social.platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
