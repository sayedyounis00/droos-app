import type { LessonDetailData } from "../types";
import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";

interface LessonOption {
  id: string;
  title: string;
  courseTitle?: string;
}

interface LessonDetailEditorProps {
  data: LessonDetailData;
  onChange: (updated: Partial<LessonDetailData>) => void;
  lessons: LessonOption[];
  activeLessonId?: string | null;
  onSelectLesson: (id: string) => void;
}

export function LessonDetailEditor({
  data,
  onChange,
  lessons,
  activeLessonId,
  onSelectLesson,
}: LessonDetailEditorProps) {
  return (
    <EditorCard title="صفحة مشاهدة الدرس ومشغل الفيديو" icon="tv">
      {/* Lesson Selector */}
      {lessons.length > 0 && (
        <div className="mb-5 bg-white p-4 rounded-2xl border border-[#EEF0F2] shadow-xs">
          <label className="block text-xs font-black text-[#1C2126] mb-2 flex items-center justify-between">
            <span>اختر درساً لمعاينته وتعديله من قاعدة البيانات:</span>
            <span className="text-[10px] text-[#1F7A7B] font-bold">
              ({lessons.length} درس متاح)
            </span>
          </label>
          <select
            value={activeLessonId || ""}
            onChange={(e) => onSelectLesson(e.target.value)}
            className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2.5 px-3 text-xs font-bold text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
          >
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.courseTitle ? `[${l.courseTitle}] ` : ""}
                {l.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <InputField
        label="عنوان الدرس المعروض"
        value={data.title}
        onChange={(v) => onChange({ title: v })}
        placeholder="الدرس الأول: ..."
      />
      <InputField
        label="اسم الكورس / الوحدة"
        value={data.moduleName}
        onChange={(v) => onChange({ moduleName: v })}
        placeholder="وحدة الجبر — الصف الثالث الثانوي"
      />
      <InputField
        label="وصف الدرس ومحتوى الشرح"
        value={data.description}
        onChange={(v) => onChange({ description: v })}
        placeholder="في هذا الدرس نستعرض المفاهيم الأساسية..."
        multiline
      />
      <InputField
        label="ملاحظة وتوجيهات المعلم للطلاب"
        value={data.teacherNote}
        onChange={(v) => onChange({ teacherNote: v })}
        placeholder="تأكد من مراجعة التمارين التطبيقية..."
        multiline
      />
      <InputField
        label="عنوان ملحق تمارين PDF"
        value={data.pdfTitle}
        onChange={(v) => onChange({ pdfTitle: v })}
        placeholder="ملخص الدرس والتمارين التطبيقية (PDF)"
      />
    </EditorCard>
  );
}
