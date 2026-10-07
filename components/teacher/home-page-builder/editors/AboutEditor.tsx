import type { AboutSection } from "../types";
import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";

interface AboutEditorProps {
  data: AboutSection;
  onChange: (data: AboutSection) => void;
}

export function AboutEditor({ data, onChange }: AboutEditorProps) {
  return (
    <EditorCard title="نبذة عني (About)" icon="user">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="اسمك الكامل"
          value={data.name}
          onChange={(v) => onChange({ ...data, name: v })}
          placeholder="أحمد سعد"
        />
        <InputField
          label="المادة التخصصية"
          value={data.subject}
          onChange={(v) => onChange({ ...data, subject: v })}
          placeholder="الرياضيات"
        />
        <InputField
          label="سنوات الخبرة"
          value={data.experience}
          onChange={(v) => onChange({ ...data, experience: v })}
          placeholder="12 سنة خبرة"
        />
      </div>
      <InputField
        label="نبذتك الشخصية"
        value={data.bio}
        onChange={(v) => onChange({ ...data, bio: v })}
        multiline
        placeholder="اكتب نبذة مختصرة تظهر للطلاب..."
      />
    </EditorCard>
  );
}
