import type { IconName } from "@/components/ui/Icon";

// ─── Section Data Types ───────────────────────────────────────────────────────

export interface HeroSection {
  headline: string;
  subheadline: string;
  ctaText: string;
  badge: string;
}

export interface AboutSection {
  name: string;
  subject: string;
  experience: string;
  bio: string;
}

export interface TestimonialsSection {
  title: string;
  testimonials: { name: string; grade: string; text: string }[];
}

export type SocialPlatform =
  | "phone"
  | "whatsapp"
  | "telegram"
  | "facebook"
  | "instagram"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "website"
  | "email"
  | "other";

export interface SocialLink {
  platform: SocialPlatform;
  value: string;
  label?: string;
}

export interface ContactSection {
  title?: string;
  phone: string;
  whatsapp: string;
  note: string;
  /** Flexible list of additional/alternative social links */
  socials?: SocialLink[];
}

export interface PageHeadingConfig {
  title: string;
  subtitle: string;
}

export interface LessonDetailConfig {
  title?: string;
  moduleName?: string;
  description?: string;
  teacherNote?: string;
  pdfTitle?: string;
}

export interface HomePageData {
  hero: HeroSection;
  about: AboutSection;
  testimonials: TestimonialsSection;
  contact: ContactSection;
  modulesPage?: PageHeadingConfig;
  lessonsPage?: PageHeadingConfig;
  lessonDetailPage?: LessonDetailConfig;
}

// ─── Builder Preview Types ────────────────────────────────────────────────────

export interface BuilderModulePreview {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  duration: string;
  badge: string;
  progress: number;
}

export interface ModulesPageData {
  title: string;
  subtitle: string;
  modules: BuilderModulePreview[];
}

export interface BuilderLessonPreview {
  id: string;
  title: string;
  module: string;
  duration: string;
  isFree: boolean;
  views: number;
}

export interface LessonsPageData {
  title: string;
  subtitle: string;
  lessons: BuilderLessonPreview[];
}

export interface LessonDetailData {
  title: string;
  moduleName: string;
  description: string;
  teacherNote: string;
  pdfTitle: string;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type SectionId = "hero" | "about" | "courses" | "testimonials" | "contact";

export type PageId = "home" | "modules" | "lessons" | "lesson-detail";

export interface SectionConfig {
  readonly id: SectionId;
  readonly label: string;
  readonly icon: IconName;
}

export interface PageConfig {
  readonly id: PageId;
  readonly label: string;
  readonly icon: IconName;
  readonly subtitle: string;
}
