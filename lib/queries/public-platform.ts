import { supabase } from "@/lib/supabase";
import { COURSE_SELECT_QUERY } from "./droos-queries";
import type { CourseItem } from "@/lib/droos-data";
import type { ThemeId } from "@/lib/themes";
import type { HomePageData } from "@/components/teacher/home-page-builder/types";
import { defaultData } from "@/components/teacher/home-page-builder/constants";

export interface PublicTeacherInfo {
  id: string;
  name: string;
  subject: string | null;
  grades: string[] | null;
  governorate: string | null;
  bio: string | null;
  phone: string | null;
  subdomain: string | null;
}

export interface PublicPlatformData {
  platform: {
    id: string;
    teacher_id: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    logo_url: string | null;
  };
  teacher: PublicTeacherInfo | null;
  themeId: ThemeId;
  homePageData: HomePageData;
}

/**
 * Fetch published platform data by subdomain/slug
 */
export async function getPublicPlatformBySlug(
  slug: string
): Promise<PublicPlatformData | null> {
  if (!slug) return null;
  const normalizedSlug = slug.trim().toLowerCase();

  try {
    const { data: platform, error } = await supabase
      .from("platforms")
      .select("id, teacher_id, name, slug, description, theme, status, logo_url")
      .eq("slug", normalizedSlug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !platform) {
      if (error) console.error("Error fetching platform by slug:", error);
      return null;
    }

    // Fetch teacher details
    const { data: teacherRow } = await supabase
      .from("teachers")
      .select("id, name, subject, grades, governorate, bio, phone, subdomain")
      .eq("id", platform.teacher_id)
      .maybeSingle();

    const themeConfig = (platform.theme as Record<string, unknown>) || {};
    const themeId = (themeConfig.themeId as ThemeId) || "horizon";
    const rawHomePageData = (themeConfig.homePageData as Partial<HomePageData>) || {};

    // Parse teacher grades safely
    let parsedGrades: string[] = [];
    if (Array.isArray(teacherRow?.grades)) {
      parsedGrades = teacherRow.grades;
    } else if (typeof teacherRow?.grades === "string") {
      try {
        const parsed = JSON.parse(teacherRow.grades);
        parsedGrades = Array.isArray(parsed) ? parsed : [teacherRow.grades];
      } catch {
        parsedGrades = [teacherRow.grades];
      }
    }

    const teacherInfo: PublicTeacherInfo | null = teacherRow
      ? {
          id: teacherRow.id,
          name: teacherRow.name,
          subject: teacherRow.subject,
          grades: parsedGrades,
          governorate: teacherRow.governorate,
          bio: teacherRow.bio,
          phone: teacherRow.phone,
          subdomain: teacherRow.subdomain,
        }
      : null;

    // Merge default data with stored teacher customization
    const homePageData: HomePageData = {
      hero: {
        headline: rawHomePageData.hero?.headline || defaultData.hero.headline,
        subheadline:
          rawHomePageData.hero?.subheadline ||
          teacherInfo?.bio ||
          defaultData.hero.subheadline,
        ctaText: rawHomePageData.hero?.ctaText || defaultData.hero.ctaText,
        badge: rawHomePageData.hero?.badge || defaultData.hero.badge,
      },
      about: {
        name:
          rawHomePageData.about?.name ||
          teacherInfo?.name ||
          defaultData.about.name,
        subject:
          rawHomePageData.about?.subject ||
          teacherInfo?.subject ||
          defaultData.about.subject,
        experience:
          rawHomePageData.about?.experience || defaultData.about.experience,
        bio:
          rawHomePageData.about?.bio ||
          teacherInfo?.bio ||
          defaultData.about.bio,
      },
      testimonials: {
        title:
          rawHomePageData.testimonials?.title || defaultData.testimonials.title,
        testimonials:
          rawHomePageData.testimonials?.testimonials?.length
            ? rawHomePageData.testimonials.testimonials
            : defaultData.testimonials.testimonials,
      },
      contact: {
        title: rawHomePageData.contact?.title || defaultData.contact.title,
        phone:
          rawHomePageData.contact?.phone ||
          teacherInfo?.phone ||
          defaultData.contact.phone,
        whatsapp:
          rawHomePageData.contact?.whatsapp ||
          teacherInfo?.phone ||
          defaultData.contact.whatsapp,
        note: rawHomePageData.contact?.note || defaultData.contact.note,
        socials: rawHomePageData.contact?.socials || [],
      },
      modulesPage: rawHomePageData.modulesPage,
      lessonsPage: rawHomePageData.lessonsPage,
      lessonDetailPage: rawHomePageData.lessonDetailPage,
    };

    return {
      platform: {
        id: platform.id,
        teacher_id: platform.teacher_id,
        name: platform.name,
        slug: platform.slug,
        description: platform.description,
        status: platform.status,
        logo_url: platform.logo_url,
      },
      teacher: teacherInfo,
      themeId,
      homePageData,
    };
  } catch (err) {
    console.error("Exception in getPublicPlatformBySlug:", err);
    return null;
  }
}

/**
 * Fetch all published courses for a teacher by teacher ID
 */
export async function getPublicCourses(teacherId: string): Promise<CourseItem[]> {
  if (!teacherId) return [];

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(COURSE_SELECT_QUERY)
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("Error fetching public courses:", error);
      return [];
    }

    return data as unknown as CourseItem[];
  } catch (err) {
    console.error("Exception in getPublicCourses:", err);
    return [];
  }
}

/**
 * Fetch a single public lesson with its parent module, course, and playlist
 */
export async function getPublicLesson(lessonId: string) {
  if (!lessonId) return null;

  try {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select(`
        id,
        module_id,
        title,
        content_type,
        video_url,
        description,
        sort_order,
        created_at,
        modules (
          id,
          title,
          course_id,
          courses (
            id,
            title,
            teacher_id,
            grade_level_id,
            grade_levels (
              name_ar
            )
          )
        )
      `)
      .eq("id", lessonId)
      .maybeSingle();

    if (error || !lesson) {
      return null;
    }

    // Fetch sibling lessons in the same module for playlist
    const { data: siblingLessons } = await supabase
      .from("lessons")
      .select("id, module_id, title, content_type, video_url, sort_order")
      .eq("module_id", lesson.module_id)
      .order("sort_order", { ascending: true });

    return {
      lesson,
      playlist: siblingLessons || [],
    };
  } catch (err) {
    console.error("Exception in getPublicLesson:", err);
    return null;
  }
}
