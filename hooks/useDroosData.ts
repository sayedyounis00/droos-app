import { useState, useEffect, useCallback } from 'react';
import { CourseItem, EGYPTIAN_GRADE_LEVELS } from '@/lib/droos-data';
import { useToast } from './useToast';

export function useDroosData(initialTeacherId?: string) {
  const [teacherId, setTeacherId] = useState<string>(() => {
    if (initialTeacherId) return initialTeacherId;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('droos_teacher');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.id || '';
        } catch {}
      }
    }
    return '';
  });

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('droos_selected_grade_filter');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]);
  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);

  const { toast, toastMessage, showToast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('droos_selected_grade_filter', JSON.stringify(selectedGradeIds));
    }
  }, [selectedGradeIds]);

  const fetchCourses = useCallback(
    async (signal?: AbortSignal) => {
      setIsFetching(true);
      try {
        const params =
          selectedGradeIds.length > 0
            ? `gradeLevelIds=${selectedGradeIds.join(',')}`
            : 'gradeLevelIds=all';
        const res = await fetch(`/api/teacher/courses?${params}`, { signal });
        const data = await res.json();
        if (data.success) {
          const fetched: CourseItem[] = data.courses;
          setCourses(fetched);
          // Automatically expand first course if none is expanded
          setExpandedCourseIds((prev) => {
            if (prev.length > 0 || fetched.length === 0) return prev;
            return [fetched[0].id];
          });
          setExpandedModuleIds((prev) => {
            if (prev.length > 0 || fetched.length === 0) return prev;
            const firstModule = fetched[0].modules?.[0];
            return firstModule ? [firstModule.id] : prev;
          });
        }
      } catch (err) {
        if ((err as { name?: string }).name !== 'AbortError') {
          console.error('Error fetching courses:', err);
        }
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [selectedGradeIds]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchCourses]);

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const createCourse = async (
    title: string,
    description: string,
    gradeId: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/teacher/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          grade_level_id: gradeId,
          teacher_id: teacherId,
        }),
      });

      const data = await res.json();
      if (data.success && data.course) {
        showToast('تمت إضافة الدورة التعليمية بنجاح');
        const matchedStatic = EGYPTIAN_GRADE_LEVELS.find(
          (g) => g.id === gradeId || g.id === data.course.grade_level_id
        );
        const fullCourseItem: CourseItem = {
          ...data.course,
          grade_levels:
            data.course.grade_levels ??
            (matchedStatic ? { name_ar: matchedStatic.name_ar } : undefined),
          modules: data.course.modules ?? [],
        };
        setCourses((prev) => [fullCourseItem, ...prev]);
        setExpandedCourseIds((prev) => [...prev, fullCourseItem.id]);
        return true;
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء إضافة الدورة', 'error');
        return false;
      }
    } catch {
      showToast('حدث خطأ أثناء إضافة الدورة', 'error');
      return false;
    }
  };

  const updateCourse = async (
    courseId: string,
    title: string,
    description: string,
    gradeId: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/teacher/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: courseId,
          title,
          description,
          grade_level_id: gradeId,
        }),
      });

      const data = await res.json();
      if (data.success && data.course) {
        setCourses((prev) => prev.map((c) => (c.id === courseId ? data.course : c)));
        showToast('تم تحديث بيانات الدورة بنجاح');
        return true;
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء تعديل الدورة', 'error');
        return false;
      }
    } catch {
      showToast('حدث خطأ أثناء تعديل الدورة', 'error');
      return false;
    }
  };

  const deleteCourse = async (courseId: string): Promise<void> => {
    if (
      !confirm(
        'هل أنت متأكد من رغبتك في حذف هذه الدورة التعليمية وكافة الدروس والحصص التابعة لها؟\n\nتنبيه: هذا الإجراء لا يمكن التراجع عنه.'
      )
    )
      return;

    try {
      const res = await fetch(`/api/teacher/courses?courseId=${courseId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حذف الدورة التعليمية بنجاح');
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء حذف الدورة', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حذف الدورة', 'error');
    }
  };

  const addModule = async (courseId: string, title: string): Promise<void> => {
    try {
      const res = await fetch('/api/teacher/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, title }),
      });

      const data = await res.json();
      if (data.success && data.module) {
        showToast('تمت إضافة الدرس بنجاح');
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, modules: [...course.modules, data.module] }
              : course
          )
        );
        setExpandedModuleIds((prev) => [...prev, data.module.id]);
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء إضافة الدرس');
      }
    } catch {
      showToast('حدث خطأ أثناء إضافة الدرس');
    }
  };

  const updateModuleTitle = async (
    courseId: string,
    moduleId: string,
    title: string
  ): Promise<void> => {
    try {
      const res = await fetch('/api/teacher/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: moduleId, title }),
      });

      const data = await res.json();
      if (data.success && data.module) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  modules: course.modules.map((m) =>
                    m.id === moduleId ? { ...m, title: data.module.title } : m
                  ),
                }
              : course
          )
        );
        showToast('تم تحديث اسم الدرس بنجاح');
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء تعديل اسم الدرس', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء تعديل اسم الدرس', 'error');
    }
  };

  const deleteModule = async (courseId: string, moduleId: string): Promise<void> => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الدرس وكافة الحصص التابعة له؟')) return;

    try {
      const res = await fetch(`/api/teacher/modules?courseId=${courseId}&moduleId=${moduleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حذف الدرس بنجاح');
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, modules: course.modules.filter((m) => m.id !== moduleId) }
              : course
          )
        );
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء حذف الدرس', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حذف الدرس', 'error');
    }
  };

  const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    videoUrl?: string,
    description?: string
  ): Promise<void> => {
    try {
      const res = await fetch('/api/teacher/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          module_id: moduleId,
          title,
          content_type: 'video',
          video_url: videoUrl,
          description,
        }),
      });

      const data = await res.json();
      if (data.success && data.lesson) {
        showToast('تمت إضافة الحصة بنجاح');
        setCourses((prev) =>
          prev.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map((mod) => {
                  if (mod.id === moduleId) {
                    return { ...mod, lessons: [...mod.lessons, data.lesson] };
                  }
                  return mod;
                }),
              };
            }
            return course;
          })
        );
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء إضافة الحصة', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء إضافة الحصة', 'error');
    }
  };

  const updateLesson = async (
    moduleId: string,
    lessonId: string,
    title: string,
    videoUrl?: string,
    description?: string
  ): Promise<void> => {
    try {
      const res = await fetch('/api/teacher/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lessonId,
          title,
          video_url: videoUrl,
          description,
        }),
      });

      const data = await res.json();
      if (data.success && data.lesson) {
        setCourses((prev) =>
          prev.map((course) => ({
            ...course,
            modules: course.modules.map((mod) => {
              if (mod.id === moduleId) {
                return {
                  ...mod,
                  lessons: mod.lessons.map((l) => (l.id === lessonId ? data.lesson : l)),
                };
              }
              return mod;
            }),
          }))
        );
        showToast('تم تحديث الحصة بنجاح');
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء تعديل الحصة', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء تعديل الحصة', 'error');
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string): Promise<void> => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الحصة؟')) return;

    try {
      const res = await fetch(`/api/teacher/lessons?moduleId=${moduleId}&lessonId=${lessonId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حذف الحصة بنجاح');
        setCourses((prev) =>
          prev.map((course) => ({
            ...course,
            modules: course.modules.map((mod) => {
              if (mod.id === moduleId) {
                return {
                  ...mod,
                  lessons: mod.lessons.filter((l) => l.id !== lessonId),
                };
              }
              return mod;
            }),
          }))
        );
      } else {
        showToast(data.error ?? 'حدث خطأ أثناء حذف الحصة', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حذف الحصة', 'error');
    }
  };

  return {
    courses,
    selectedGradeIds,
    setSelectedGradeIds,
    isLoading,
    isFetching,
    expandedCourseIds,
    expandedModuleIds,
    toggleCourseExpand,
    toggleModuleExpand,
    createCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModuleTitle,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
    toast,
    toastMessage,
    showToast,
  };
}
