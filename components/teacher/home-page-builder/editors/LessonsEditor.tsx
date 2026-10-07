import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";
import { DbStatusBadge } from "./DbStatusBadge";

interface LessonsEditorProps {
  title: string;
  subtitle: string;
  onChangeTitle: (title: string) => void;
  onChangeSubtitle: (subtitle: string) => void;
  lessonsCount: number;
}

export function LessonsEditor({
  title,
  subtitle,
  onChangeTitle,
  onChangeSubtitle,
  lessonsCount,
}: LessonsEditorProps) {
  return (
    <EditorCard title="صفحة مكتبة الدروس والتمارين" icon="play">
      <DbStatusBadge
        countText={`تم جلب ${lessonsCount} درس وحصة تعليمية`}
      />

      <InputField
        label="عنوان مكتبة الدروس"
        value={title}
        onChange={onChangeTitle}
        placeholder="مكتبة الدروس والتمارين"
      />
      <InputField
        label="النص التوضيحي للدروس"
        value={subtitle}
        onChange={onChangeSubtitle}
        placeholder="تصفح وشاهد كل الدروس التفاعلية مع إمكانية مشاهدة الدروس التجريبية..."
        multiline
      />
    </EditorCard>
  );
}
