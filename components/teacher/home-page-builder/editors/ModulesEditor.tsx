import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";
import { DbStatusBadge } from "./DbStatusBadge";

interface ModulesEditorProps {
  title: string;
  subtitle: string;
  onChangeTitle: (title: string) => void;
  onChangeSubtitle: (subtitle: string) => void;
  coursesCount: number;
  modulesCount: number;
}

export function ModulesEditor({
  title,
  subtitle,
  onChangeTitle,
  onChangeSubtitle,
  coursesCount,
  modulesCount,
}: ModulesEditorProps) {
  return (
    <EditorCard title="صفحة الكورسات والوحدات الدراسية" icon="book-open">
      <DbStatusBadge
        countText={`تم جلب ${coursesCount} كورس و ${modulesCount} وحدة دراسية`}
      />

      <InputField
        label="عنوان الصفحة الرئيسي"
        value={title}
        onChange={onChangeTitle}
        placeholder="الوحدات والكورسات الدراسية"
      />
      <InputField
        label="النص التوضيحي والفرعي"
        value={subtitle}
        onChange={onChangeSubtitle}
        placeholder="استكشف الكورسات الشاملة والوحدات التعليمية المتاحة للتسجيل..."
        multiline
      />
    </EditorCard>
  );
}
