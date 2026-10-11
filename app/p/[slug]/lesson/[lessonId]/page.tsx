import { notFound } from "next/navigation";
import {
  getPublicPlatformBySlug,
  getPublicLesson,
} from "@/lib/queries/public-platform";
import { PLATFORM_THEMES } from "@/lib/themes";
import { StudentLessonPlayer } from "@/components/student/StudentLessonPlayer";

interface LessonPageRouteProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export async function generateMetadata({ params }: LessonPageRouteProps) {
  const { slug, lessonId } = await params;
  const platformData = await getPublicPlatformBySlug(slug);
  const lessonData = await getPublicLesson(lessonId);

  if (!platformData || !lessonData) {
    return { title: "الدرس غير موجود | دروس" };
  }

  const teacherName = platformData.teacher?.name || platformData.platform.name;
  return {
    title: `${lessonData.lesson.title} — ${teacherName}`,
    description: lessonData.lesson.description || `مشاهدة درس ${lessonData.lesson.title}`,
  };
}

export default async function LessonPageRoute({
  params,
}: LessonPageRouteProps) {
  const { slug, lessonId } = await params;
  const platformData = await getPublicPlatformBySlug(slug);

  if (!platformData) {
    notFound();
  }

  const lessonData = await getPublicLesson(lessonId);

  if (!lessonData) {
    notFound();
  }

  const currentTheme =
    PLATFORM_THEMES[platformData.themeId] || PLATFORM_THEMES["horizon"];

  // Module and course titles
  const moduleTitle = (lessonData.lesson as any).modules?.title;
  const courseTitle = (lessonData.lesson as any).modules?.courses?.title;

  return (
    <StudentLessonPlayer
      lesson={{
        id: lessonData.lesson.id,
        title: lessonData.lesson.title,
        content_type: lessonData.lesson.content_type || "video",
        video_url: lessonData.lesson.video_url,
        description: lessonData.lesson.description,
      }}
      playlist={(lessonData.playlist || []).map((l) => ({
        id: l.id,
        module_id: l.module_id,
        title: l.title,
        content_type: l.content_type || "video",
        video_url: l.video_url,
        sort_order: l.sort_order || 1,
      }))}
      courseTitle={courseTitle}
      moduleTitle={moduleTitle}
      theme={currentTheme}
      slug={slug}
      teacherNote={platformData.homePageData.lessonDetailPage?.teacherNote}
      pdfTitle={platformData.homePageData.lessonDetailPage?.pdfTitle}
    />
  );
}
