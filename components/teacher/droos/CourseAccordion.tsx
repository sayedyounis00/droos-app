import React, { useState } from 'react';
import { CourseItem } from '@/lib/droos-data';
import { ModuleAccordion } from './ModuleAccordion';

interface CourseAccordionProps {
  course: CourseItem;
  isExpanded: boolean;
  expandedModuleIds: string[];
  onToggleExpand: () => void;
  onToggleModuleExpand: (moduleId: string) => void;
  onEditCourse: (course: CourseItem) => void;
  onDeleteCourse: (courseId: string) => Promise<void>;
  onAddModule: (courseId: string, title: string) => Promise<void>;
  onDeleteModule: (courseId: string, moduleId: string) => Promise<void>;
  onUpdateModuleTitle: (courseId: string, moduleId: string, title: string) => Promise<void>;
  onAddLesson: (courseId: string, moduleId: string, title: string, videoUrl?: string, description?: string) => Promise<void>;
  onUpdateLesson: (moduleId: string, lessonId: string, title: string, videoUrl?: string, description?: string) => Promise<void>;
  onDeleteLesson: (moduleId: string, lessonId: string) => Promise<void>;
}

export function CourseAccordion({
  course,
  isExpanded,
  expandedModuleIds,
  onToggleExpand,
  onToggleModuleExpand,
  onEditCourse,
  onDeleteCourse,
  onAddModule,
  onDeleteModule,
  onUpdateModuleTitle,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
}: CourseAccordionProps) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    setIsSubmittingModule(true);
    await onAddModule(course.id, newModuleTitle);
    setIsSubmittingModule(false);
    setNewModuleTitle('');
    setIsAddingModule(false);
  };

  const modules = course.modules || [];
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div className="rounded-3xl border border-[#EEF0F2] bg-white shadow-xs overflow-hidden transition-all">
      {/* Course Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b border-[#EEF0F2] bg-white">
        <div className="flex items-center gap-3.5">
          {/* Toggle Expand Arrow */}
          <button
            onClick={onToggleExpand}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F8F9] text-[#4A5158] hover:text-[#1F7A7B] hover:bg-[#EAF4F4] transition-colors"
            title={isExpanded ? 'طي الدورة' : 'عرض محتوى الدورة'}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : 'rotate-180'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h4
                onClick={onToggleExpand}
                className="text-base sm:text-lg font-bold text-[#1C2126] cursor-pointer hover:text-[#1F7A7B] transition-colors"
              >
                {course.title}
              </h4>

              {/* Grade Level Badge */}
              {course.grade_levels?.name_ar && (
                <span className="rounded-full bg-[#EAF4F4] border border-[#CFE6E6] px-3 py-0.5 text-xs font-bold text-[#0F4E4F]">
                  {course.grade_levels.name_ar}
                </span>
              )}
            </div>

            {course.description && (
              <p className="text-xs text-[#8A929B] max-w-xl">{course.description}</p>
            )}
          </div>
        </div>

        {/* Course Statistics & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#8A929B] me-2">
            <span>{modules.length} دروس</span>
            <span>•</span>
            <span>{totalLessons} حصص</span>
          </div>

          <button
            onClick={() => {
              setIsAddingModule(!isAddingModule);
              if (!isExpanded) onToggleExpand();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#1F7A7B] py-2 px-3.5 text-xs font-bold text-white hover:bg-[#166465] transition-colors shadow-sm shadow-[#1F7A7B]/20"
          >
            <span>+ إضافة درس</span>
          </button>

          <button
            onClick={() => onEditCourse(course)}
            className="p-2 text-[#4A5158] hover:text-[#1F7A7B] rounded-xl hover:bg-[#F7F8F9] transition-colors"
            title="تعديل بيانات الدورة"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDeleteCourse(course.id)}
            className="p-2 text-[#8A929B] hover:text-[#D9483D] rounded-xl hover:bg-[#D9483D]/5 transition-colors"
            title="حذف الدورة"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Course Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-4 bg-[#F7F8F9]/30">
          {/* Add Module Inline Form */}
          {isAddingModule && (
            <form onSubmit={handleSaveModule} className="rounded-2xl border-2 border-[#1F7A7B]/40 bg-white p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2">
                <span className="text-xs font-bold text-[#1F7A7B]">إضافة درس جديد للدورة</span>
                <button
                  type="button"
                  onClick={() => setIsAddingModule(false)}
                  className="text-xs text-[#8A929B] hover:text-[#1C2126]"
                >
                  ✕ إلغاء
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1">
                  اسم أو عنوان الدرس <span className="text-[#D9483D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الدرس الأول: مبدأ العد والتباديل"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2 px-3.5 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingModule(false)}
                  className="rounded-xl bg-[#EEF0F2] px-3.5 py-2 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingModule || !newModuleTitle.trim()}
                  className="rounded-xl bg-[#1F7A7B] px-4 py-2 text-xs font-bold text-white hover:bg-[#166465] disabled:opacity-50"
                >
                  {isSubmittingModule ? 'جاري الإضافة...' : 'حفظ الدرس'}
                </button>
              </div>
            </form>
          )}

          {/* Modules List */}
          {modules.length === 0 && !isAddingModule ? (
            <div className="rounded-2xl border border-dashed border-[#D3D7DC] p-8 text-center text-sm text-[#8A929B] bg-white">
              <p>لا توجد دروس مضافة في هذه الدورة بعد.</p>
              <button
                onClick={() => setIsAddingModule(true)}
                className="mt-2 text-xs font-bold text-[#1F7A7B] hover:underline"
              >
                + أضف أول درس الآن
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((moduleItem) => (
                <ModuleAccordion
                  key={moduleItem.id}
                  moduleItem={moduleItem}
                  courseId={course.id}
                  isExpanded={expandedModuleIds.includes(moduleItem.id)}
                  onToggleExpand={() => onToggleModuleExpand(moduleItem.id)}
                  onUpdateTitle={onUpdateModuleTitle}
                  onDeleteModule={onDeleteModule}
                  onAddLesson={onAddLesson}
                  onUpdateLesson={onUpdateLesson}
                  onDeleteLesson={onDeleteLesson}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
