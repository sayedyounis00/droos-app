import { useState, useEffect, useCallback, useMemo } from "react";
import type { TeacherUser } from "@/lib/auth/teacher-auth";
import type { CourseItem } from "@/lib/droos-data";
import type {
  HomePageData,
  ModulesPageData,
  LessonsPageData,
  LessonDetailData,
} from "../types";
import {
  defaultModulesData,
  defaultLessonsData,
  defaultLessonDetailData,
} from "../constants";

interface UseCourseDataOptions {
  teacher?: TeacherUser | null;
  homePageData: HomePageData;
}

export function useCourseData({ teacher, homePageData }: UseCourseDataOptions) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);


  const fetchCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    try {
      const res = await fetch(
        `/api/teacher/courses?gradeLevelIds=all`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.courses)) {
        setCourses(json.courses as CourseItem[]);
      }
    } catch (err) {
      console.error("Failed to fetch courses for builder:", err);
    } finally {
      setIsLoadingCourses(false);
      setCoursesLoaded(true);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoadingCourses(true);
      try {
        const res = await fetch(
          `/api/teacher/courses?gradeLevelIds=all`
        );
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.courses)) {
          setCourses(json.courses as CourseItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch courses for builder:", err);
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false);
          setCoursesLoaded(true);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Flatten all real lessons with course & module context
  const allLessons = useMemo(() => {
    return courses.flatMap((course) =>
      (course.modules ?? []).flatMap((mod) =>
        (mod.lessons ?? []).map((l) => ({
          ...l,
          courseTitle: course.title,
          gradeName: course.grade_levels?.name_ar,
          moduleTitle: mod.title,
          moduleId: mod.id,
          courseId: course.id,
        }))
      )
    );
  }, [courses]);

  // Derive active lesson without cascading setState effect
  const activeLessonId = selectedLessonId ?? (allLessons[0]?.id ?? null);

  const currentActiveLesson = useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;
  }, [allLessons, activeLessonId]);

  const currentActiveModule = useMemo(() => {
    return (
      courses
        .flatMap((c) => c.modules ?? [])
        .find((m) => m.id === currentActiveLesson?.moduleId) || null
    );
  }, [courses, currentActiveLesson?.moduleId]);

  const currentActiveCourse = useMemo(() => {
    return courses.find((c) => c.id === currentActiveLesson?.courseId) || null;
  }, [courses, currentActiveLesson?.courseId]);

  const currentPlaylist = useMemo(() => {
    return currentActiveModule?.lessons ?? [];
  }, [currentActiveModule?.lessons]);

  // Map real courses → ModulesPageData
  const modulesData: ModulesPageData = useMemo(() => {
    return {
      title: homePageData.modulesPage?.title || defaultModulesData.title,
      subtitle: homePageData.modulesPage?.subtitle || defaultModulesData.subtitle,
      modules:
        coursesLoaded && courses.length > 0
          ? courses.flatMap((course) =>
              (course.modules ?? []).map((mod) => ({
                id: mod.id,
                title: mod.title,
                description:
                  course.description ||
                  `دروس ${course.title} — ${course.grade_levels?.name_ar ?? ""}`,
                lessonsCount: mod.lessons?.length ?? 0,
                duration: `${mod.lessons?.length ?? 0} حصة`,
                badge: `${course.title} • ${course.grade_levels?.name_ar ?? ""}`,
                progress: 0,
              }))
            )
          : defaultModulesData.modules,
    };
  }, [courses, coursesLoaded, homePageData.modulesPage]);

  // Map real lessons → LessonsPageData
  const lessonsData: LessonsPageData = useMemo(() => {
    return {
      title: homePageData.lessonsPage?.title || defaultLessonsData.title,
      subtitle: homePageData.lessonsPage?.subtitle || defaultLessonsData.subtitle,
      lessons:
        coursesLoaded && courses.length > 0
          ? courses.flatMap((course) =>
              (course.modules ?? []).flatMap((mod) =>
                (mod.lessons ?? []).map((lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
                  module: `${course.title} — ${mod.title}`,
                  duration:
                    lesson.content_type === "video"
                      ? "فيديو"
                      : lesson.content_type === "pdf"
                      ? "ملف PDF"
                      : "حصة تدريبية",
                  isFree: !lesson.video_url?.includes("locked"),
                  views: 0,
                }))
              )
            )
          : defaultLessonsData.lessons,
    };
  }, [courses, coursesLoaded, homePageData.lessonsPage]);

  // Lesson detail: driven by real active lesson & user customisation
  const lessonDetailData: LessonDetailData = useMemo(() => {
    return {
      title:
        homePageData.lessonDetailPage?.title ||
        currentActiveLesson?.title ||
        defaultLessonDetailData.title,
      moduleName:
        homePageData.lessonDetailPage?.moduleName ||
        (currentActiveLesson
          ? `${currentActiveModule?.title ?? "الوحدة الدراسية"} — ${currentActiveCourse?.title ?? ""}`
          : defaultLessonDetailData.moduleName),
      description:
        homePageData.lessonDetailPage?.description ||
        currentActiveLesson?.description ||
        defaultLessonDetailData.description,
      teacherNote:
        homePageData.lessonDetailPage?.teacherNote ||
        defaultLessonDetailData.teacherNote,
      pdfTitle:
        homePageData.lessonDetailPage?.pdfTitle ||
        defaultLessonDetailData.pdfTitle,
    };
  }, [
    currentActiveCourse?.title,
    currentActiveLesson,
    currentActiveModule?.title,
    homePageData.lessonDetailPage,
  ]);

  return {
    courses,
    isLoadingCourses,
    coursesLoaded,
    fetchCourses,
    allLessons,
    selectedLessonId: activeLessonId,
    setSelectedLessonId,
    currentActiveLesson,
    currentActiveModule,
    currentActiveCourse,
    currentPlaylist,
    modulesData,
    lessonsData,
    lessonDetailData,
  };
}
