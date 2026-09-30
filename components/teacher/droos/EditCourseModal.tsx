import React, { useState, useEffect } from 'react';
import { CourseItem, EGYPTIAN_GRADE_LEVELS } from '@/lib/droos-data';
import GradeLevelSelector from '@/components/teacher/GradeLevelSelector';
import { Icon } from '@/components/ui/Icon';

interface EditCourseModalProps {
  course: CourseItem | null;
  onClose: () => void;
  onSubmit: (courseId: string, title: string, description: string, gradeId: string) => Promise<boolean>;
  teacherGrades?: string[];
}

export function EditCourseModal({
  course,
  onClose,
  onSubmit,
  teacherGrades,
}: EditCourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || '');
      const matchedGrade = EGYPTIAN_GRADE_LEVELS.find(
        (g) =>
          g.id === course.grade_level_id ||
          (course.grade_levels?.name_ar && g.name_ar === course.grade_levels.name_ar)
      );
      setGradeId(matchedGrade ? matchedGrade.id : course.grade_level_id);
    }
  }, [course]);

  if (!course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !gradeId) return;

    setIsUpdating(true);
    const success = await onSubmit(course.id, title, description, gradeId);
    setIsUpdating(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4">
          <h3 className="text-lg font-bold text-[#1C2126]">تعديل بيانات الدورة التعليمية</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#8A929B] hover:text-[#1C2126] hover:bg-[#F7F8F9] transition-colors" title="إغلاق">
            <Icon name="x" size={18} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-1.5">
              اسم الدورة / الكورس <span className="text-[#D9483D]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: دورة الرياضيات التطبيقية"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
            />
          </div>

          {/* Grade Selector */}
          <GradeLevelSelector
            selectedGradeId={gradeId}
            onSelectGradeId={setGradeId}
            teacherGrades={teacherGrades}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-1.5">
              وصف الدورة (اختياري)
            </label>
            <textarea
              rows={2}
              placeholder="اكتب وصفاً موجزاً لما تتضمنه هذه الدورة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium outline-none focus:border-[#1F7A7B]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-[#EEF0F2] py-3 px-5 text-sm font-bold text-[#4A5158] hover:bg-[#D3D7DC] transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isUpdating || !title.trim() || !gradeId}
              className="rounded-2xl bg-[#1F7A7B] py-3 px-6 text-sm font-bold text-white hover:bg-[#166465] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUpdating ? 'جاري التحديث...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
