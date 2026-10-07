"use client";

import React, { useState } from "react";
import { CourseItem } from "@/lib/droos-data";
import { useDroosData } from "@/hooks/useDroosData";
import GradeLevelFilterChips from "@/components/teacher/GradeLevelFilterChips";
import { CourseAccordion } from "@/components/teacher/droos/CourseAccordion";
import { CreateCourseModal } from "@/components/teacher/droos/CreateCourseModal";
import { EditCourseModal } from "@/components/teacher/droos/EditCourseModal";
import { Toast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";

interface DroosTableManagerProps {
  teacherGrades?: string[];
}

export default function DroosTableManager({
  teacherGrades,
}: DroosTableManagerProps) {
  const {
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
  } = useDroosData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <Toast message={toast.message} type={toast.type} />

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
          onClick={() => setIsCreateModalOpen(true)}
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
          <Spinner size="lg" className="mx-auto text-[#1F7A7B]" />
          <p className="mt-3 text-xs font-bold text-[#8A929B]">جاري تحميل الدورات والدروس...</p>
        </div>
      ) : courses.length === 0 ? (
        /* Empty State */
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
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1F7A7B] py-3 px-6 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#1F7A7B]/20 hover:bg-[#166465]"
          >
            <span>+ إضافة أول دورة تعليمية</span>
          </button>
        </div>
      ) : (
        /* Courses List */
        <div className="relative space-y-4">
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-2xs z-10 rounded-3xl flex items-center justify-center">
              <Spinner size="md" className="text-[#1F7A7B]" />
            </div>
          )}

          {courses.map((course) => (
            <CourseAccordion
              key={course.id}
              course={course}
              isExpanded={expandedCourseIds.includes(course.id)}
              expandedModuleIds={expandedModuleIds}
              onToggleExpand={() => toggleCourseExpand(course.id)}
              onToggleModuleExpand={toggleModuleExpand}
              onEditCourse={(c) => setEditingCourse(c)}
              onDeleteCourse={deleteCourse}
              onAddModule={addModule}
              onDeleteModule={deleteModule}
              onUpdateModuleTitle={updateModuleTitle}
              onAddLesson={addLesson}
              onUpdateLesson={updateLesson}
              onDeleteLesson={deleteLesson}
            />
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createCourse}
        teacherGrades={teacherGrades}
      />

      {/* Edit Course Modal */}
      <EditCourseModal
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={updateCourse}
        teacherGrades={teacherGrades}
      />
    </div>
  );
}
