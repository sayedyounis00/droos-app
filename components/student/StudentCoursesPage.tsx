"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { PlatformTheme } from "@/lib/themes";
import type { CourseItem } from "@/lib/droos-data";
import { Icon } from "@/components/ui/Icon";
import type { PageHeadingConfig } from "@/components/teacher/home-page-builder/types";

interface StudentCoursesPageProps {
  courses: CourseItem[];
  theme: PlatformTheme;
  slug: string;
  headingConfig?: PageHeadingConfig;
}

export function StudentCoursesPage({
  courses,
  theme,
  slug,
  headingConfig,
}: StudentCoursesPageProps) {
  const colors = theme.light;
  const basePath = `/p/${slug}`;

  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Extract distinct grade level names from courses
  const grades = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.grade_levels?.name_ar) {
        set.add(c.grade_levels.name_ar);
      }
    });
    return Array.from(set);
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (selectedGrade === "all") return courses;
    return courses.filter((c) => c.grade_levels?.name_ar === selectedGrade);
  }, [courses, selectedGrade]);

  const title = headingConfig?.title || "الكورسات والوحدات الدراسية";
  const subtitle =
    headingConfig?.subtitle ||
    "استكشف كافة الكورسات والوحدات التعليمية المتاحة للتسجيل والمشاهدة";

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
      {/* Page Header */}
      <section
        className="py-14 px-4 sm:px-6 lg:px-8 text-center border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-2"
            style={{ color: colors.secondary }}
          >
            المحتوى التعليمي
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          >
            {title}
          </h1>
          <p className="text-sm text-[#5B6270] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        {/* Grade Filter Tabs */}
        {grades.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setSelectedGrade("all")}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                selectedGrade === "all"
                  ? "shadow-sm text-white"
                  : "border text-[#4A5158] hover:bg-white"
              }`}
              style={{
                backgroundColor:
                  selectedGrade === "all" ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderRadius: theme.radius.buttonCss,
              }}
            >
              جميع الصفوف ({courses.length})
            </button>

            {grades.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  selectedGrade === grade
                    ? "shadow-sm text-white"
                    : "border text-[#4A5158] hover:bg-white"
                }`}
                style={{
                  backgroundColor:
                    selectedGrade === grade ? colors.primary : colors.surface,
                  borderColor: colors.border,
                  borderRadius: theme.radius.buttonCss,
                }}
              >
                {grade}
              </button>
            ))}
          </div>
        )}

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div
            className="rounded-3xl p-16 text-center border bg-white"
            style={{ borderColor: colors.border }}
          >
            <Icon
              name="book-open"
              size={40}
              className="mx-auto mb-3 text-[#8A929B]"
            />
            <h3 className="text-lg font-bold text-[#1C2126]">
              لا توجد كورسات متاحة في هذا الصف حالياً
            </h3>
            <p className="text-xs text-[#8A929B] mt-1">
              اختر صفاً آخر أو تفضل بالتواصل معنا للاستفسار عن المواعيد.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              const totalModules = course.modules?.length ?? 0;
              const totalLessons = (course.modules ?? []).reduce(
                (sum, m) => sum + (m.lessons?.length ?? 0),
                0
              );

              return (
                <div
                  key={course.id}
                  className="border transition-all shadow-xs overflow-hidden"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: theme.radius.cardCss,
                  }}
                >
                  {/* Course Header Bar */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-3 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: `${colors.primary}12`,
                            color: colors.primary,
                            borderRadius: theme.radius.badge,
                          }}
                        >
                          {course.grade_levels?.name_ar || "المرحلة التعليمية"}
                        </span>
                        <span className="text-xs text-[#8A929B] font-medium flex items-center gap-1">
                          <Icon name="layers" size={13} />
                          <span>{totalModules} وحدات</span>
                        </span>
                        <span className="text-xs text-[#8A929B] font-medium flex items-center gap-1">
                          <Icon name="play-circle" size={13} />
                          <span>{totalLessons} حصة</span>
                        </span>
                      </div>

                      <h2
                        className="text-xl sm:text-2xl font-black"
                        style={{
                          fontFamily: theme.fonts.display,
                          color: colors.textPrimary,
                        }}
                      >
                        {course.title}
                      </h2>

                      {course.description && (
                        <p className="text-xs sm:text-sm text-[#5B6270] leading-relaxed">
                          {course.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCourseId(isExpanded ? null : course.id)
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border transition-colors hover:bg-black/5"
                        style={{
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          borderRadius: theme.radius.buttonCss,
                        }}
                      >
                        <span>{isExpanded ? "إخفاء المحتويات" : "عرض الوحدات والحصص"}</span>
                        <Icon
                          name={isExpanded ? "chevron-down" : "chevron-left"}
                          size={14}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Modules & Lessons */}
                  {isExpanded && (
                    <div
                      className="border-t p-6 space-y-6"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      }}
                    >
                      <h4
                        className="text-xs font-black uppercase tracking-wider"
                        style={{ color: colors.secondary }}
                      >
                        خطة وحدات ودروس هذا الكورس:
                      </h4>

                      {course.modules?.length === 0 ? (
                        <p className="text-xs text-[#8A929B]">
                          لم تتم إضافة وحدات دراسية لهذا الكورس بعد.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.modules?.map((mod, modIdx) => (
                            <div
                              key={mod.id}
                              className="p-4 rounded-xl border bg-white space-y-3"
                              style={{ borderColor: colors.border }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-[#1F7A7B]">
                                  الوحدة {modIdx + 1}
                                </span>
                                <span className="text-[11px] font-bold text-[#8A929B]">
                                  {mod.lessons?.length || 0} حصة
                                </span>
                              </div>

                              <h5 className="text-sm font-bold text-[#1C2126]">
                                {mod.title}
                              </h5>

                              {/* Lessons list inside module */}
                              <div className="space-y-1.5 pt-2 border-t border-[#EEF0F2]">
                                {mod.lessons?.map((lesson, lessonIdx) => (
                                  <Link
                                    key={lesson.id}
                                    href={`${basePath}/lesson/${lesson.id}`}
                                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#4A5158] hover:bg-[#F7F8F9] hover:text-[#1F7A7B] transition-colors group"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        name={
                                          lesson.content_type === "video"
                                            ? "play"
                                            : "file-text"
                                        }
                                        size={13}
                                        className="text-[#8A929B] group-hover:text-[#1F7A7B]"
                                      />
                                      <span>
                                        {lessonIdx + 1}. {lesson.title}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#1F7A7B] opacity-0 group-hover:opacity-100 transition-opacity">
                                      مشاهدة الدرس ←
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
