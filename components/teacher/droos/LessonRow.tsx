import React, { useState } from 'react';
import { LessonItem } from '@/lib/droos-data';
import { Icon } from '@/components/ui/Icon';

interface LessonRowProps {
  lesson: LessonItem;
  index: number;
  moduleId: string;
  onUpdate: (moduleId: string, lessonId: string, title: string, videoUrl?: string, description?: string) => Promise<void>;
  onDelete: (moduleId: string, lessonId: string) => Promise<void>;
}

export function LessonRow({
  lesson,
  index,
  moduleId,
  onUpdate,
  onDelete,
}: LessonRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson.video_url || '');
  const [editDescription, setEditDescription] = useState(lesson.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    await onUpdate(moduleId, lesson.id, editTitle, editVideoUrl, editDescription);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(lesson.title);
    setEditVideoUrl(lesson.video_url || '');
    setEditDescription(lesson.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl border-2 border-[#1F7A7B]/40 bg-white p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2">
          <span className="text-xs font-bold text-[#1F7A7B]">تعديل بيانات الحصة</span>
          <span className="text-xs font-medium text-[#8A929B]">حصة رقم {index + 1}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-1">اسم / عنوان الحصة</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2.5 px-3.5 text-sm font-medium outline-none focus:border-[#1F7A7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-1">رابط الفيديو (YouTube أو Drive)</label>
            <input
              type="url"
              value={editVideoUrl}
              onChange={(e) => setEditVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2.5 px-3.5 text-sm font-medium outline-none focus:border-[#1F7A7B] dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-1">وصف الحصة أو ملاحظات للطلاب</label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2.5 px-3.5 text-sm font-medium outline-none focus:border-[#1F7A7B]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl bg-[#EEF0F2] px-3.5 py-2 text-xs font-bold text-[#4A5158] hover:bg-[#D3D7DC] transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !editTitle.trim()}
            className="rounded-xl bg-[#1F7A7B] px-4 py-2 text-xs font-bold text-white hover:bg-[#166465] disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديل'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 border border-[#EEF0F2] text-sm space-y-3 hover:border-[#CFE6E6] transition-all shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#EEF0F2] text-xs font-bold text-[#4A5158] shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h6 className="text-base sm:text-lg font-bold text-[#1C2126] leading-snug">
                {lesson.title}
              </h6>
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#EAF4F4] px-2.5 py-0.5 text-xs font-bold text-[#1F7A7B] border border-[#CFE6E6]">
                <Icon name="video" size={13} strokeWidth={1.8} />
                <span>فيديو</span>
              </span>
            </div>
            {lesson.description && (
              <p className="text-sm text-[#4A5158] leading-relaxed pt-1">
                {lesson.description}
              </p>
            )}
            {lesson.video_url && (
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F7A7B] hover:underline pt-1 dir-ltr"
              >
                <Icon name="link" size={12} strokeWidth={1.8} />
                <span>{lesson.video_url}</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 rounded-xl bg-[#EAF4F4] px-3 py-1.5 text-xs font-bold text-[#1F7A7B] hover:bg-[#CFE6E6] transition-colors"
            title="تعديل بيانات الحصة"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>تعديل</span>
          </button>

          <button
            onClick={() => onDelete(moduleId, lesson.id)}
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
}
