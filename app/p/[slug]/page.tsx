import { notFound } from "next/navigation";
import {
  getPublicPlatformBySlug,
  getPublicCourses,
} from "@/lib/queries/public-platform";
import { PLATFORM_THEMES } from "@/lib/themes";
import { StudentHomePage } from "@/components/student/StudentHomePage";
import { defaultTeachingYears } from "@/components/teacher/home-page-builder/constants";

interface PlatformHomePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlatformHomePage({
  params,
}: PlatformHomePageProps) {
  const { slug } = await params;
  const platformData = await getPublicPlatformBySlug(slug);

  if (!platformData) {
    notFound();
  }

  // Fetch teacher's live courses
  const courses = await getPublicCourses(platformData.platform.teacher_id);

  const currentTheme =
    PLATFORM_THEMES[platformData.themeId] || PLATFORM_THEMES["horizon"];

  // Use teacher configured grades or default secondary years
  const displayGrades =
    platformData.teacher?.grades && platformData.teacher.grades.length > 0
      ? platformData.teacher.grades
      : defaultTeachingYears;

  return (
    <StudentHomePage
      data={platformData.homePageData}
      teachingYears={displayGrades}
      courses={courses}
      theme={currentTheme}
      slug={slug}
    />
  );
}
