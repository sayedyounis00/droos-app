import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { EGYPTIAN_GRADE_LEVELS } from "@/lib/droos-data";
import type { TestimonialsSection } from "../types";
import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";

interface TestimonialsEditorProps {
  data: TestimonialsSection;
  teacherGrades?: string[];
  onChange: (data: TestimonialsSection) => void;
}

export function TestimonialsEditor({
  data,
  teacherGrades = [],
  onChange,
}: TestimonialsEditorProps) {
  // Available grade options: prioritize teacher's assigned grades, fallback to Egyptian grade levels
  const availableGradeOptions = useMemo(() => {
    if (teacherGrades && teacherGrades.length > 0) {
      return teacherGrades;
    }
    return EGYPTIAN_GRADE_LEVELS.map((g) => g.name_ar);
  }, [teacherGrades]);

  const updateTestimonial = (index: number, field: string, value: string) => {
    const updated = data.testimonials.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    onChange({ ...data, testimonials: updated });
  };

  const addTestimonial = () => {
    onChange({
      ...data,
      testimonials: [
        ...data.testimonials,
        {
          name: "طالب جديد",
          grade: availableGradeOptions[0] ?? "الصف الثالث الثانوي",
          text: "اكتب رأي الطالب هنا...",
        },
      ],
    });
  };

  const removeTestimonial = (index: number) => {
    if (data.testimonials.length <= 1) return;
    onChange({
      ...data,
      testimonials: data.testimonials.filter((_, i) => i !== index),
    });
  };

  return (
    <EditorCard title="آراء الطلاب (التقييمات)" icon="message-square">
      <InputField
        label="عنوان قسم آراء الطلاب"
        value={data.title}
        onChange={(v) => onChange({ ...data, title: v })}
        placeholder="ماذا يقول الطلاب؟"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#1C2126]">
            قائمة تقييمات الطلاب:
          </label>
          <span className="text-[11px] font-bold text-[#1F7A7B] bg-[#EAF4F4] px-2.5 py-0.5 rounded-full">
            {data.testimonials.length} تقييمات
          </span>
        </div>

        {data.testimonials.map((t, idx) => {
          // Ensure current grade is always visible in the options even if not in list
          const currentOptions =
            t.grade && !availableGradeOptions.includes(t.grade)
              ? [t.grade, ...availableGradeOptions]
              : availableGradeOptions;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-4 sm:p-5 space-y-3.5 shadow-2xs hover:border-[#CFE6E6] transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-[#EEF0F2] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F7A7B] text-[11px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-[#1C2126]">
                    رأي الطالب {idx + 1}
                  </span>
                </div>
                {data.testimonials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTestimonial(idx)}
                    className="text-xs text-[#D9483D] hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 font-bold"
                    title="حذف هذا الرأي"
                  >
                    <Icon name="trash" size={13} strokeWidth={1.8} />
                    <span>حذف</span>
                  </button>
                )}
              </div>

              {/* Form fields in clean vertical stack to ensure ample space for inputs */}
              <div className="space-y-3">
                <InputField
                  label="اسم الطالب"
                  value={t.name}
                  onChange={(v) => updateTestimonial(idx, "name", v)}
                  placeholder="مثال: أحمد محمد"
                />

                {/* Grade Selection Dropdown with full width */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#1C2126]">
                      الصف الدراسي للطالب
                    </label>
                    <span className="text-[10px] font-medium text-[#1F7A7B]">
                      اختر من صفوفك الدراسية
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={t.grade}
                      onChange={(e) => updateTestimonial(idx, "grade", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#D3D7DC] bg-white py-3.5 px-3 pl-8 text-sm font-medium text-[#1C2126] outline-none focus:border-[#1F7A7B] focus:ring-2 focus:ring-[#1F7A7B]/20 transition-all cursor-pointer shadow-2xs"
                    >
                      {currentOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-[#1F7A7B]">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <InputField
                  label="نص التقييم أو شهادة الطالب"
                  value={t.text}
                  onChange={(v) => updateTestimonial(idx, "text", v)}
                  multiline
                  placeholder="اكتب شهادة الطالب أو رأيه في أسلوب الشرح والمتابعة..."
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addTestimonial}
        className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#CFE6E6] bg-[#EAF4F4]/50 py-3 px-4 text-xs font-bold text-[#1F7A7B] hover:bg-[#EAF4F4] hover:border-[#1F7A7B] transition-all cursor-pointer"
      >
        <Icon name="plus" size={14} strokeWidth={2} />
        <span>+ إضافة رأي طالب جديد</span>
      </button>
    </EditorCard>
  );
}
