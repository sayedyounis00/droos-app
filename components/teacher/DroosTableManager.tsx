"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GradeLevelFilterChips from "./GradeLevelFilterChips";
import GradeLevelSelector from "./GradeLevelSelector";
import { CourseItem, ModuleItem, LessonItem, EGYPTIAN_GRADE_LEVELS } from "@/lib/droos-data";

interface DroosTableManagerProps {
  teacherGrades?: string[];
}

export default function DroosTableManager({ teacherGrades = [] }: DroosTableManagerProps) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("droos_selected_grade_filter");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("droos_selected_grade_filter", JSON.stringify(selectedGradeIds));
    }
  }, [selectedGradeIds]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Expanded State Trackers
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]);
  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);

  // Create Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseGradeId, setNewCourseGradeId] = useState("");
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  // Edit Course Modal State
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState("");
  const [editCourseDesc, setEditCourseDesc] = useState("");
  const [editCourseGradeId, setEditCourseGradeId] = useState("");
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);

  // New Module Input States { courseId: title }
  const [newModuleTitles, setNewModuleTitles] = useState<Record<string, string>>({});
  const [activeModuleAddCourseId, setActiveModuleAddCourseId] = useState<string | null>(null);

  // Edit Module Input States (تعديل اسم الدرس / الوحدة)
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState<string>("");
  const [isUpdatingModule, setIsUpdatingModule] = useState(false);

  // New Lesson Input States { moduleId: { title, videoUrl, description } }
  const [newLessonData, setNewLessonData] = useState<
    Record<string, { title: string; videoUrl: string; description: string }>
  >({});
  const [activeLessonAddModuleId, setActiveLessonAddModuleId] = useState<string | null>(null);

  // Edit Lesson Input States
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonData, setEditingLessonData] = useState<{ title: string; videoUrl: string; description: string }>({
    title: "",
    videoUrl: "",
    description: "",
  });

  // Toast Notification State & Timeout Ref
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 3500);
  }, []);

  const fetchCourses = useCallback(async (signal?: AbortSignal) => {
    setIsFetching(true);
    if (courses.length === 0) setIsLoading(true);
    try {
      const params = selectedGradeIds.length > 0 ? `gradeLevelIds=${selectedGradeIds.join(',')}` : 'gradeLevelIds=all';
      const res = await fetch(`/api/teacher/courses?${params}`, { signal });
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        // Automatically expand first course if present
        if (data.courses.length > 0 && expandedCourseIds.length === 0) {
          setExpandedCourseIds([data.courses[0].id]);
          if (data.courses[0].modules?.length > 0) {
            setExpandedModuleIds([data.courses[0].modules[0].id]);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error fetching courses:", err);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [selectedGradeIds, courses.length, expandedCourseIds.length]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(controller.signal);
    return () => {
      controller.abort();
    };
  }, [selectedGradeIds]);


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

  // Create Course Handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    if (!newCourseGradeId) {
      alert("يرجى اختيار المرحلة الدراسية والصف الدراسي");
      return;
    }

    setIsSubmittingCourse(true);
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc,
          grade_level_id: newCourseGradeId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("تمت إضافة الدورة التعليمية بنجاح");
        setIsCourseModalOpen(false);
        setNewCourseTitle("");
        setNewCourseDesc("");
        setNewCourseGradeId("");
        if (data.course) {
          const matchedStatic = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === newCourseGradeId || g.id === data.course.grade_level_id);
          const fullCourseItem: CourseItem = {
            ...data.course,
            grade_levels: data.course.grade_levels || (matchedStatic ? { name_ar: matchedStatic.name_ar } : undefined),
            modules: data.course.modules || [],
          };
          setCourses(prev => [fullCourseItem, ...prev]);
          setExpandedCourseIds(prev => [...prev, fullCourseItem.id]);
        }
      } else {
        alert(data.error || "حدث خطأ أثناء إضافة الدورة");
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الدورة");
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  // Edit Course Handler — open modal pre-filled with existing data
  const startEditingCourse = (course: CourseItem) => {
    setEditingCourseId(course.id);
    setEditCourseTitle(course.title);
    setEditCourseDesc(course.description || "");
    // Match either by static ID or by Arabic name so the dropdown pre-selects correctly
    const matchedGrade = EGYPTIAN_GRADE_LEVELS.find(
      (g) => g.id === course.grade_level_id || (course.grade_levels?.name_ar && g.name_ar === course.grade_levels.name_ar)
    );
    setEditCourseGradeId(matchedGrade ? matchedGrade.id : course.grade_level_id);
    setIsEditCourseModalOpen(true);
  };

  // Update Course Handler
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseTitle.trim() || !editingCourseId) return;
    if (!editCourseGradeId) {
      alert("يرجى اختيار الصف الدراسي");
      return;
    }

    setIsUpdatingCourse(true);
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCourseId,
          title: editCourseTitle,
          description: editCourseDesc,
          grade_level_id: editCourseGradeId,
        }),
      });

      const data = await res.json();
      if (data.success && data.course) {
        setCourses(prev => prev.map(c => c.id === editingCourseId ? data.course : c));
        setIsEditCourseModalOpen(false);
        setEditingCourseId(null);
        showToast("تم تحديث بيانات الدورة بنجاح");
      } else {
        alert(data.error || "حدث خطأ أثناء تعديل الدورة");
      }
    } catch {
      alert("حدث خطأ أثناء تعديل الدورة");
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  // Delete Course Handler
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الدورة التعليمية وكافة الدروس والحصص التابعة لها؟\n\n⚠️ هذا الإجراء لا يمكن التراجع عنه.")) return;

    try {
      const res = await fetch(`/api/teacher/courses?courseId=${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم حذف الدورة التعليمية بنجاح");
        setCourses(prev => prev.filter(c => c.id !== courseId));
      } else {
        alert(data.error || "حدث خطأ أثناء حذف الدورة");
      }
    } catch {
      alert("حدث خطأ أثناء حذف الدورة");
    }
  };

  // Create Module Handler (+ إضافة درس)
  const handleAddModule = async (courseId: string) => {
    const title = newModuleTitles[courseId] || "";
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/teacher/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, title }),
      });

      const data = await res.json();
      if (data.success) {
        setNewModuleTitles((prev) => ({ ...prev, [courseId]: "" }));
        setActiveModuleAddCourseId(null);
        showToast("تمت إضافة الدرس بنجاح");
        if (data.module) {
          setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
              return { ...course, modules: [...course.modules, data.module] };
            }
            return course;
          }));
          setExpandedModuleIds((prev) => [...prev, data.module.id]);
        }
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الدرس");
    }
  };

  // Delete Module Handler
  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الدرس وكافة الحصص التابعة له؟")) return;

    try {
      const res = await fetch(`/api/teacher/modules?courseId=${courseId}&moduleId=${moduleId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم حذف الدرس بنجاح");
        setCourses(prev => prev.map(course => {
          if (course.id === courseId) {
            return { ...course, modules: course.modules.filter(m => m.id !== moduleId) };
          }
          return course;
        }));
      }
    } catch {
      alert("حدث خطأ أثناء حذف الدرس");
    }
  };

  // Start Editing Module
  const startEditingModule = (moduleItem: ModuleItem) => {
    setEditingModuleId(moduleItem.id);
    setEditingModuleTitle(moduleItem.title);
  };

  // Update Module Handler (تعديل اسم الدرس)
  const handleUpdateModule = async (courseId: string, moduleId: string) => {
    if (!editingModuleTitle.trim()) return;

    setIsUpdatingModule(true);
    try {
      const res = await fetch("/api/teacher/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId, title: editingModuleTitle }),
      });

      const data = await res.json();
      if (data.success && data.module) {
        setCourses((prev) =>
          prev.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map((m) =>
                  m.id === moduleId ? { ...m, title: data.module.title } : m
                ),
              };
            }
            return course;
          })
        );
        setEditingModuleId(null);
        setEditingModuleTitle("");
        showToast("تم تحديث اسم الدرس بنجاح");
      } else {
        alert(data.error || "حدث خطأ أثناء تعديل اسم الدرس");
      }
    } catch {
      alert("حدث خطأ أثناء تعديل اسم الدرس");
    } finally {
      setIsUpdatingModule(false);
    }
  };

  // Create Lesson Handler (+ إضافة حصة)
  const handleAddLesson = async (courseId: string, moduleId: string) => {
    const lessonInfo = newLessonData[moduleId] || { title: "", videoUrl: "", description: "" };
    if (!lessonInfo.title.trim()) return;

    try {
      const res = await fetch("/api/teacher/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          module_id: moduleId,
          title: lessonInfo.title,
          content_type: "video",
          video_url: lessonInfo.videoUrl,
          description: lessonInfo.description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewLessonData((prev) => ({
          ...prev,
          [moduleId]: { title: "", videoUrl: "", description: "" },
        }));
        setActiveLessonAddModuleId(null);
        showToast("تمت إضافة الحصة بنجاح");
        if (data.lesson) {
          setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
              return {
                ...course,
                modules: course.modules.map(module => {
                  if (module.id === moduleId) {
                    return { ...module, lessons: [...module.lessons, data.lesson] };
                  }
                  return module;
                })
              };
            }
            return course;
          }));
        }
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الحصة");
    }
  };

  // Delete Lesson Handler
  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الحصة؟")) return;

    try {
      const res = await fetch(`/api/teacher/lessons?moduleId=${moduleId}&lessonId=${lessonId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم حذف الحصة بنجاح");
        setCourses(prev => prev.map(course => {
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id === moduleId) {
                return { ...module, lessons: module.lessons.filter(l => l.id !== lessonId) };
              }
              return module;
            })
          };
        }));
      }
    } catch {
      alert("حدث خطأ أثناء حذف الحصة");
    }
  };

  // Start Editing Lesson
  const startEditingLesson = (lesson: LessonItem) => {
    setEditingLessonId(lesson.id);
    setEditingLessonData({
      title: lesson.title,
      videoUrl: lesson.video_url || "",
      description: lesson.description || "",
    });
  };

  // Update Lesson Handler
  const handleUpdateLesson = async (moduleId: string, lessonId: string) => {
    if (!editingLessonData.title.trim()) return;

    try {
      const res = await fetch("/api/teacher/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lessonId,
          title: editingLessonData.title,
          video_url: editingLessonData.videoUrl,
          description: editingLessonData.description,
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
        setEditingLessonId(null);
        showToast("تم تحديث بيانات الحصة بنجاح");
      } else {
        alert(data.error || "حدث خطأ أثناء تعديل الحصة");
      }
    } catch {
      alert("حدث خطأ أثناء تعديل الحصة");
    }
  };



  const getGradeName = (course: CourseItem) => {
    if (course.grade_levels?.name_ar) return course.grade_levels.name_ar;
    const found = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === course.grade_level_id || g.name_ar === course.grade_level_id);
    return found ? found.name_ar : "غير محدد";
  };

  return (
    <div className="space-y-6">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-2xl bg-[#2E9E5B] p-4 text-sm font-bold text-white shadow-lg shadow-[#2E9E5B]/20">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#EEF0F2] bg-white p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4F4] px-3 py-1 text-xs font-bold text-[#1F7A7B] mb-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            جدول إدارة المحتوى الدراسي
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C2126]">
            إدارة الدروس والحصص الدراسية (Droos Table)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#4A5158]">
            إضافة الدورات، تقسيم المنهج إلى <strong>دروس</strong> (وحدات)، وإضافة <strong>الحصص</strong> لكل درس.
          </p>
        </div>

        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#1F7A7B] py-3 px-5 text-sm font-bold text-white shadow-lg shadow-[#1F7A7B]/20 transition-all hover:bg-[#166465] active:scale-[0.98] shrink-0"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>إضافة دورة جديدة</span>
        </button>
      </div>

      {/* Grade Level Filter Chips Bar */}
      <div className="rounded-3xl border border-[#EEF0F2] bg-white p-5 shadow-sm">
        <GradeLevelFilterChips
          selectedGradeIds={selectedGradeIds}
          onSelectGrade={setSelectedGradeIds}
          teacherGrades={teacherGrades}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-3xl border border-[#EEF0F2] bg-white p-12 text-center">
          <svg className="mx-auto h-8 w-8 animate-spin text-[#1F7A7B]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-3 text-xs font-bold text-[#8A929B]">جاري تحميل الدورات والدروس...</p>
        </div>
      ) : courses.length === 0 ? (

        /* Empty State (No Courses) */
        <div className="rounded-3xl border border-dashed border-[#D3D7DC] bg-white p-10 sm:p-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF4F4] text-[#1F7A7B]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1C2126]">لا توجد دورات مضافة لهذا الصف حتى الآن</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#8A929B] max-w-md mx-auto">
            قم بإنشاء أول دورة تعليمية، ثم أضف الدروس والحصص داخلها ليتمكن طلابك من مشاهدتها.
          </p>
          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1F7A7B] py-3 px-6 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#1F7A7B]/20 hover:bg-[#166465]"
          >
            <span>+ إضافة أول دورة تعليمية</span>
          </button>
        </div>

      ) : (

        /* Courses Accordion List */
        <div className={`space-y-5 transition-opacity duration-300 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
          {courses.map((course) => {
            const isCourseExpanded = expandedCourseIds.includes(course.id);
            const isAddingModule = activeModuleAddCourseId === course.id;

            return (
              <div
                key={course.id}
                className="rounded-3xl border border-[#EEF0F2] bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
              >

                {/* Course Bar Header */}
                <div
                  className="flex items-center justify-between p-5 sm:p-6 bg-white cursor-pointer select-none border-b border-[#F7F8F9]"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0" onClick={() => toggleCourseExpand(course.id)}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF4F4] text-[#1F7A7B] shrink-0 font-bold">
                      📚
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-full bg-[#EAF4F4] px-2.5 py-0.5 text-[10px] font-bold text-[#0F4E4F]">
                          {getGradeName(course)}
                        </span>
                        <span className="text-[10px] font-medium text-[#8A929B]">
                          ({course.modules.length} دروس)
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1C2126]">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-xs text-[#4A5158] mt-0.5 truncate">{course.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Edit Course Button (replaces duplicate "add lesson" button) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingCourse(course);
                      }}
                      className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#EAF4F4] py-2 px-3 text-xs font-bold text-[#1F7A7B] hover:bg-[#CFE6E6] transition-colors"
                      title="تعديل بيانات الدورة"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>تعديل الدورة</span>
                    </button>

                    {/* Delete Course Button — external icon visible next to edit */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                      className="flex items-center justify-center rounded-xl p-2 text-[#8A929B] hover:text-[#D9483D] hover:bg-[#D9483D]/10 transition-colors"
                      title="حذف الدورة"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Expand Chevron Icon — high contrast with balanced padding */}
                    <button
                      type="button"
                      onClick={() => toggleCourseExpand(course.id)}
                      className={`flex h-9 w-9 items-center justify-center p-2 rounded-xl transition-all ${
                        isCourseExpanded
                          ? "bg-[#1F7A7B] text-white shadow-md shadow-[#1F7A7B]/20 rotate-180"
                          : "bg-[#EAF4F4] text-[#1F7A7B] border border-[#CFE6E6] hover:bg-[#CFE6E6]"
                      }`}
                      title={isCourseExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Course Expanded Content (الدروس والموديولات) */}
                {isCourseExpanded && (
                  <div className="p-5 sm:p-6 bg-[#F7F8F9]/50 border-t border-[#EEF0F2] space-y-4">

                    {/* Top Action Bar — mobile edit/delete + add lesson */}
                    <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-3">
                      <h4 className="text-xs font-bold text-[#1C2126] flex items-center gap-1.5">
                        <span>قائمة الدروس (الوحدات) في هذه الدورة:</span>
                      </h4>

                      <div className="flex items-center gap-2">
                        {/* Mobile-only edit & delete buttons */}
                        <button
                          onClick={() => startEditingCourse(course)}
                          className="sm:hidden flex items-center gap-1 text-xs font-bold text-[#1F7A7B] hover:underline"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="sm:hidden flex items-center gap-1 text-xs font-bold text-[#D9483D] hover:underline"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          حذف
                        </button>

                        <button
                          onClick={() => setActiveModuleAddCourseId(course.id)}
                          className="flex items-center gap-1 text-xs font-bold text-[#1F7A7B] hover:underline"
                        >
                          <span>+ إضافة درس جديد</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Module Inline Form */}
                    {isAddingModule && (
                      <div className="flex items-center gap-2 rounded-2xl bg-white p-3 border border-[#1F7A7B] shadow-md animate-fadeIn">
                        <input
                          type="text"
                          placeholder="اكتب اسم الدرس الجديد (مثال: الدرس الأول: التفاضل والتكامل)"
                          value={newModuleTitles[course.id] || ""}
                          onChange={(e) =>
                            setNewModuleTitles((prev) => ({ ...prev, [course.id]: e.target.value }))
                          }
                          autoFocus
                          className="flex-1 rounded-xl border border-[#D3D7DC] px-3.5 py-2 text-xs font-medium text-[#1C2126] outline-none focus:border-[#1F7A7B]"
                        />
                        <button
                          onClick={() => handleAddModule(course.id)}
                          className="rounded-xl bg-[#1F7A7B] px-4 py-2 text-xs font-bold text-white hover:bg-[#166465]"
                        >
                          حفظ الدرس
                        </button>
                        <button
                          onClick={() => setActiveModuleAddCourseId(null)}
                          className="rounded-xl bg-[#EEF0F2] px-3 py-2 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC]"
                        >
                          إلغاء
                        </button>
                      </div>
                    )}

                    {/* Modules List (الدروس) */}
                    {course.modules.length === 0 ? (

                      /* Empty Modules State */
                      <div className="rounded-2xl border border-dashed border-[#D3D7DC] bg-white p-6 text-center">
                        <p className="text-xs font-bold text-[#8A929B]">لا توجد دروس مضافة في هذه الدورة حتى الآن</p>
                        <button
                          onClick={() => setActiveModuleAddCourseId(course.id)}
                          className="mt-3 text-xs font-bold text-[#1F7A7B] hover:underline"
                        >
                          + اضغط هنا لإضافة أول درس (وحدة)
                        </button>
                      </div>

                    ) : (
                      <div className="space-y-3">
                        {course.modules.map((moduleItem, modIdx) => {
                          const isModuleExpanded = expandedModuleIds.includes(moduleItem.id);
                          const isAddingLesson = activeLessonAddModuleId === moduleItem.id;
                          const currentLessonInput = newLessonData[moduleItem.id] || {
                            title: "",
                            videoUrl: "",
                            description: "",
                          };

                          return (
                            <div
                              key={moduleItem.id}
                              className="rounded-2xl border border-[#D3D7DC] bg-white overflow-hidden"
                            >

                              {/* Module Bar */}
                              <div
                                onClick={() => toggleModuleExpand(moduleItem.id)}
                                className="flex items-center justify-between p-4 bg-white cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#EAF4F4] text-xs font-bold text-[#1F7A7B] shrink-0">
                                    {modIdx + 1}
                                  </span>

                                  {editingModuleId === moduleItem.id ? (
                                    <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="text"
                                        autoFocus
                                        value={editingModuleTitle}
                                        onChange={(e) => setEditingModuleTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleUpdateModule(course.id, moduleItem.id);
                                          if (e.key === "Escape") setEditingModuleId(null);
                                        }}
                                        placeholder="اسم الدرس / الوحدة..."
                                        className="flex-1 rounded-xl border border-[#1F7A7B] bg-white px-3 py-1.5 text-xs sm:text-sm font-bold text-[#1C2126] outline-none"
                                      />
                                      <button
                                        type="button"
                                        disabled={isUpdatingModule || !editingModuleTitle.trim()}
                                        onClick={() => handleUpdateModule(course.id, moduleItem.id)}
                                        className="rounded-xl bg-[#1F7A7B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166465] disabled:opacity-50"
                                      >
                                        {isUpdatingModule ? "حفظ..." : "حفظ"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingModuleId(null)}
                                        className="rounded-xl bg-[#EEF0F2] px-2.5 py-1.5 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC]"
                                      >
                                        إلغاء
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h5 className="text-sm font-bold text-[#1C2126] truncate">
                                          {moduleItem.title}
                                        </h5>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingModule(moduleItem);
                                          }}
                                          className="text-[#8A929B] hover:text-[#1F7A7B] p-1 rounded-md transition-colors"
                                          title="تعديل اسم الدرس"
                                        >
                                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                        </button>
                                      </div>
                                      <span className="text-[10px] text-[#8A929B]">
                                        {moduleItem.lessons.length} حصص تعليمية
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isModuleExpanded) toggleModuleExpand(moduleItem.id);
                                      setActiveLessonAddModuleId(moduleItem.id);
                                    }}
                                    className="flex items-center gap-1 rounded-lg bg-[#FDF3E3] px-2.5 py-1 text-[11px] font-bold text-[#C88A22] hover:bg-[#F3C97C]/30"
                                  >
                                    <span>+ إضافة حصة</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteModule(course.id, moduleItem.id);
                                    }}
                                    className="p-1 text-[#8A929B] hover:text-[#D9483D]"
                                    title="حذف الدرس"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>

                                  <div className={`transform transition-transform text-[#1F7A7B] ${isModuleExpanded ? "rotate-180" : ""}`}>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              {/* Module Lessons Content */}
                              {isModuleExpanded && (
                                <div className="p-4 bg-[#F7F8F9] border-t border-[#EEF0F2] space-y-3">

                                  {/* Add Lesson Form */}
                                  {isAddingLesson && (
                                    <div className="space-y-3 rounded-xl bg-white p-3.5 border border-[#E8A83C] shadow-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#9C6B18]">إضافة حصة جديدة لهذا الدرس:</span>
                                      </div>

                                      <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 bg-[#F7F8F9] px-3 py-2 rounded-xl text-xs font-bold text-[#4A5158]">
                                          <span className="text-xl">🎥</span>
                                          فيديو تعليمي
                                        </div>
                                        <input
                                          type="text"
                                          placeholder="اسم الحصة (مثال: الحصة 1: حل التمارين)"
                                          value={currentLessonInput.title}
                                          onChange={(e) =>
                                            setNewLessonData((prev) => ({
                                              ...prev,
                                              [moduleItem.id]: { ...currentLessonInput, title: e.target.value },
                                            }))
                                          }
                                          autoFocus
                                          className="w-full rounded-xl border border-[#D3D7DC] px-3 py-2 text-xs outline-none focus:border-[#1F7A7B]"
                                        />

                                        <input
                                          type="url"
                                          placeholder="رابط الفيديو (مثال: https://youtube.com/...)"
                                          value={currentLessonInput.videoUrl}
                                          onChange={(e) =>
                                            setNewLessonData((prev) => ({
                                              ...prev,
                                              [moduleItem.id]: { ...currentLessonInput, videoUrl: e.target.value },
                                            }))
                                          }
                                          className="w-full rounded-xl border border-[#D3D7DC] px-3 py-2 text-xs outline-none focus:border-[#1F7A7B] text-left dir-ltr"
                                        />

                                        <textarea
                                          placeholder="وصف الحصة (اختياري)"
                                          value={currentLessonInput.description || ""}
                                          onChange={(e) =>
                                            setNewLessonData((prev) => ({
                                              ...prev,
                                              [moduleItem.id]: { ...currentLessonInput, description: e.target.value },
                                            }))
                                          }
                                          rows={2}
                                          className="w-full rounded-xl border border-[#D3D7DC] px-3 py-2 text-xs outline-none focus:border-[#1F7A7B]"
                                        />
                                      </div>

                                      <div className="flex justify-end gap-2 pt-1">
                                        <button
                                          onClick={() => handleAddLesson(course.id, moduleItem.id)}
                                          className="rounded-xl bg-[#E8A83C] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#C88A22]"
                                        >
                                          حفظ الحصة
                                        </button>
                                        <button
                                          onClick={() => setActiveLessonAddModuleId(null)}
                                          className="rounded-xl bg-[#EEF0F2] px-3 py-1.5 text-xs font-bold text-[#4A5158]"
                                        >
                                          إلغاء
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lessons List (الحصص) */}
                                  {moduleItem.lessons.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-[#D3D7DC] bg-white p-4 text-center text-xs">
                                      <span className="text-[#8A929B]">لا توجد حصص مضافة داخل هذا الدرس بعد. </span>
                                      <button
                                        onClick={() => setActiveLessonAddModuleId(moduleItem.id)}
                                        className="font-bold text-[#E8A83C] hover:underline"
                                      >
                                        + إضافة أول حصة
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {moduleItem.lessons.map((lesson, lsnIdx) => {
                                        const isEditing = editingLessonId === lesson.id;

                                        if (isEditing) {
                                          return (
                                            <div
                                              key={lesson.id}
                                              className="rounded-2xl bg-white p-4 border-2 border-[#1F7A7B] shadow-sm space-y-3"
                                            >
                                              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2">
                                                <span className="text-xs font-bold text-[#1F7A7B]">تعديل بيانات الحصة</span>
                                                <button
                                                  onClick={() => setEditingLessonId(null)}
                                                  className="text-[#8A929B] hover:text-[#1C2126]"
                                                >
                                                  ✕
                                                </button>
                                              </div>

                                              <div className="space-y-2.5">
                                                <div>
                                                  <label className="block text-[11px] font-bold text-[#1C2126] mb-1">اسم الحصة</label>
                                                  <input
                                                    type="text"
                                                    placeholder="اسم الحصة"
                                                    value={editingLessonData.title}
                                                    onChange={(e) =>
                                                      setEditingLessonData((prev) => ({ ...prev, title: e.target.value }))
                                                    }
                                                    className="w-full rounded-xl border border-[#D3D7DC] px-3.5 py-2 text-sm font-bold text-[#1C2126] outline-none focus:border-[#1F7A7B]"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-[11px] font-bold text-[#1C2126] mb-1">رابط الفيديو (اختياري)</label>
                                                  <input
                                                    type="url"
                                                    placeholder="https://youtube.com/..."
                                                    value={editingLessonData.videoUrl}
                                                    onChange={(e) =>
                                                      setEditingLessonData((prev) => ({ ...prev, videoUrl: e.target.value }))
                                                    }
                                                    className="w-full rounded-xl border border-[#D3D7DC] px-3.5 py-2 text-xs font-medium outline-none focus:border-[#1F7A7B] text-left dir-ltr"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-[11px] font-bold text-[#1C2126] mb-1">وصف الحصة (اختياري)</label>
                                                  <textarea
                                                    rows={2}
                                                    placeholder="وصف الحصة..."
                                                    value={editingLessonData.description}
                                                    onChange={(e) =>
                                                      setEditingLessonData((prev) => ({ ...prev, description: e.target.value }))
                                                    }
                                                    className="w-full rounded-xl border border-[#D3D7DC] px-3.5 py-2 text-xs font-medium outline-none focus:border-[#1F7A7B]"
                                                  />
                                                </div>
                                              </div>

                                              <div className="flex justify-end gap-2 pt-1">
                                                <button
                                                  onClick={() => handleUpdateLesson(moduleItem.id, lesson.id)}
                                                  className="rounded-xl bg-[#1F7A7B] px-4 py-2 text-xs font-bold text-white hover:bg-[#166465]"
                                                >
                                                  حفظ التعديلات
                                                </button>
                                                <button
                                                  onClick={() => setEditingLessonId(null)}
                                                  className="rounded-xl bg-[#EEF0F2] px-3.5 py-2 text-xs font-bold text-[#4A5158]"
                                                >
                                                  إلغاء
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <div
                                            key={lesson.id}
                                            className="rounded-2xl bg-white p-4 border border-[#EEF0F2] text-sm space-y-3 hover:border-[#CFE6E6] transition-all shadow-2xs"
                                          >
                                            {/* Top row: Number, Title (Bigger font), Badge, Edit & Delete Buttons */}
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex items-start gap-3">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#EEF0F2] text-xs font-bold text-[#4A5158] shrink-0 mt-0.5">
                                                  {lsnIdx + 1}
                                                </span>
                                                <div className="space-y-1">
                                                  <div className="flex flex-wrap items-center gap-2">
                                                    <h6 className="text-base sm:text-lg font-bold text-[#1C2126] leading-snug">
                                                      {lesson.title}
                                                    </h6>
                                                    <span className="rounded-lg bg-[#EAF4F4] px-2.5 py-0.5 text-xs font-bold text-[#1F7A7B]">
                                                      🎥 فيديو
                                                    </span>
                                                  </div>
                                                  {lesson.description && (
                                                    <p className="text-sm text-[#4A5158] leading-relaxed pt-1">
                                                      {lesson.description}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Action Buttons: Modify / Edit & Delete */}
                                              <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                  onClick={() => startEditingLesson(lesson)}
                                                  className="flex items-center gap-1 rounded-xl bg-[#EAF4F4] px-3 py-1.5 text-xs font-bold text-[#1F7A7B] hover:bg-[#CFE6E6] transition-colors"
                                                  title="تعديل بيانات الحصة"
                                                >
                                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                  </svg>
                                                  <span>تعديل</span>
                                                </button>

                                                <button
                                                  onClick={() => handleDeleteLesson(moduleItem.id, lesson.id)}
                                                  className="p-1.5 text-[#8A929B] hover:text-[#D9483D] rounded-xl hover:bg-[#F7F8F9] transition-colors"
                                                  title="حذف الحصة"
                                                >
                                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                  </svg>
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
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
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Course */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4">
              <h3 className="text-lg font-bold text-[#1C2126]">إضافة دورة تعليمية جديدة</h3>
              <button
                onClick={() => {
                  setIsCourseModalOpen(false);
                  setNewCourseGradeId("");
                }}
                className="text-[#8A929B] hover:text-[#1C2126]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1.5">
                  اسم الدورة / الكورس <span className="text-[#D9483D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دورة الرياضيات التطبيقية - الفصل الدراسي الأول"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              {/* Grade Selector (Two Step Cascading Dropdown) */}
              <GradeLevelSelector
                selectedGradeId={newCourseGradeId}
                onSelectGradeId={setNewCourseGradeId}
                teacherGrades={teacherGrades}
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1.5">وصف الدورة (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="اكتب وصفاً موجزاً لما تتضمنه هذه الدورة..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCourseModalOpen(false);
                    setNewCourseGradeId("");
                  }}
                  className="rounded-2xl bg-[#EEF0F2] py-3 px-5 text-sm font-bold text-[#4A5158] hover:bg-[#D3D7DC] transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingCourse || !newCourseTitle.trim() || !newCourseGradeId}
                  className="rounded-2xl bg-[#1F7A7B] py-3 px-6 text-sm font-bold text-white hover:bg-[#166465] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmittingCourse ? "جاري الإضافة..." : "حفظ الدورة"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Course */}
      {isEditCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4">
              <h3 className="text-lg font-bold text-[#1C2126]">تعديل بيانات الدورة التعليمية</h3>
              <button
                onClick={() => {
                  setIsEditCourseModalOpen(false);
                  setEditingCourseId(null);
                }}
                className="text-[#8A929B] hover:text-[#1C2126]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1.5">
                  اسم الدورة / الكورس <span className="text-[#D9483D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دورة الرياضيات التطبيقية"
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              {/* Grade Selector */}
              <GradeLevelSelector
                selectedGradeId={editCourseGradeId}
                onSelectGradeId={setEditCourseGradeId}
                teacherGrades={teacherGrades}
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1.5">وصف الدورة (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="اكتب وصفاً موجزاً لما تتضمنه هذه الدورة..."
                  value={editCourseDesc}
                  onChange={(e) => setEditCourseDesc(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditCourseModalOpen(false);
                    setEditingCourseId(null);
                  }}
                  className="rounded-2xl bg-[#EEF0F2] py-3 px-5 text-sm font-bold text-[#4A5158] hover:bg-[#D3D7DC] transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingCourse || !editCourseTitle.trim() || !editCourseGradeId}
                  className="rounded-2xl bg-[#1F7A7B] py-3 px-6 text-sm font-bold text-white hover:bg-[#166465] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUpdatingCourse ? "جاري التحديث..." : "حفظ التعديلات"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
