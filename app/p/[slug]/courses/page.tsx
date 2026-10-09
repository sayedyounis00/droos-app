import { notFound } from "next/navigation";
import {
  getPublicPlatformBySlug,
  getPublicCourses,
} from "@/lib/queries/public-platform";
import { PLATFORM_THEMES } from "@/lib/themes";
import { StudentCoursesPage } from "@/components/student/StudentCoursesPage";

interface CoursesPageRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CoursesPageRouteProps) {
  const { slug } = await params;
  const platformData = await getPublicPlatformBySlug(slug);

  if (!platformData) {
    return { title: "الكورسات | دروس" };
  }

  const teacherName = platformData.teacher?.name || platformData.platform.name;
  return {
    title: `جميع الكورسات والوحدات — ${teacherName}`,
    description: `تصفح كافة الكورسات والوحدات التعليمية المتاحة للأستاذ ${teacherName}`,
  };
}

export default async function CoursesPageRoute({
  params,
}: CoursesPageRouteProps) {
  const { slug } = await params;
  const platformData = await getPublicPlatformBySlug(slug);

  if (!platformData) {
    notFound();
  }

  const courses = await getPublicCourses(platformData.platform.teacher_id);
  const currentTheme =
    PLATFORM_THEMES[platformData.themeId] || PLATFORM_THEMES["horizon"];

  return (
    <StudentCoursesPage
      courses={courses}
      theme={currentTheme}
      slug={slug}
      headingConfig={platformData.homePageData.modulesPage}
    />
  );
}
