import type { HeroSection } from "../types";
import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";

interface HeroEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  return (
    <EditorCard title="القسم الرئيسي (Hero)" icon="home">
      <InputField
        label="الشارة التعريفية (Badge)"
        value={data.badge}
        onChange={(v) => onChange({ ...data, badge: v })}
        placeholder="نتائج مضمونة..."
      />
      <InputField
        label="العنوان الرئيسي"
        value={data.headline}
        onChange={(v) => onChange({ ...data, headline: v })}
        placeholder="تعلّم بطريقة مختلفة..."
      />
      <InputField
        label="النص التوضيحي"
        value={data.subheadline}
        onChange={(v) => onChange({ ...data, subheadline: v })}
        placeholder="وصف مختصر..."
        multiline
      />
      <InputField
        label="نص زر التسجيل"
        value={data.ctaText}
        onChange={(v) => onChange({ ...data, ctaText: v })}
        placeholder="سجّل الآن"
      />
    </EditorCard>
  );
}
