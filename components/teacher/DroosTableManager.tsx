"use client";

import { useState, useEffect } from "react";
import GradeLevelFilterChips from "./GradeLevelFilterChips";
import GradeLevelSelector from "./GradeLevelSelector";
import { CourseItem, EGYPTIAN_GRADE_LEVELS } from "@/lib/droos-data";

export default function DroosTableManager() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Expanded State Trackers
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]);
  const  [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);

  // Create Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseGradeId, setNewCourseGradeId] = useState("grd-sec-3");
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  // New Module Input States { courseId: title }
  const [newModuleTitles, setNewModuleTitles] = useState<Record<string, string>>({});
  const [activeModuleAddCourseId, setActiveModuleAddCourseId] = useState<string | null>(null);

  // New Lesson Input States { moduleId: { title, contentType, videoUrl } }
  const [newLessonData, setNewLessonData] = useState<
    Record<string, { title: string; contentType: 'video' | 'pdf' | 'quiz' | 'text'; videoUrl: string }>
  >({});
  const [activeLessonAddModuleId, setActiveLessonAddModuleId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  const fetchCourses = async () => {
    setIsFetching(true);
    if (courses.length === 0) setIsLoading(true);
    try {
      const res = await fetch(`/api/teacher/courses?gradeLevelId=${selectedGradeId}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        // Automatically expand first course if present
        if (data.courses.length > 0 && expandedCourseIds.length === 0) {
          setExpandedCourseIds([data.courses[0].id]);
          if (data.courses[0].modules.length > 0) {
            setExpandedModuleIds([data.courses[0].modules[0].id]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGradeId]);

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
        setToastMessage("تمت إضافة الدورة التعليمية بنجاح");
        setIsCourseModalOpen(false);
        setNewCourseTitle("");
        setNewCourseDesc("");
        if (data.course) {
          setCourses(prev => [data.course, ...prev]);
          setExpandedCourseIds(prev => [...prev, data.course.id]);
        }
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الدورة");
    } finally {
      setIsSubmittingCourse(false);
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
        setToastMessage("تمت إضافة الدرس بنجاح");
        if (data.module) {
          setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
              return { ...course, modules: [...course.modules, data.module] };
            }
            return course;
          }));
          setExpandedModuleIds((prev) => [...prev, data.module.id]);
        }
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الدرس");
    }
  };

  // Delete Module Handler
  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الدرس وكافة الحصص التابعة له؟")) return;

    try {
      const res = await fetch(`/api/teacher/modules?courseId=${courseId}&moduleId=${moduleId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage("تم حذف الدرس بنجاح");
        setCourses(prev => prev.map(course => {
          if (course.id === courseId) {
            return { ...course, modules: course.modules.filter(m => m.id !== moduleId) };
          }
          return course;
        }));
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch {
      alert("حدث خطأ أثناء حذف الدرس");
    }
  };

  // Create Lesson Handler (+ إضافة حصة)
  const handleAddLesson = async (courseId: string, moduleId: string) => {
    const lessonInfo = newLessonData[moduleId] || { title: "", contentType: "video", videoUrl: "" };
    if (!lessonInfo.title.trim()) return;

    try {
      const res = await fetch("/api/teacher/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          module_id: moduleId,
          title: lessonInfo.title,
          content_type: lessonInfo.contentType,
          video_url: lessonInfo.videoUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewLessonData((prev) => ({
          ...prev,
          [moduleId]: { title: "", contentType: "video", videoUrl: "" },
        }));
        setActiveLessonAddModuleId(null);
        setToastMessage("تمت إضافة الحصة بنجاح");
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
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الحصة");
    }
  };

  // Delete Lesson Handler
  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذه الحصة؟")) return;

    try {
      const res = await fetch(`/api/teacher/lessons?moduleId=${moduleId}&lessonId=${lessonId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage("تم حذف الحصة بنجاح");
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
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch {
      alert("حدث خطأ أثناء حذف الحصة");
    }
  };

  const getGradeName = (course: CourseItem) => {
    if (course.grade_levels?.name_ar) return course.grade_levels.name_ar;
    const found = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === course.grade_level_id);
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
          selectedGradeId={selectedGradeId}
          onSelectGrade={setSelectedGradeId}
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
                  onClick={() => toggleCourseExpand(course.id)}
                  className="flex items-center justify-between p-5 sm:p-6 bg-white cursor-pointer select-none border-b border-[#F7F8F9]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF4F4] text-[#1F7A7B] shrink-0 font-bold">
                      📚
                    </div>
                    <div>
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
                        <p className="text-xs text-[#4A5158] mt-0.5">{course.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Add Module Quick Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCourseExpanded) toggleCourseExpand(course.id);
                        setActiveModuleAddCourseId(course.id);
                      }}
                      className="hidden sm:flex items-center gap-1 rounded-xl bg-[#EAF4F4] py-2 px-3 text-xs font-bold text-[#1F7A7B] hover:bg-[#CFE6E6]"
                    >
                      <span>+ إضافة درس</span>
                    </button>

                    {/* Expand Chevron Icon */}
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F8F9] text-[#4A5158] transition-transform ${isCourseExpanded ? "rotate-180 bg-[#1F7A7B] text-white" : ""}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Course Expanded Content (الدروس والموديولات) */}
                {isCourseExpanded && (
                  <div className="p-5 sm:p-6 bg-[#F7F8F9]/50 border-t border-[#EEF0F2] space-y-4">
                    
                    {/* Top Action Bar */}
                    <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-3">
                      <h4 className="text-xs font-bold text-[#1C2126] flex items-center gap-1.5">
                        <span>قائمة الدروس (الوحدات) في هذه الدورة:</span>
                      </h4>

                      <button
                        onClick={() => setActiveModuleAddCourseId(course.id)}
                        className="flex items-center gap-1 text-xs font-bold text-[#1F7A7B] hover:underline"
                      >
                        <span>+ إضافة درس جديد</span>
                      </button>
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
                            contentType: "video",
                            videoUrl: "",
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
                                <div className="flex items-center gap-3">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#EAF4F4] text-xs font-bold text-[#1F7A7B]">
                                    {modIdx + 1}
                                  </span>
                                  <div>
                                    <h5 className="text-sm font-bold text-[#1C2126]">
                                      {moduleItem.title}
                                    </h5>
                                    <span className="text-[10px] text-[#8A929B]">
                                      {moduleItem.lessons.length} حصص تعليمية
                                    </span>
                                  </div>
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

                                  <div className={`transform transition-transform text-[#8A929B] ${isModuleExpanded ? "rotate-180 text-[#1F7A7B]" : ""}`}>
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

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                                          className="col-span-2 rounded-xl border border-[#D3D7DC] px-3 py-2 text-xs outline-none focus:border-[#1F7A7B]"
                                        />

                                        <select
                                          value={currentLessonInput.contentType}
                                          onChange={(e) =>
                                            setNewLessonData((prev) => ({
                                              ...prev,
                                              [moduleItem.id]: {
                                                ...currentLessonInput,
                                                contentType: e.target.value as "video" | "pdf" | "quiz" | "text",
                                              },
                                            }))
                                          }
                                          className="rounded-xl border border-[#D3D7DC] px-2 py-2 text-xs outline-none focus:border-[#1F7A7B]"
                                        >
                                          <option value="video">🎥 فيديو تعليمي</option>
                                          <option value="pdf">📄 ملف PDF</option>
                                          <option value="quiz">📝 اختبار تفاعلي</option>
                                          <option value="text">📖 شرح كتابي</option>
                                        </select>
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
                                      {moduleItem.lessons.map((lesson, lsnIdx) => (
                                        <div
                                          key={lesson.id}
                                          className="flex items-center justify-between rounded-xl bg-white p-3 border border-[#EEF0F2] text-xs"
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EEF0F2] text-[10px] font-bold text-[#4A5158]">
                                              {lsnIdx + 1}
                                            </span>
                                            <span className="font-bold text-[#1C2126]">{lesson.title}</span>
                                            
                                            <span className="rounded-md bg-[#F7F8F9] px-2 py-0.5 text-[10px] font-medium text-[#1F7A7B]">
                                              {lesson.content_type === "video" && "🎥 فيديو"}
                                              {lesson.content_type === "pdf" && "📄 ملف PDF"}
                                              {lesson.content_type === "quiz" && "📝 اختبار"}
                                              {lesson.content_type === "text" && "📖 نص"}
                                            </span>
                                          </div>

                                          <button
                                            onClick={() => handleDeleteLesson(moduleItem.id, lesson.id)}
                                            className="text-[#8A929B] hover:text-[#D9483D]"
                                            title="حذف الحصة"
                                          >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
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
                onClick={() => setIsCourseModalOpen(false)}
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
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-2xl bg-[#EEF0F2] py-3 px-5 text-sm font-bold text-[#4A5158]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingCourse}
                  className="rounded-2xl bg-[#1F7A7B] py-3 px-6 text-sm font-bold text-white hover:bg-[#166465] disabled:opacity-50"
                >
                  {isSubmittingCourse ? "جاري الإضافة..." : "حفظ الدورة"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
