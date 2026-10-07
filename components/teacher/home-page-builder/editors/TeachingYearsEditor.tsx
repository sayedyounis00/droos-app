import { Icon } from "@/components/ui/Icon";
import { EditorCard } from "./EditorCard";

interface TeachingYearsEditorProps {
  grades: string[];
}

export function TeachingYearsEditor({ grades }: TeachingYearsEditorProps) {
  return (
    <EditorCard title="السنوات والصفوف الدراسية (قسم ثابت)" icon="graduation-cap">
      <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/60 p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-2.5 text-[#0F4E4F] font-bold text-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#1F7A7B] shrink-0 shadow-2xs mt-0.5">
            <Icon name="lock" size={13} strokeWidth={2} />
          </div>
          <div>
            <span className="block font-black text-sm text-[#0F4E4F]">
              هذا القسم ثابت ومربوط ببيانات الحساب
            </span>
            <p className="text-xs text-[#4A5158] leading-relaxed mt-0.5">
              يتم عرض الصفوف الدراسية الخاصة بك تلقائياً من بيانات الحساب في لوحة التحكم، وتظهر في صفحتك الرئيسية كأقسام مخصصة لطلابك.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#CFE6E6]/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#1C2126]">
              الصفوف والمراحل المفعّلة حالياً:
            </span>
            <span className="text-[11px] font-bold text-[#1F7A7B] bg-white px-2.5 py-0.5 rounded-full border border-[#CFE6E6]">
              {grades.length} صفوف دراسية
            </span>
          </div>

          {grades.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-2xl border border-dashed border-[#D3D7DC] bg-white">
              <Icon
                name="graduation-cap"
                size={24}
                className="mx-auto text-[#8A929B] mb-2"
                strokeWidth={1.5}
              />
              <p className="text-xs font-bold text-[#4A5158]">
                لم يتم تحديد صفوف دراسية بعد
              </p>
              <p className="text-[11px] text-[#8A929B] mt-1">
                يمكنك تحديد الصفوف التي تدرّسها من تبويب &quot;بيانات الحساب&quot; في لوحة التحكم.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grades.map((grade, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-[#7EB8B9]/60 p-3.5 sm:p-4 shadow-2xs hover:border-[#1F7A7B] hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4F4] text-[#1F7A7B]">
                      <Icon
                        name="graduation-cap"
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-black text-[#1C2126] leading-snug">
                        {grade}
                      </span>
                      <span className="inline-block text-[10px] font-bold text-[#2E9E5B] bg-[#2E9E5B]/10 px-2 py-0.5 rounded-md mt-0.5">
                        متاح للتسجيل والاشتراك
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF4F4] text-[#1F7A7B]" title="مفعّل">
                    <Icon name="check" size={13} strokeWidth={2.5} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EditorCard>
  );
}
