import React, { useState } from 'react';
import { ModuleItem } from '@/lib/droos-data';
import { LessonRow } from './LessonRow';

interface ModuleAccordionProps {
  moduleItem: ModuleItem;
  courseId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateTitle: (courseId: string, moduleId: string, newTitle: string) => Promise<void>;
  onDeleteModule: (courseId: string, moduleId: string) => Promise<void>;
  onAddLesson: (courseId: string, moduleId: string, title: string, videoUrl?: string, description?: string) => Promise<void>;
  onUpdateLesson: (moduleId: string, lessonId: string, title: string, videoUrl?: string, description?: string) => Promise<void>;
  onDeleteLesson: (moduleId: string, lessonId: string) => Promise<void>;
}

export function ModuleAccordion({
  moduleItem,
  courseId,
  isExpanded,
  onToggleExpand,
  onUpdateTitle,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
}: ModuleAccordionProps) {
  // Inline edit state for module title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(moduleItem.title);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  // Inline add lesson state
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  const handleSaveTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsUpdatingTitle(true);
    await onUpdateTitle(courseId, moduleItem.id, editTitle);
    setIsUpdatingTitle(false);
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditTitle(moduleItem.title);
    setIsEditingTitle(false);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    setIsSubmittingLesson(true);
    await onAddLesson(courseId, moduleItem.id, newLessonTitle, newLessonVideoUrl, newLessonDesc);
    setIsSubmittingLesson(false);
    setNewLessonTitle('');
    setNewLessonVideoUrl('');
    setNewLessonDesc('');
    setIsAddingLesson(false);
  };

  const lessons = moduleItem.lessons || [];

  return (
    <div className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9]/60 overflow-hidden transition-all">
      {/* Module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F7F8F9] hover:bg-[#EEF0F2]/50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Toggle Expand Arrow */}
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#4A5158] hover:text-[#1F7A7B] shadow-2xs transition-colors"
            title={isExpanded ? 'طي الدرس' : 'عرض حصص الدرس'}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : 'rotate-180'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Module Title or Edit Form */}
          {isEditingTitle ? (
            <form onSubmit={handleSaveTitle} className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="rounded-xl border border-[#1F7A7B] bg-white py-1.5 px-3 text-sm font-bold text-[#1C2126] outline-none"
              />
              <button
                type="submit"
                disabled={isUpdatingTitle || !editTitle.trim()}
                className="rounded-xl bg-[#1F7A7B] py-1.5 px-3 text-xs font-bold text-white hover:bg-[#166465] disabled:opacity-50"
              >
                {isUpdatingTitle ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={handleCancelEditTitle}
                className="rounded-xl bg-[#EEF0F2] py-1.5 px-3 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC]"
              >
                إلغاء
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EAF4F4] text-xs font-black text-[#1F7A7B]">
                📚
              </span>
              <span
                onClick={onToggleExpand}
                className="text-sm font-bold text-[#1C2126] cursor-pointer hover:text-[#1F7A7B] transition-colors"
              >
                {moduleItem.title}
              </span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-[#8A929B] border border-[#EEF0F2]">
                {lessons.length} {lessons.length === 1 ? 'حصة' : 'حصص'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isEditingTitle && (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="p-1.5 text-[#8A929B] hover:text-[#1F7A7B] rounded-lg hover:bg-white transition-colors"
              title="تعديل اسم الدرس"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          <button
            onClick={() => {
              setIsAddingLesson(!isAddingLesson);
              if (!isExpanded) onToggleExpand();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-white border border-[#EEF0F2] py-1.5 px-3 text-xs font-bold text-[#1F7A7B] hover:bg-[#EAF4F4] transition-colors shadow-2xs"
          >
            <span>+ إضافة حصة</span>
          </button>

          <button
            onClick={() => onDeleteModule(courseId, moduleItem.id)}
            className="p-1.5 text-[#8A929B] hover:text-[#D9483D] rounded-lg hover:bg-white transition-colors"
            title="حذف الدرس"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Lesson Section */}
      {isExpanded && (
        <div className="p-4 space-y-3 border-t border-[#EEF0F2] bg-white/40">
          {/* Add Lesson Inline Form */}
          {isAddingLesson && (
            <form onSubmit={handleSaveLesson} className="rounded-2xl border-2 border-[#1F7A7B]/30 bg-white p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2">
                <span className="text-xs font-bold text-[#1F7A7B]">إضافة حصة جديدة لهذا الدرس</span>
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(false)}
                  className="text-xs text-[#8A929B] hover:text-[#1C2126]"
                >
                  ✕ إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#1C2126] mb-1">
                    عنوان الحصة <span className="text-[#D9483D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شرح نظرية ذات الحدين - الجزء الأول"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2 px-3 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C2126] mb-1">
                    رابط الفيديو (YouTube أو Google Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newLessonVideoUrl}
                    onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                    className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2 px-3 text-sm font-medium outline-none focus:border-[#1F7A7B] dir-ltr text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C2126] mb-1">
                  ملاحظات أو وصف الحصة (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="اكتب ملاحظات موجزة للطلاب عن هذه الحصة..."
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                  className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2 px-3 text-sm font-medium outline-none focus:border-[#1F7A7B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(false)}
                  className="rounded-xl bg-[#EEF0F2] px-3.5 py-2 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLesson || !newLessonTitle.trim()}
                  className="rounded-xl bg-[#1F7A7B] px-4 py-2 text-xs font-bold text-white hover:bg-[#166465] disabled:opacity-50"
                >
                  {isSubmittingLesson ? 'جاري الإضافة...' : 'حفظ الحصة'}
                </button>
              </div>
            </form>
          )}

          {/* Lessons List */}
          {lessons.length === 0 && !isAddingLesson ? (
            <div className="rounded-xl border border-dashed border-[#D3D7DC] p-6 text-center text-xs text-[#8A929B]">
              <p>لا توجد حصص في هذا الدرس بعد.</p>
              <button
                onClick={() => setIsAddingLesson(true)}
                className="mt-2 text-xs font-bold text-[#1F7A7B] hover:underline"
              >
                + أضف الحصة الأولى الآن
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lessons.map((lesson, lsnIdx) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  index={lsnIdx}
                  moduleId={moduleItem.id}
                  onUpdate={onUpdateLesson}
                  onDelete={onDeleteLesson}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
