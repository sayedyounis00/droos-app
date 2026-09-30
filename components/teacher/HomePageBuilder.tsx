"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PLATFORM_THEMES,
  THEME_LIST,
  ThemeId,
  PlatformTheme,
} from "@/lib/themes";
import { TeacherUser } from "@/lib/auth/teacher-auth";
import { CourseItem } from "@/lib/droos-data";
import { Icon, IconBadge, IconName } from "@/components/ui/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSection {
  headline: string;
  subheadline: string;
  ctaText: string;
  badge: string;
}

interface AboutSection {
  name: string;
  subject: string;
  experience: string;
  bio: string;
}

interface TestimonialsSection {
  title: string;
  testimonials: { name: string; grade: string; text: string }[];
}

interface ContactSection {
  phone: string;
  whatsapp: string;
  note: string;
}

interface PageHeadingConfig {
  title: string;
  subtitle: string;
}

interface LessonDetailConfig {
  title?: string;
  moduleName?: string;
  description?: string;
  teacherNote?: string;
  pdfTitle?: string;
}

interface HomePageData {
  hero: HeroSection;
  about: AboutSection;
  testimonials: TestimonialsSection;
  contact: ContactSection;
  modulesPage?: PageHeadingConfig;
  lessonsPage?: PageHeadingConfig;
  lessonDetailPage?: LessonDetailConfig;
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const defaultData: HomePageData = {
  hero: {
    headline: "تعلّم بطريقة مختلفة تماماً",
    subheadline: "دروس متخصصة في الرياضيات لطلاب المرحلة الثانوية — شرح واضح، ومتابعة حقيقية.",
    ctaText: "سجّل في المجموعة الآن",
    badge: "نتائج مضمونة أو استرداد المصاريف",
  },
  about: {
    name: "أحمد سعد",
    subject: "الرياضيات",
    experience: "12 سنة خبرة",
    bio: "معلم رياضيات بخبرة أكثر من 12 عاماً في التدريس لطلاب الثانوية العامة. حصّلت على أعلى نسبة نجاح في المحافظة ثلاث سنوات متتالية.",
  },
  testimonials: {
    title: "ماذا يقول الطلاب؟",
    testimonials: [
      { name: "مريم خالد", grade: "الصف الثالث الثانوي", text: "بفضل مستر أحمد رفعت درجاتي من 50 لـ 97 في الرياضيات. الشرح ببساطة لا مثيل له." },
      { name: "عمر محمود", grade: "الصف الثاني الثانوي", text: "أول مرة في حياتي أحب الرياضيات. أسلوبه في الشرح بيخلي أصعب المسائل سهلة." },
      { name: "سارة إبراهيم", grade: "الصف الأول الثانوي", text: "المتابعة المستمرة والواجبات اليومية غيّرت مستواي تماماً خلال شهرين بس." },
    ],
  },
  contact: {
    phone: "01143825523",
    whatsapp: "01143825523",
    note: "للتسجيل والاستفسار تواصل معنا يومياً من 10 صباحاً حتى 10 مساءً",
  },
  modulesPage: {
    title: "الوحدات والكورسات الدراسية",
    subtitle: "استكشف الكورسات الشاملة والوحدات التعليمية المتاحة للتسجيل مباشرة",
  },
  lessonsPage: {
    title: "مكتبة الدروس والتمارين",
    subtitle: "تصفح وشاهد كل الدروس التفاعلية مع إمكانية مشاهدة الدروس المجانية تجريبياً",
  },
  lessonDetailPage: {
    teacherNote: "احرص على حل التمارين التطبيقية بعد مشاهدة الشرح مباشرة لتثبيت المعلومة.",
    pdfTitle: "ملخص الدرس والتمارين التطبيقية (PDF)",
  },
};

const defaultTeachingYears = [
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

// Helper to extract clean YouTube embed URL
function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}

// ─── Section Icons ────────────────────────────────────────────────────────────

const sections = [
  { id: "hero", label: "القسم الرئيسي", icon: "home" as IconName },
  { id: "about", label: "نبذة عني", icon: "user" as IconName },
  { id: "courses", label: "السنوات الدراسية", icon: "graduation-cap" as IconName },
  { id: "testimonials", label: "آراء الطلاب", icon: "message-square" as IconName },
  { id: "contact", label: "التواصل", icon: "phone" as IconName },
] as const;

type SectionId = (typeof sections)[number]["id"];

// ─── Main Component ───────────────────────────────────────────────────────────

interface BuilderModulePreview {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  duration: string;
  badge: string;
  progress: number;
}

interface ModulesPageData {
  title: string;
  subtitle: string;
  modules: BuilderModulePreview[];
}

const defaultModulesData: ModulesPageData = {
  title: "الوحدات والكورسات الدراسية",
  subtitle: "استكشف الكورسات الشاملة والوحدات التعليمية المتاحة للتسجيل مباشرة",
  modules: [
    {
      id: "m1",
      title: "وحدة الجبر والهندسة الفضائية",
      description: "شرح كامل لمفاهيم الأعداد المركبة، المحددات، والمصفوفات والهندسة الثلاثية الأبعاد.",
      lessonsCount: 14,
      duration: "18 ساعة",
      badge: "الأكثر طلباً",
      progress: 65,
    },
    {
      id: "m2",
      title: "وحدة التفاضل والتكامل المتقدم",
      description: "تطبيقات النوايات، المشتقات العليا، والتكاملات المحددة وغير المحددة خطوة بخطوة.",
      lessonsCount: 18,
      duration: "22 ساعة",
      badge: "جديد",
      progress: 40,
    },
    {
      id: "m3",
      title: "وحدة الاستاتيكا والديناميكا (الميكانيكا)",
      description: "تحليل القوى، الاتزان العام، وقوانين نيوتن في الحركة مع حل مسائل الامتحانات الوطنية.",
      lessonsCount: 12,
      duration: "15 ساعة",
      badge: "مراجعة شاملة",
      progress: 90,
    },
  ],
};

interface BuilderLessonPreview {
  id: string;
  title: string;
  module: string;
  duration: string;
  isFree: boolean;
  views: number;
}

interface LessonsPageData {
  title: string;
  subtitle: string;
  lessons: BuilderLessonPreview[];
}

const defaultLessonsData: LessonsPageData = {
  title: "مكتبة الدروس والتمارين",
  subtitle: "تصفح وشاهد كل الدروس التفاعلية مع إمكانية مشاهدة الدروس المجانية تجريبياً",
  lessons: [
    { id: "l1", title: "مقدمة الأعداد المركبة والشكل الجبري", module: "وحدة الجبر", duration: "25 دقيقة", isFree: true, views: 1420 },
    { id: "l2", title: "النسب المثلثية والشكل القطبي للعدد المركب", module: "وحدة الجبر", duration: "38 دقيقة", isFree: true, views: 980 },
    { id: "l3", title: "نظرية ديموافر وتطبيقاتها الرياضية", module: "وحدة الجبر", duration: "45 دقيقة", isFree: false, views: 650 },
    { id: "l4", title: "قواعد الاشتقاق للدوال المثلثية", module: "وحدة التفاضل", duration: "30 دقيقة", isFree: true, views: 1100 },
    { id: "l5", title: "تطبيقات على القيم العظمى والصغرى المطلقة", module: "وحدة التفاضل", duration: "42 دقيقة", isFree: false, views: 820 },
    { id: "l6", title: "اتزان القوى المتوازية المستوية", module: "وحدة الميكانيكا", duration: "35 دقيقة", isFree: false, views: 540 },
  ],
};

interface LessonDetailData {
  title: string;
  moduleName: string;
  description: string;
  teacherNote: string;
  pdfTitle: string;
}

const defaultLessonDetailData: LessonDetailData = {
  title: "الدرس الأول: مقدمة في الأعداد المركبة والعمليات الأساسية",
  moduleName: "وحدة الجبر والهندسة الفضائية — الصف الثالث الثانوي",
  description: "في هذا الدرس نستعرض المفاهيم التأسيسية للأعداد المركبة، العدد التخيلي i، وقواعد الجمع والضرب والمرافق للجذور التربيعية السالبة.",
  teacherNote: "تأكد من حل ملخص تمارين PDF قبل الانتقال للدرس القادم لضمان فهم التمارين المعقدة.",
  pdfTitle: "ملخص الدرس والملحق التدريبي (PDF - 2.4 MB)",
};

const pages = [
  { id: "home", label: "الصفحة الرئيسية", icon: "home" as IconName, subtitle: "واجهة الهبوط العامة" },
  { id: "modules", label: "جميع الكورسات والوحدات", icon: "book-open" as IconName, subtitle: "فهرس الكورسات والوحدات الدراسية" },
  { id: "lessons", label: "جميع الدروس والتمارين", icon: "play" as IconName, subtitle: "مكتبة الدروس المتاحة للطلاب" },
  { id: "lesson-detail", label: "معاينة الدرس ومشغل الفيديو", icon: "tv" as IconName, subtitle: "شاشة مشاهدة الدرس والملحقات" },
] as const;

type PageId = (typeof pages)[number]["id"];

export default function HomePageBuilder({
  onBack,
  teacherGrades,
  teacher,
}: {
  onBack: () => void;
  teacherGrades?: string[];
  teacher?: TeacherUser | null;
}) {
  // ── Build teacher-aware defaults ──────────────────────────────────────────
  const teacherDefaultData: HomePageData = {
    hero: {
      headline: "تعلّم بطريقة مختلفة تماماً",
      subheadline: teacher?.bio
        ? teacher.bio
        : "دروس متخصصة لطلاب المرحلة الثانوية — شرح واضح، ومتابعة حقيقية.",
      ctaText: "سجّل في المجموعة الآن",
      badge: "نتائج مضمونة أو استرداد المصاريف",
    },
    about: {
      name: teacher?.name ?? "اسم المعلم",
      subject: teacher?.subject ?? "المادة التخصصية",
      experience: "خبرة في التدريس",
      bio: teacher?.bio ?? "نبذة مختصرة عن المعلم وخبراته التعليمية.",
    },
    testimonials: defaultData.testimonials,
    contact: defaultData.contact,
    modulesPage: defaultData.modulesPage,
    lessonsPage: defaultData.lessonsPage,
    lessonDetailPage: defaultData.lessonDetailPage,
  };

  // ── Restore saved settings from localStorage ──────────────────────────────
  const storageKey = teacher?.id ? `droos_homepage_${teacher.id}` : null;

  const [data, setData] = useState<HomePageData>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.homePageData) return { ...teacherDefaultData, ...parsed.homePageData };
        }
      } catch {}
    }
    return teacherDefaultData;
  });

  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.themeId) return parsed.themeId as ThemeId;
        }
      } catch {}
    }
    return "horizon";
  });

  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  // Default to false so the side-by-side editing & page preview is active immediately!
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileEditorTab, setMobileEditorTab] = useState<"editor" | "preview">("editor");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [activePage, setActivePage] = useState<PageId>("home");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // ── Restore saved settings from Database ─────────────────────────────────
  useEffect(() => {
    if (!teacher?.id) return;
    let isMounted = true;
    const loadSavedSettings = async () => {
      try {
        const res = await fetch(`/api/teacher/homepage?teacherId=${teacher.id}`);
        const json = await res.json();
        if (isMounted && json.success && json.platform) {
          if (json.themeId) {
            setSelectedThemeId(json.themeId as ThemeId);
          }
          if (json.homePageData) {
            setData((prev) => ({
              ...prev,
              ...json.homePageData,
              hero: { ...prev.hero, ...(json.homePageData.hero || {}) },
              about: { ...prev.about, ...(json.homePageData.about || {}) },
              testimonials: json.homePageData.testimonials || prev.testimonials,
              contact: { ...prev.contact, ...(json.homePageData.contact || {}) },
              modulesPage: { ...prev.modulesPage, ...(json.homePageData.modulesPage || {}) },
              lessonsPage: { ...prev.lessonsPage, ...(json.homePageData.lessonsPage || {}) },
              lessonDetailPage: { ...prev.lessonDetailPage, ...(json.homePageData.lessonDetailPage || {}) },
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load saved homepage settings from DB:", err);
      }
    };
    loadSavedSettings();
    return () => {
      isMounted = false;
    };
  }, [teacher?.id]);

  // ── Real data from DB ─────────────────────────────────────────────────────
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  const fetchCourses = useCallback(async () => {
    if (!teacher?.id) return;
    setIsLoadingCourses(true);
    try {
      const res = await fetch(
        `/api/teacher/courses?gradeLevelIds=all&teacherId=${teacher.id}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.courses)) {
        setCourses(json.courses as CourseItem[]);
      }
    } catch (err) {
      console.error("Failed to fetch courses for builder:", err);
    } finally {
      setIsLoadingCourses(false);
      setCoursesLoaded(true);
    }
  }, [teacher?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ── Flatten all real lessons with course & module context ────────────────
  const allLessons = courses.flatMap((course) =>
    (course.modules ?? []).flatMap((mod) =>
      (mod.lessons ?? []).map((l) => ({
        ...l,
        courseTitle: course.title,
        gradeName: course.grade_levels?.name_ar,
        moduleTitle: mod.title,
        moduleId: mod.id,
        courseId: course.id,
      }))
    )
  );

  // Auto-select first lesson when loaded if none is active
  useEffect(() => {
    if (!selectedLessonId && allLessons.length > 0) {
      setSelectedLessonId(allLessons[0].id);
    }
  }, [allLessons, selectedLessonId]);

  const currentActiveLesson =
    allLessons.find((l) => l.id === selectedLessonId) || allLessons[0] || null;

  const currentActiveModule =
    courses
      .flatMap((c) => c.modules ?? [])
      .find((m) => m.id === currentActiveLesson?.moduleId) || null;

  const currentActiveCourse =
    courses.find((c) => c.id === currentActiveLesson?.courseId) || null;

  const currentPlaylist = currentActiveModule?.lessons ?? [];

  // ── Map real courses → ModulesPageData ───────────────────────────────────
  const modulesData: ModulesPageData = {
    title: data.modulesPage?.title || defaultModulesData.title,
    subtitle: data.modulesPage?.subtitle || defaultModulesData.subtitle,
    modules:
      coursesLoaded && courses.length > 0
        ? courses.flatMap((course) =>
            (course.modules ?? []).map((mod) => ({
              id: mod.id,
              title: mod.title,
              description:
                course.description ||
                `دروس ${course.title} — ${course.grade_levels?.name_ar ?? ""}`,
              lessonsCount: mod.lessons?.length ?? 0,
              duration: `${mod.lessons?.length ?? 0} حصة`,
              badge: `${course.title} • ${course.grade_levels?.name_ar ?? ""}`,
              progress: 0,
            }))
          )
        : defaultModulesData.modules,
  };

  // ── Map real lessons → LessonsPageData ──────────────────────────────────
  const lessonsData: LessonsPageData = {
    title: data.lessonsPage?.title || defaultLessonsData.title,
    subtitle: data.lessonsPage?.subtitle || defaultLessonsData.subtitle,
    lessons:
      coursesLoaded && courses.length > 0
        ? courses.flatMap((course) =>
            (course.modules ?? []).flatMap((mod) =>
              (mod.lessons ?? []).map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                module: `${course.title} — ${mod.title}`,
                duration:
                  lesson.content_type === "video"
                    ? "فيديو"
                    : lesson.content_type === "pdf"
                    ? "ملف PDF"
                    : "حصة تدريبية",
                isFree: !lesson.video_url?.includes("locked"),
                views: 0,
              }))
            )
          )
        : defaultLessonsData.lessons,
  };

  // ── Lesson detail: driven by real active lesson & user customisation ───────
  const lessonDetailData: LessonDetailData = {
    title:
      data.lessonDetailPage?.title ||
      currentActiveLesson?.title ||
      defaultLessonDetailData.title,
    moduleName:
      data.lessonDetailPage?.moduleName ||
      (currentActiveLesson
        ? `${currentActiveModule?.title ?? "الوحدة الدراسية"} — ${currentActiveCourse?.title ?? ""}`
        : defaultLessonDetailData.moduleName),
    description:
      data.lessonDetailPage?.description ||
      currentActiveLesson?.description ||
      defaultLessonDetailData.description,
    teacherNote:
      data.lessonDetailPage?.teacherNote ||
      defaultLessonDetailData.teacherNote,
    pdfTitle:
      data.lessonDetailPage?.pdfTitle ||
      defaultLessonDetailData.pdfTitle,
  };

  const currentPage = pages.find((p) => p.id === activePage) || pages[0];

  const [editModal, setEditModal] = useState<{
    title: string;
    label: string;
    value: string;
    multiline?: boolean;
    onSave: (newValue: string) => void;
  } | null>(null);

  const currentTheme = PLATFORM_THEMES[selectedThemeId] || PLATFORM_THEMES["horizon"];
  const displayGrades = teacherGrades && teacherGrades.length > 0 ? teacherGrades : defaultTeachingYears;

  const handleSelectTheme = (id: ThemeId) => {
    setSelectedThemeId(id);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // 1. Save to localStorage
      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ homePageData: data, themeId: selectedThemeId })
        );
      }

      // 2. Save to database via dedicated API
      if (teacher?.id) {
        const res = await fetch("/api/teacher/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherId: teacher.id,
            themeId: selectedThemeId,
            homePageData: data,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setSaveMessage("تم حفظ الصفحة وإعدادات المنصة في قاعدة البيانات بنجاح");
        } else {
          setSaveMessage("تم الحفظ محلياً (حدث خطأ في مزامنة قاعدة البيانات)");
        }
      } else {
        setSaveMessage("تم حفظ التعديلات محلياً بنجاح");
      }
    } catch (err) {
      console.error("Failed to save homepage:", err);
      setSaveMessage("تم الحفظ محلياً (تعذر الاتصال بالخادم)");
    } finally {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setSaveMessage(null);
      }, 4000);
    }
  };

  const handleUpdateHero = (updated: Partial<HeroSection>) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...updated } }));
  };

  const handleUpdateAbout = (updated: Partial<AboutSection>) => {
    setData((prev) => ({ ...prev, about: { ...prev.about, ...updated } }));
  };

  const handleUpdateTestimonialsTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: { ...prev.testimonials, title },
    }));
  };

  const handleUpdateTestimonial = (index: number, updated: Partial<{ name: string; grade: string; text: string }>) => {
    setData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        testimonials: prev.testimonials.testimonials.map((item, idx) =>
          idx === index ? { ...item, ...updated } : item
        ),
      },
    }));
  };

  const handleUpdateContact = (updated: Partial<ContactSection>) => {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, ...updated } }));
  };

  const handleUpdateModulesPage = (updated: Partial<PageHeadingConfig>) => {
    setData((prev) => ({
      ...prev,
      modulesPage: {
        title: updated.title ?? prev.modulesPage?.title ?? defaultModulesData.title,
        subtitle: updated.subtitle ?? prev.modulesPage?.subtitle ?? defaultModulesData.subtitle,
      },
    }));
  };

  const handleUpdateLessonsPage = (updated: Partial<PageHeadingConfig>) => {
    setData((prev) => ({
      ...prev,
      lessonsPage: {
        title: updated.title ?? prev.lessonsPage?.title ?? defaultLessonsData.title,
        subtitle: updated.subtitle ?? prev.lessonsPage?.subtitle ?? defaultLessonsData.subtitle,
      },
    }));
  };

  const handleUpdateLessonDetailPage = (updated: Partial<LessonDetailConfig>) => {
    setData((prev) => ({
      ...prev,
      lessonDetailPage: {
        ...prev.lessonDetailPage,
        ...updated,
      },
    }));
  };

  // ── Render Active Page Component ─────────────────────────────────────────
  const renderActivePageContent = () => {
    if (activePage === "home") {
      return (
        <PreviewPage
          data={data}
          teachingYears={displayGrades}
          courses={courses}
          onViewAllCourses={() => setActivePage("modules")}
          onViewCourse={() => setActivePage("modules")}
          theme={currentTheme}
          onEditText={(config) => setEditModal(config)}
          onUpdateHero={handleUpdateHero}
          onUpdateAbout={handleUpdateAbout}
          onUpdateTestimonialsTitle={handleUpdateTestimonialsTitle}
          onUpdateTestimonial={handleUpdateTestimonial}
          onUpdateContact={handleUpdateContact}
        />
      );
    }

    if (activePage === "modules") {
      return isLoadingCourses ? (
        <div className="flex items-center justify-center py-32 text-[#1F7A7B]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#1F7A7B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold">جاري تحميل الكورسات من قاعدة البيانات...</p>
          </div>
        </div>
      ) : (
        <ModulesPagePreview
          data={modulesData}
          theme={currentTheme}
          isLiveData={coursesLoaded && courses.length > 0}
          onViewLessons={() => setActivePage("lessons")}
        />
      );
    }

    if (activePage === "lessons") {
      return isLoadingCourses ? (
        <div className="flex items-center justify-center py-32 text-[#1F7A7B]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#1F7A7B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold">جاري تحميل الدروس من قاعدة البيانات...</p>
          </div>
        </div>
      ) : (
        <LessonsPagePreview
          data={lessonsData}
          theme={currentTheme}
          isLiveData={coursesLoaded && courses.length > 0}
          onSelectLesson={(lessonId) => {
            setSelectedLessonId(lessonId);
            setActivePage("lesson-detail");
          }}
        />
      );
    }

    if (activePage === "lesson-detail") {
      return (
        <LessonDetailPreview
          data={lessonDetailData}
          theme={currentTheme}
          videoUrl={currentActiveLesson?.video_url}
          playlistLessons={currentPlaylist.map((l) => ({
            id: l.id,
            title: l.title,
            duration: l.content_type === "video" ? "فيديو" : "درس",
            content_type: l.content_type,
            video_url: l.video_url,
          }))}
          currentLessonId={currentActiveLesson?.id}
          onSelectLesson={(lessonId) => setSelectedLessonId(lessonId)}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9] flex flex-col font-sans" dir="rtl">

      {/* Builder Top Bar Header */}
      <header className="sticky top-0 z-40 bg-[#0F4E4F] text-white shadow-xl">
        <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5 gap-3">
          
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold transition-colors"
              title="العودة للوحة التحكم"
            >
              <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">العودة للداشبورد</span>
            </button>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-2">
                منشئ صفحات المنصة
              </h1>
              <p className="text-[10px] text-white/60 hidden md:block">صمّم هوية منصتك وشاهد التغيير فوراً</p>
            </div>
          </div>

          {/* Center: Prominent Page Selector Tabs */}
          <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 gap-1 overflow-x-auto max-w-full">
            {pages.map((p) => {
              const isSelected = p.id === activePage;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-[#E8A83C] text-[#0F4E4F] shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  title={p.subtitle}
                >
                  <Icon name={p.icon} size={14} strokeWidth={1.8} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Theme Selector + Fullscreen Toggle + Save Button */}
          <div className="flex items-center gap-2">
            
            {/* Theme Selector Dropdown Trigger (Placed Next to Preview) */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 text-xs font-bold transition-all shadow-inner"
              >
                <Icon name="palette" size={15} strokeWidth={1.8} className="text-[#F3C97C]" />
                <div className="flex items-center gap-1.5">
                  <span className="text-white/70 text-[11px] hidden xs:inline">الثيم:</span>
                  <span className="font-bold text-[#F3C97C]">{currentTheme.nameAr}</span>
                </div>
                {/* Color swatch dots */}
                <div className="hidden sm:flex items-center gap-1 dir-ltr">
                  {currentTheme.swatches.slice(0, 3).map((hex, i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-full border border-white/30" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <svg className={`h-3.5 w-3.5 text-white/70 transition-transform ${showThemePicker ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Theme Picker Dropdown Menu */}
              {showThemePicker && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setShowThemePicker(false)} />
                  <div className="absolute left-0 sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white text-[#1C2126] shadow-2xl border border-[#EEF0F2] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2.5 mb-2.5 px-1">
                      <span className="text-xs font-black text-[#0F4E4F] flex items-center gap-1.5">
                        <Icon name="palette" size={15} strokeWidth={1.8} className="text-[#1F7A7B]" />
                        <span>اختر هُوية المنصة (4 ثيمات مخصصة)</span>
                      </span>
                      <span className="text-[10px] text-[#8A929B]">تحدث فوراً في المعاينة</span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-auto pl-1 pr-1">
                      {THEME_LIST.map((t) => {
                        const isSelected = t.id === selectedThemeId;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              handleSelectTheme(t.id);
                              setShowThemePicker(false);
                            }}
                            className={`w-full text-right p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                              isSelected
                                ? "border-[#1F7A7B] bg-[#EAF4F4]/70 ring-2 ring-[#1F7A7B]/20"
                                : "border-[#EEF0F2] hover:bg-[#F7F8F9] hover:border-[#D3D7DC]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#1C2126] flex items-center gap-2">
                                {t.nameAr}
                                <span className="text-[10px] font-normal text-[#8A929B] dir-ltr">({t.name})</span>
                              </span>
                              {isSelected && (
                                <span className="rounded-full bg-[#1F7A7B] p-0.5 text-white">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#4A5158] leading-tight line-clamp-1">{t.bestFor}</p>

                            {/* Swatches Strip */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1 dir-ltr">
                                {t.swatches.map((color, idx) => (
                                  <span
                                    key={idx}
                                    className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-[#8A929B] bg-white px-2 py-0.5 rounded-md border border-[#EEF0F2]">
                                {t.mood.split("،")[0]}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen Preview Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                previewMode
                  ? "bg-[#E8A83C] text-[#0F4E4F]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={previewMode ? "العودة للتحرير والمشاهدة الجانبية" : "عرض الصفحة ملء الشاشة"}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">{previewMode ? "العودة للتعديل" : "ملء الشاشة"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-[#E8A83C] hover:bg-[#C88A22] disabled:opacity-75 px-3.5 py-2 text-xs font-bold text-[#0F4E4F] transition-all active:scale-95 shadow-md shadow-[#E8A83C]/30"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-[#0F4E4F] border-t-transparent rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : saved ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>تم الحفظ!</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Global Save Feedback Toast Notification */}
        {saveMessage && (
          <div className="bg-[#0A3536] border-t border-white/10 px-4 py-2 text-center text-xs font-bold text-[#F3C97C] animate-in slide-in-from-top-1 duration-200 flex items-center justify-center gap-2">
            <Icon
              name={saveMessage.includes("خطأ") || saveMessage.includes("تعذر") ? "alert-triangle" : "check-circle"}
              size={14}
              strokeWidth={2}
              className="text-[#F3C97C]"
            />
            <span>{saveMessage}</span>
          </div>
        )}
      </header>

      {/* Awesome Interactive Edit Dialog */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EEF0F2] transition-all transform scale-100">
            <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <IconBadge name="pencil" variant="primary" size="md" />
                <div>
                  <h3 className="text-base font-black text-[#1C2126]">{editModal.title}</h3>
                  <p className="text-xs text-[#8A929B]">{editModal.label}</p>
                </div>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8F9] text-[#8A929B] hover:bg-[#EEF0F2] hover:text-[#1C2126] transition-colors"
                title="إغلاق"
              >
                <Icon name="x" size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              {editModal.multiline ? (
                <textarea
                  rows={4}
                  value={editModal.value}
                  onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] p-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={editModal.value}
                  onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editModal.onSave(editModal.value);
                      setEditModal(null);
                    }
                  }}
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                  autoFocus
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-[#EEF0F2]">
              <button
                onClick={() => setEditModal(null)}
                className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#4A5158] hover:bg-[#F7F8F9] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  editModal.onSave(editModal.value);
                  setEditModal(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#1F7A7B] hover:bg-[#166465] text-white px-6 py-2.5 text-xs font-black shadow-md transition-all active:scale-95"
              >
                <Icon name="check" size={14} strokeWidth={2} />
                <span>حفظ التعديل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {previewMode ? (
        // ── Full-Screen Preview Mode ───────────────────────────────────────────
        <div className="flex-1 overflow-auto bg-white flex flex-col min-h-0">
          {/* Top Banner allowing quick return to split editing mode */}
          <div className="bg-[#0A3536] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center gap-2">
              <Icon name="eye" size={16} strokeWidth={1.8} className="text-[#F3C97C]" />
              <span>أنت الآن في وضع ملء الشاشة لصفحة: <strong className="text-[#F3C97C]">({currentPage.label})</strong></span>
            </div>
            <button
              onClick={() => setPreviewMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-[#E8A83C] text-[#0F4E4F] font-black text-xs hover:bg-[#F3C97C] transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Icon name="edit" size={13} strokeWidth={2} />
              <span>العودة للتعديل والمشاهدة الجانبية</span>
            </button>
          </div>

          <div className="w-full flex-1">
            {renderActivePageContent()}
          </div>
        </div>
      ) : (
        // ── Side-by-Side Editor & Live Page Preview Mode ────────────────────────
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Mobile Tab Switcher (Visible on mobile/tablet screens only) */}
          <div className="lg:hidden bg-white border-b border-[#EEF0F2] p-2 flex items-center justify-center gap-2 shadow-xs flex-shrink-0">
            <button
              onClick={() => setMobileEditorTab("editor")}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl text-center transition-all inline-flex items-center justify-center gap-1.5 ${
                mobileEditorTab === "editor"
                  ? "bg-[#1F7A7B] text-white shadow-sm"
                  : "bg-[#F7F8F9] text-[#4A5158] hover:bg-[#EEF0F2]"
              }`}
            >
              <Icon name="pencil" size={13} strokeWidth={1.8} />
              <span>نموذج التعديل ({currentPage.label})</span>
            </button>
            <button
              onClick={() => setMobileEditorTab("preview")}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl text-center transition-all inline-flex items-center justify-center gap-1.5 ${
                mobileEditorTab === "preview"
                  ? "bg-[#1F7A7B] text-white shadow-sm"
                  : "bg-[#F7F8F9] text-[#4A5158] hover:bg-[#EEF0F2]"
              }`}
            >
              <Icon name="eye" size={13} strokeWidth={1.8} />
              <span>معاينة الصفحة الحية</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

            {/* Right Side: Editor Panel (Visible on desktop or when mobileEditorTab === 'editor') */}
            <div
              className={`w-full lg:w-[48%] xl:w-[45%] flex flex-col min-h-0 bg-[#F7F8F9] overflow-hidden ${
                mobileEditorTab === "editor" ? "flex" : "hidden lg:flex"
              }`}
            >
              {/* For Home Page, include the sections navigator */}
              {activePage === "home" ? (
                <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
                  {/* Home Sections Tabs */}
                  <aside className="sm:w-48 border-b sm:border-b-0 sm:border-l border-[#EEF0F2] bg-white flex-shrink-0 p-3 overflow-x-auto sm:overflow-y-auto">
                    <p className="hidden sm:block text-[10px] font-bold text-[#8A929B] uppercase tracking-widest px-2 mb-2">
                      أقسام الصفحة الرئيسية
                    </p>
                    <div className="flex sm:flex-col gap-1">
                      {sections.map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => setActiveSection(sec.id)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                            activeSection === sec.id
                              ? "bg-[#EAF4F4] text-[#1F7A7B] shadow-sm font-black"
                              : "text-[#4A5158] hover:bg-[#F7F8F9]"
                          }`}
                        >
                          <Icon name={sec.icon as IconName} size={15} strokeWidth={1.8} />
                          <span>{sec.label}</span>
                        </button>
                      ))}
                    </div>
                  </aside>

                  {/* Home Active Section Form */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8F9]">
                    {activeSection === "hero" && (
                      <HeroEditor data={data.hero} onChange={handleUpdateHero} />
                    )}
                    {activeSection === "about" && (
                      <AboutEditor data={data.about} onChange={handleUpdateAbout} />
                    )}
                    {activeSection === "courses" && (
                      <TeachingYearsEditor grades={displayGrades} />
                    )}
                    {activeSection === "testimonials" && (
                      <TestimonialsEditor data={data.testimonials} onChange={(testimonials) => setData((prev) => ({ ...prev, testimonials }))} />
                    )}
                    {activeSection === "contact" && (
                      <ContactEditor data={data.contact} onChange={handleUpdateContact} />
                    )}
                  </div>
                </div>
              ) : activePage === "modules" ? (
                /* Modules Page Editor */
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <ModulesEditor
                    title={data.modulesPage?.title ?? defaultModulesData.title}
                    subtitle={data.modulesPage?.subtitle ?? defaultModulesData.subtitle}
                    onChangeTitle={(title) => handleUpdateModulesPage({ title })}
                    onChangeSubtitle={(subtitle) => handleUpdateModulesPage({ subtitle })}
                    coursesCount={courses.length}
                    modulesCount={courses.reduce((acc, c) => acc + (c.modules?.length || 0), 0)}
                  />
                </div>
              ) : activePage === "lessons" ? (
                /* Lessons Page Editor */
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <LessonsEditor
                    title={data.lessonsPage?.title ?? defaultLessonsData.title}
                    subtitle={data.lessonsPage?.subtitle ?? defaultLessonsData.subtitle}
                    onChangeTitle={(title) => handleUpdateLessonsPage({ title })}
                    onChangeSubtitle={(subtitle) => handleUpdateLessonsPage({ subtitle })}
                    lessonsCount={allLessons.length}
                  />
                </div>
              ) : (
                /* Lesson Detail & Video Player Editor */
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <LessonDetailEditor
                    data={lessonDetailData}
                    onChange={(updated) => handleUpdateLessonDetailPage(updated)}
                    lessons={allLessons}
                    activeLessonId={currentActiveLesson?.id}
                    onSelectLesson={(id) => setSelectedLessonId(id)}
                  />
                </div>
              )}
            </div>

            {/* Left Side: The LIVE Page Preview (Visible on desktop or when mobileEditorTab === 'preview') */}
            <aside
              className={`w-full lg:w-[52%] xl:w-[55%] flex flex-col min-h-0 bg-[#EEF0F2]/50 border-r border-[#EEF0F2] overflow-hidden ${
                mobileEditorTab === "preview" ? "flex" : "hidden lg:flex"
              }`}
            >
              {/* Preview Bar Header */}
              <div className="bg-white border-b border-[#EEF0F2] px-4 py-3 flex items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Icon name={currentPage.icon as IconName} size={16} strokeWidth={1.8} className="text-[#1F7A7B]" />
                  <span className="text-xs font-black text-[#1C2126]">
                    معاينة الصفحة الحية: {currentPage.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E9E5B]/10 text-[#2E9E5B] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E5B] animate-pulse" />
                    <span className="inline-flex items-center gap-1">
                      <span>تحديث فوري</span>
                      <Icon name="zap" size={11} strokeWidth={2} />
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#8A929B] bg-[#F7F8F9] px-2.5 py-1 rounded-xl border border-[#EEF0F2]">
                    ثيم {currentTheme.nameAr}
                  </span>
                  <button
                    onClick={() => setPreviewMode(true)}
                    className="text-[11px] font-black text-[#1F7A7B] hover:text-[#0F4E4F] flex items-center gap-1 hover:underline bg-[#EAF4F4] px-2.5 py-1 rounded-xl transition-colors"
                    title="تكبير المعاينة ملء الشاشة"
                  >
                    <span>ملء الشاشة</span>
                    <Icon name="external-link" size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Scrollable Live Preview Container */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                <div className="bg-white rounded-2xl shadow-xl border border-[#D3D7DC]/70 overflow-hidden min-h-full">
                  {renderActivePageContent()}
                </div>
              </div>
            </aside>

          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function EditorCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconName | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        {typeof icon === "string" ? (
          <IconBadge name={icon as IconName} variant="primary" size="md" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F4] text-[#1F7A7B] border border-[#CFE6E6]">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-lg font-black text-[#1C2126]">{title}</h2>
          <p className="text-xs text-[#8A929B]">عدّل المحتوى وشاهد التغيير في المعاينة مباشرة</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder, multiline = false
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20 resize-none";
  return (
    <div>
      <label className="block text-xs font-bold text-[#1C2126] mb-2">{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function HeroEditor({ data, onChange }: { data: HeroSection; onChange: (d: HeroSection) => void }) {
  return (
    <EditorCard title="القسم الرئيسي (Hero)" icon="home">
      <InputField label="الشارة التعريفية (Badge)" value={data.badge} onChange={(v) => onChange({ ...data, badge: v })} placeholder="نتائج مضمونة..." />
      <InputField label="العنوان الرئيسي" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} placeholder="تعلّم بطريقة مختلفة..." />
      <InputField label="النص التوضيحي" value={data.subheadline} onChange={(v) => onChange({ ...data, subheadline: v })} placeholder="وصف مختصر..." multiline />
      <InputField label="نص زر التسجيل" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} placeholder="سجّل الآن" />
    </EditorCard>
  );
}

function AboutEditor({ data, onChange }: { data: AboutSection; onChange: (d: AboutSection) => void }) {
  return (
    <EditorCard title="نبذة عني (About)" icon="user">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="اسمك الكامل" value={data.name} onChange={(v) => onChange({ ...data, name: v })} placeholder="أحمد سعد" />
        <InputField label="المادة التخصصية" value={data.subject} onChange={(v) => onChange({ ...data, subject: v })} placeholder="الرياضيات" />
        <InputField label="سنوات الخبرة" value={data.experience} onChange={(v) => onChange({ ...data, experience: v })} placeholder="12 سنة خبرة" />
      </div>
      <InputField label="نبذتك الشخصية" value={data.bio} onChange={(v) => onChange({ ...data, bio: v })} multiline placeholder="اكتب نبذة مختصرة تظهر للطلاب..." />
    </EditorCard>
  );
}

function TeachingYearsEditor({ grades }: { grades: string[] }) {
  return (
    <EditorCard title="السنوات والصفوف الدراسية (قسم ثابت)" icon="graduation-cap">
      <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/60 p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#0F4E4F] font-bold text-sm">
          <Icon name="lock" size={14} className="text-[#1F7A7B]" />
          <span>هذا القسم ثابت ومربوط ببيانات الحساب</span>
        </div>
        <p className="text-xs text-[#4A5158] leading-relaxed">
          يتم عرض السنوات والصفوف الدراسية الخاصة بالمعلم تلقائياً من بيانات الحساب، ولا يمكن تعديل الدروس أو الكورسات الفردية من هنا.
        </p>
        <div className="pt-3 border-t border-[#CFE6E6]">
          <span className="block text-xs font-bold text-[#1C2126] mb-3">الصفوف الدراسية المتاحة حالياً:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {grades.map((grade, idx) => (
              <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-white border border-[#7EB8B9] p-3 text-xs font-bold text-[#1F7A7B] shadow-sm">
                <Icon name="graduation-cap" size={16} strokeWidth={1.8} className="text-[#1F7A7B]" />
                <span>{grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorCard>
  );
}

function TestimonialsEditor({ data, onChange }: { data: TestimonialsSection; onChange: (d: TestimonialsSection) => void }) {
  const updateT = (idx: number, field: string, val: string) => {
    const updated = data.testimonials.map((t, i) => i === idx ? { ...t, [field]: val } : t);
    onChange({ ...data, testimonials: updated });
  };

  return (
    <EditorCard title="آراء الطلاب" icon="message-square">
      <InputField label="عنوان القسم" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <div className="space-y-4">
        {data.testimonials.map((t, idx) => (
          <div key={idx} className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2E9E5B] text-[10px] font-bold text-white">{idx + 1}</span>
              <span className="text-xs font-bold text-[#4A5158]">رأي {idx + 1}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="اسم الطالب" value={t.name} onChange={(v) => updateT(idx, "name", v)} />
              <InputField label="الصف الدراسي" value={t.grade} onChange={(v) => updateT(idx, "grade", v)} />
            </div>
            <InputField label="الرأي" value={t.text} onChange={(v) => updateT(idx, "text", v)} multiline />
          </div>
        ))}
      </div>
    </EditorCard>
  );
}

function ContactEditor({ data, onChange }: { data: ContactSection; onChange: (d: ContactSection) => void }) {
  return (
    <EditorCard title="معلومات التواصل" icon="phone">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="رقم الهاتف" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="01143825523" />
        <InputField label="رقم واتساب" value={data.whatsapp} onChange={(v) => onChange({ ...data, whatsapp: v })} placeholder="01143825523" />
      </div>
      <InputField label="ملاحظة التواصل" value={data.note} onChange={(v) => onChange({ ...data, note: v })} multiline placeholder="أوقات التواصل والمواعيد..." />
    </EditorCard>
  );
}

function ModulesEditor({
  title,
  subtitle,
  onChangeTitle,
  onChangeSubtitle,
  coursesCount,
  modulesCount,
}: {
  title: string;
  subtitle: string;
  onChangeTitle: (v: string) => void;
  onChangeSubtitle: (v: string) => void;
  coursesCount: number;
  modulesCount: number;
}) {
  return (
    <EditorCard title="صفحة الكورسات والوحدات الدراسية" icon="book-open">
      <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/70 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Icon name="zap" size={14} className="text-[#1F7A7B]" />
          <span className="font-bold text-[#0F4E4F]">
            مربوط بقاعدة البيانات: تم جلب {coursesCount} كورس و {modulesCount} وحدة دراسية
          </span>
        </div>
        <span className="text-[10px] bg-white text-[#1F7A7B] font-black px-2.5 py-1 rounded-full border border-[#7EB8B9] self-start sm:self-auto inline-flex items-center gap-1">
          <span>بيانات فعلية</span>
          <Icon name="check" size={11} strokeWidth={2.5} />
        </span>
      </div>

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

function LessonsEditor({
  title,
  subtitle,
  onChangeTitle,
  onChangeSubtitle,
  lessonsCount,
}: {
  title: string;
  subtitle: string;
  onChangeTitle: (v: string) => void;
  onChangeSubtitle: (v: string) => void;
  lessonsCount: number;
}) {
  return (
    <EditorCard title="صفحة مكتبة الدروس والتمارين" icon="play">
      <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/70 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Icon name="zap" size={14} className="text-[#1F7A7B]" />
          <span className="font-bold text-[#0F4E4F]">
            مربوط بقاعدة البيانات: تم جلب {lessonsCount} درس وحصة تعليمية
          </span>
        </div>
        <span className="text-[10px] bg-white text-[#1F7A7B] font-black px-2.5 py-1 rounded-full border border-[#7EB8B9] self-start sm:self-auto inline-flex items-center gap-1">
          <span>بيانات فعلية</span>
          <Icon name="check" size={11} strokeWidth={2.5} />
        </span>
      </div>

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

function LessonDetailEditor({
  data,
  onChange,
  lessons,
  activeLessonId,
  onSelectLesson,
}: {
  data: LessonDetailData;
  onChange: (updated: Partial<LessonDetailData>) => void;
  lessons: Array<{ id: string; title: string; courseTitle?: string }>;
  activeLessonId?: string | null;
  onSelectLesson: (id: string) => void;
}) {
  return (
    <EditorCard title="صفحة مشاهدة الدرس ومشغل الفيديو" icon="tv">
      {/* Lesson Selector */}
      {lessons.length > 0 && (
        <div className="mb-5 bg-white p-4 rounded-2xl border border-[#EEF0F2] shadow-xs">
          <label className="block text-xs font-black text-[#1C2126] mb-2 flex items-center justify-between">
            <span>اختر درساً لمعاينته وتعديله من قاعدة البيانات:</span>
            <span className="text-[10px] text-[#1F7A7B] font-bold">({lessons.length} درس متاح)</span>
          </label>
          <select
            value={activeLessonId || ""}
            onChange={(e) => onSelectLesson(e.target.value)}
            className="w-full rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] py-2.5 px-3 text-xs font-bold text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
          >
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.courseTitle ? `[${l.courseTitle}] ` : ""}{l.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <InputField
        label="عنوان الدرس المعروض"
        value={data.title}
        onChange={(v) => onChange({ title: v })}
        placeholder="الدرس الأول: ..."
      />
      <InputField
        label="اسم الكورس / الوحدة"
        value={data.moduleName}
        onChange={(v) => onChange({ moduleName: v })}
        placeholder="وحدة الجبر — الصف الثالث الثانوي"
      />
      <InputField
        label="وصف الدرس ومحتوى الشرح"
        value={data.description}
        onChange={(v) => onChange({ description: v })}
        placeholder="في هذا الدرس نستعرض المفاهيم الأساسية..."
        multiline
      />
      <InputField
        label="ملاحظة وتوجيهات المعلم للطلاب"
        value={data.teacherNote}
        onChange={(v) => onChange({ teacherNote: v })}
        placeholder="تأكد من مراجعة التمارين التطبيقية..."
        multiline
      />
      <InputField
        label="عنوان ملحق تمارين PDF"
        value={data.pdfTitle}
        onChange={(v) => onChange({ pdfTitle: v })}
        placeholder="ملخص الدرس والتمارين التطبيقية (PDF)"
      />
    </EditorCard>
  );
}

// ─── Editable Wrapper Component ───────────────────────────────────────────────

type EditModalConfig = {
  title: string;
  label: string;
  value: string;
  multiline?: boolean;
  onSave: (newValue: string) => void;
};

function EditableWrapper({
  value,
  label,
  onEditText,
  onSave,
  multiline = false,
  className = "",
  style,
  as: Component = "span",
  children,
}: {
  value: string;
  label: string;
  onEditText?: (config: EditModalConfig) => void;
  onSave?: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  children?: React.ReactNode;
}) {
  if (!onEditText || !onSave) {
    return (
      <Component className={className} style={style}>
        {children !== undefined ? children : value}
      </Component>
    );
  }

  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onEditText({
          title: `تعديل: ${label}`,
          label: `قم بتحديث النص أدناه واضغط حفظ لتعديله فوراً`,
          value: value,
          multiline: multiline,
          onSave: onSave,
        });
      }}
      className={`group/editable relative cursor-pointer transition-all hover:outline-2 hover:outline-dashed hover:outline-[#E8A83C] hover:bg-[#E8A83C]/10 rounded-lg p-1 -m-1 ${className}`}
      style={style}
      title={`انقر لتعديل: ${label}`}
    >
      {children !== undefined ? children : value}
      <span className="opacity-0 group-hover/editable:opacity-100 transition-all inline-flex items-center gap-1 text-[10px] font-black bg-[#E8A83C] text-[#0F4E4F] px-2 py-0.5 rounded-full shadow-lg mr-2 align-middle border border-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        تعديل
      </span>
    </Component>
  );
}

// ─── Preview Page Component ───────────────────────────────────────────────────

function PreviewPage({
  data,
  teachingYears,
  courses = [],
  onViewAllCourses,
  onViewCourse,
  theme,
  onEditText,
  onUpdateHero,
  onUpdateAbout,
  onUpdateTestimonialsTitle,
  onUpdateTestimonial,
  onUpdateContact,
}: {
  data: HomePageData;
  teachingYears: string[];
  courses?: CourseItem[];
  onViewAllCourses?: () => void;
  onViewCourse?: (courseId: string) => void;
  theme: PlatformTheme;
  onEditText?: (config: EditModalConfig) => void;
  onUpdateHero?: (updated: Partial<HeroSection>) => void;
  onUpdateAbout?: (updated: Partial<AboutSection>) => void;
  onUpdateTestimonialsTitle?: (title: string) => void;
  onUpdateTestimonial?: (index: number, updated: Partial<{ name: string; grade: string; text: string }>) => void;
  onUpdateContact?: (updated: Partial<ContactSection>) => void;
}) {
  const colors = theme.light;

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Google Fonts Dynamic Load */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Baloo+Bhaijaan+2:wght@400;600;800&family=Cairo:wght@400;600;700;900&family=El+Messiri:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=Tajawal:wght@400;500;700;900&display=swap"
      />

      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: "#FFFFFF",
        }}
      >
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.accent} 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${colors.border} 0%, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24 text-center">
          
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold mb-6 backdrop-blur-md transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: `1px solid rgba(255, 255, 255, 0.25)`,
              borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : theme.radius.cardCss,
              color: "#FFFFFF",
            }}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent }}
            />
            <EditableWrapper
              value={data.hero.badge}
              label="الشارة التعريفية (Badge)"
              onEditText={onEditText}
              onSave={(v) => onUpdateHero?.({ badge: v })}
            >
              <span>{data.hero.badge}</span>
            </EditableWrapper>
          </div>

          {/* Headline */}
          <EditableWrapper
            value={data.hero.headline}
            label="العنوان الرئيسي"
            onEditText={onEditText}
            onSave={(v) => onUpdateHero?.({ headline: v })}
            as="h1"
            className="text-3xl sm:text-5xl font-black leading-tight mb-5 tracking-tight"
            style={{ fontFamily: theme.fonts.display }}
          />

          {/* Subheadline */}
          <EditableWrapper
            value={data.hero.subheadline}
            label="النص التوضيحي"
            multiline
            onEditText={onEditText}
            onSave={(v) => onUpdateHero?.({ subheadline: v })}
            as="p"
            className="text-sm sm:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed"
          />

          {/* CTA Button */}
          <button
            className="inline-flex items-center gap-2 font-black px-8 py-4 text-sm transition-all active:scale-95"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              borderRadius: theme.radius.buttonCss,
              boxShadow: theme.shadow.button,
            }}
          >
            <EditableWrapper
              value={data.hero.ctaText}
              label="نص زر التسجيل"
              onEditText={onEditText}
              onSave={(v) => onUpdateHero?.({ ctaText: v })}
            >
              <span>{data.hero.ctaText}</span>
            </EditableWrapper>
            <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

        </div>

        {/* Decorative Wave Divider */}
        <svg
          viewBox="0 0 1440 48"
          className="w-full h-8 sm:h-12"
          style={{ color: colors.background }}
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,48 C360,0 1080,48 1440,0 L1440,48 Z" />
        </svg>
      </section>

      {/* 2. About Section */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <div
          className="p-6 sm:p-8 transition-all flex flex-col sm:flex-row items-center gap-8"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: theme.radius.cardCss,
            boxShadow: theme.shadow.card,
          }}
        >
          {/* Avatar Icon */}
          <div
            className="flex-shrink-0 flex h-24 w-24 items-center justify-center text-4xl font-black text-white shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: colors.primary,
              borderRadius: theme.radius.cardCss,
            }}
          >
            {data.about.name.charAt(0)}
          </div>

          <div className="text-center sm:text-right">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold mb-3"
              style={{
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
                borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
              }}
            >
              <EditableWrapper
                value={data.about.subject}
                label="المادة التخصصية"
                onEditText={onEditText}
                onSave={(v) => onUpdateAbout?.({ subject: v })}
              >
                <span>{data.about.subject}</span>
              </EditableWrapper>
              <span>•</span>
              <EditableWrapper
                value={data.about.experience}
                label="سنوات الخبرة"
                onEditText={onEditText}
                onSave={(v) => onUpdateAbout?.({ experience: v })}
              >
                <span>{data.about.experience}</span>
              </EditableWrapper>
            </div>

            <EditableWrapper
              value={data.about.name}
              label="اسم المعلم"
              onEditText={onEditText}
              onSave={(v) => onUpdateAbout?.({ name: v })}
              as="h2"
              className="text-2xl font-black mb-3"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            />

            <EditableWrapper
              value={data.about.bio}
              label="النبذة الشخصية"
              multiline
              onEditText={onEditText}
              onSave={(v) => onUpdateAbout?.({ bio: v })}
              as="p"
              className="text-sm leading-relaxed max-w-xl"
              style={{ color: colors.textSecondary }}
            />
          </div>
        </div>
      </section>

      {/* 3. Teaching Years Section (Static) */}
      <section className="py-14" style={{ backgroundColor: colors.surface }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-10">
            <h2
              className="text-2xl font-black mb-2"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            >
              السنوات والصفوف الدراسية
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              الصفوف والمراحل المتاحة للتسجيل مع المعلم (قسم ثابت تلقائي من النظام)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {teachingYears.map((year, i) => (
              <div
                key={i}
                className="p-6 text-center transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    borderRadius: theme.radius.cardCss,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>

                <h3 className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {year}
                </h3>

                <span
                  className="inline-block px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.primary,
                    borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                  }}
                >
                  متاح للتسجيل
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.1 Real Courses Section from DB */}
      {courses && courses.length > 0 && (
        <section className="py-14" style={{ backgroundColor: colors.background }}>
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                >
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  <span>الكورسات الحالية المنشورة</span>
                </div>
                <h2
                  className="text-2xl font-black"
                  style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                >
                  الكورسات والدورات المتاحة
                </h2>
                <p className="text-xs sm:text-sm mt-1" style={{ color: colors.textSecondary }}>
                  اختر الدورة المناسبة لمرحلتك الدراسية واستكشف تفاصيل الحصص والدروس
                </p>
              </div>

              {onViewAllCourses && (
                <button
                  onClick={onViewAllCourses}
                  className="text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    borderRadius: theme.radius.buttonCss,
                  }}
                >
                  <span>عرض كل الوحدات</span>
                  <span>←</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.map((course) => {
                const modulesCount = course.modules?.length ?? 0;
                const lessonsCount = (course.modules ?? []).reduce(
                  (sum, m) => sum + (m.lessons?.length ?? 0),
                  0
                );
                return (
                  <div
                    key={course.id}
                    className="p-6 rounded-2xl flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: theme.radius.cardCss,
                      boxShadow: theme.shadow.card,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 text-[10px] font-black"
                          style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                            borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                          }}
                        >
                          {course.grade_levels?.name_ar || "المرحلة الثانوية"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: colors.textSecondary }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          {modulesCount} وحدات • {lessonsCount} حصة
                        </span>
                      </div>

                      <h3
                        className="text-base sm:text-lg font-black mb-2"
                        style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                      >
                        {course.title}
                      </h3>

                      <p
                        className="text-xs leading-relaxed mb-6 line-clamp-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {course.description || "شرح شامل ومبسط للمنهج الدراسي مع ملخصات واختبارات دورية."}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onViewCourse) onViewCourse(course.id);
                        else if (onViewAllCourses) onViewAllCourses();
                      }}
                      className="w-full font-black text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                        borderRadius: theme.radius.buttonCss,
                      }}
                    >
                      <span>استعراض محتوى الدورة</span>
                      <span>←</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Testimonials Section */}
      <section className="py-14" style={{ backgroundColor: colors.background }}>
        <div className="mx-auto max-w-4xl px-6">
          <EditableWrapper
            value={data.testimonials.title}
            label="عنوان قسم آراء الطلاب"
            onEditText={onEditText}
            onSave={(v) => onUpdateTestimonialsTitle?.(v)}
            as="h2"
            className="text-2xl font-black text-center mb-10"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {data.testimonials.testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 transition-all"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div className="mb-3" style={{ color: colors.accent }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                </div>

                <EditableWrapper
                  value={t.text}
                  label={`رأي الطالب (${t.name})`}
                  multiline
                  onEditText={onEditText}
                  onSave={(v) => onUpdateTestimonial?.(i, { text: v })}
                  as="p"
                  className="text-xs sm:text-sm leading-relaxed mb-5"
                  style={{ color: colors.textSecondary }}
                />

                <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                  <div
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold text-white"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: "9999px",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <EditableWrapper
                      value={t.name}
                      label="اسم الطالب"
                      onEditText={onEditText}
                      onSave={(v) => onUpdateTestimonial?.(i, { name: v })}
                      className="text-xs font-bold block"
                      style={{ color: colors.textPrimary }}
                    />
                    <EditableWrapper
                      value={t.grade}
                      label="الصف الدراسي للطالب"
                      onEditText={onEditText}
                      onSave={(v) => onUpdateTestimonial?.(i, { grade: v })}
                      className="text-[10px] block"
                      style={{ color: colors.textSecondary }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section
        className="py-16 text-center transition-all"
        style={{
          backgroundColor: colors.primary,
          color: "#FFFFFF",
        }}
      >
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-black mb-3" style={{ fontFamily: theme.fonts.display }}>
            تواصل معنا
          </h2>

          <EditableWrapper
            value={data.contact.note}
            label="ملاحظة قسم التواصل"
            multiline
            onEditText={onEditText}
            onSave={(v) => onUpdateContact?.({ note: v })}
            as="p"
            className="text-xs sm:text-sm opacity-80 mb-8 max-w-md mx-auto"
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-bold border transition-all"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: theme.radius.buttonCss,
                color: "#FFFFFF",
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <EditableWrapper
                value={data.contact.phone}
                label="رقم الهاتف"
                onEditText={onEditText}
                onSave={(v) => onUpdateContact?.({ phone: v })}
              >
                <span>{data.contact.phone}</span>
              </EditableWrapper>
            </div>

            <div
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-black transition-all shadow-lg"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
                borderRadius: theme.radius.buttonCss,
                boxShadow: theme.shadow.button,
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <EditableWrapper
                value={data.contact.whatsapp}
                label="رقم الواتساب"
                onEditText={onEditText}
                onSave={(v) => onUpdateContact?.({ whatsapp: v })}
              >
                <span>واتساب ({data.contact.whatsapp})</span>
              </EditableWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs py-6 opacity-60" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
        مدعوم بواسطة منصة <span className="font-bold" style={{ color: colors.primary }}>دُرُوس</span> — {theme.nameAr}
      </footer>

    </div>
  );
}

// ─── Modules Catalog Page Preview Component ─────────────────────────────────────

function ModulesPagePreview({
  data,
  theme,
  isLiveData,
  onViewLessons,
}: {
  data: ModulesPageData;
  theme: PlatformTheme;
  isLiveData?: boolean;
  onViewLessons?: () => void;
}) {
  const colors = theme.light;

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen pb-16"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Live data indicator */}
      {isLiveData && (
        <div className="bg-[#2E9E5B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>بيانات حية من قاعدة البيانات — هذه هي الكورسات والوحدات الحقيقية التي أضفتها</span>
        </div>
      )}
      {!isLiveData && (
        <div className="bg-[#E0A429] text-[#1C2126] px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>بيانات تجريبية — أضف كورسات ودروس من تبويب "إدارة الدروس" لتظهر هنا بيانات حقيقية</span>
        </div>
      )}

      {/* Header Banner */}
      <section
        className="py-12 px-6 text-center shadow-sm"
        style={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-2xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          >
            {data.title}
          </h1>

          <p
            className="text-xs sm:text-base max-w-xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            {data.subtitle}
          </p>

          {/* Search bar mockup */}
          <div className="mt-8 mx-auto max-w-lg relative">
            <input
              type="text"
              readOnly
              placeholder="ابحث عن اسم الوحدة أو الدرس..."
              className="w-full rounded-2xl py-3 px-5 pr-11 text-xs font-bold shadow-sm outline-none cursor-pointer"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A929B]">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {data.modules.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border-2 border-dashed border-[#D3D7DC] bg-[#F7F8F9] max-w-xl mx-auto">
            <div className="flex justify-center mb-4 text-[#D3D7DC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="text-base font-black text-[#1C2126] mb-1">لم يتم إضافة وحدات دراسية بعد</h3>
            <p className="text-xs text-[#8A929B] leading-relaxed">
              أضف دورات ووحدات جديدة من قسم "إدارة الدروس" في لوحة التحكم، وستظهر فوراً هنا لطلابك في المنصة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.modules.map((m) => (
              <div
                key={m.id}
                className="p-6 flex flex-col justify-between transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 text-[10px] font-black"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary,
                        borderRadius: theme.radius.badge === "rounded-full" ? "9999px" : "6px",
                      }}
                    >
                      {m.badge}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: colors.textSecondary }}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{m.duration}</span>
                    </span>
                  </div>

                  <h3
                    className="text-base font-black mb-3"
                    style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
                  >
                    {m.title}
                  </h3>

                  <p
                    className="text-xs leading-relaxed mb-6"
                    style={{ color: colors.textSecondary }}
                  >
                    {m.description}
                  </p>
                </div>

                <div>
                  {/* Progress bar mockup */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1" style={{ color: colors.textSecondary }}>
                      <span>معدل الإنجاز</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${colors.primary}20` }}>
                      <div className="h-full transition-all" style={{ width: `${m.progress}%`, backgroundColor: colors.accent }} />
                    </div>
                  </div>

                  <button
                    onClick={onViewLessons}
                    className="w-full font-black text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#FFFFFF",
                      borderRadius: theme.radius.buttonCss,
                    }}
                  >
                    <span>عرض دروس الوحدة ({m.lessonsCount} درس)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Lessons Library Page Preview Component ─────────────────────────────────────

function LessonsPagePreview({
  data,
  theme,
  isLiveData,
  onSelectLesson,
}: {
  data: LessonsPageData;
  theme: PlatformTheme;
  isLiveData?: boolean;
  onSelectLesson?: (lessonId: string) => void;
}) {
  const colors = theme.light;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = data.lessons.filter((l) =>
    !searchQuery.trim() ||
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen pb-16"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Live data indicator */}
      {isLiveData && (
        <div className="bg-[#2E9E5B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>بيانات حية من قاعدة البيانات — هذه هي الدروس الحقيقية التي أضفتها</span>
        </div>
      )}
      {!isLiveData && (
        <div className="bg-[#E0A429] text-[#1C2126] px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>بيانات تجريبية — أضف حصص ودروس من تبويب "إدارة الدروس" لتظهر هنا بيانات حقيقية</span>
        </div>
      )}

      {/* Header Banner */}
      <section
        className="py-12 px-6 text-center shadow-sm"
        style={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-2xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
          >
            {data.title}
          </h1>

          <p
            className="text-xs sm:text-base max-w-xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            {data.subtitle}
          </p>

          {/* Real-time search bar */}
          <div className="mt-8 mx-auto max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم الدرس أو الدورة..."
              className="w-full rounded-2xl py-3 px-5 pr-11 pl-10 text-xs font-bold shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#1F7A7B]/20"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A929B]">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A929B] hover:text-[#1C2126]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Lessons List */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border-2 border-dashed border-[#D3D7DC] bg-[#F7F8F9] max-w-xl mx-auto">
            <div className="flex justify-center mb-4 text-[#D3D7DC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <h3 className="text-base font-black text-[#1C2126] mb-1">لا توجد دروس مطابقة</h3>
            <p className="text-xs text-[#8A929B] leading-relaxed">
              {searchQuery ? "جرّب البحث بكلمة أخرى أو تصفح باقي الدروس." : "أضف حصص ودروس جديدة من تبويب إدارة الدروس لتظهر هنا."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((l) => (
              <div
                key={l.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: theme.radius.cardCss,
                  boxShadow: theme.shadow.card,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => onSelectLesson?.(l.id)}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl shadow-md cursor-pointer transition-transform hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.accent,
                    }}
                  >
                    ▶
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: l.isFree ? `${colors.accent}30` : `${colors.primary}15`,
                          color: colors.primary,
                          borderRadius: "9999px",
                        }}
                      >
                        {l.isFree ? (
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                            درس مجاني
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            مشتركين
                          </span>
                        )}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: colors.textSecondary }}
                      >
                        {l.module}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectLesson?.(l.id)}
                      className="text-sm sm:text-base font-bold cursor-pointer hover:underline"
                      style={{ color: colors.textPrimary }}
                    >
                      {l.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: colors.textSecondary }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {l.duration}
                  </span>

                  <button
                    onClick={() => onSelectLesson?.(l.id)}
                    className="px-4 py-2 text-xs font-black rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                      borderRadius: theme.radius.buttonCss,
                    }}
                  >
                    مشاهدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Lesson Detail & Video Player Preview Component ───────────────────────────

function LessonDetailPreview({
  data,
  theme,
  videoUrl,
  playlistLessons = [],
  currentLessonId,
  onSelectLesson,
  onEditText,
  onUpdateDetail,
}: {
  data: LessonDetailData;
  theme: PlatformTheme;
  videoUrl?: string | null;
  playlistLessons?: Array<{
    id: string;
    title: string;
    duration?: string;
    content_type?: string;
    video_url?: string | null;
  }>;
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  onEditText?: (config: EditModalConfig) => void;
  onUpdateDetail?: (updated: Partial<LessonDetailData>) => void;
}) {
  const colors = theme.light;
  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview");
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div
      dir="rtl"
      className="transition-colors duration-300 min-h-screen pb-16"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: theme.fonts.body,
        minWidth: 360,
      }}
    >
      {/* Top Breadcrumb */}
      <div className="bg-[#0A3536] text-white py-3 px-6 text-xs font-bold border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <EditableWrapper
            value={data.moduleName}
            label="اسم الكورس / الوحدة"
            onEditText={onEditText}
            onSave={(v) => onUpdateDetail?.({ moduleName: v })}
          >
            <span className="inline-flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              {data.moduleName}
            </span>
          </EditableWrapper>

          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/70">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            مشغّل فيديو دُرُوس التفاعلي
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Container (YouTube Embed or Simulated Player) */}
          {youtubeEmbedUrl ? (
            <div
              className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10"
            >
              <iframe
                src={youtubeEmbedUrl}
                title={data.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group"
              style={{ backgroundColor: "#0D1420" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8A83C] text-[#0F4E4F] shadow-2xl transition-transform hover:scale-110 active:scale-95"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل الفيديو"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1.5" />
                    <rect x="14" y="5" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 fill-current translate-x-[-1px]" viewBox="0 0 24 24">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                )}
              </button>

              <div className="absolute bottom-4 right-4 left-4 z-10 flex items-center justify-between text-white text-xs font-bold">
                <span>{isPlaying ? "جاري تشغيل الفيديو..." : "مشغّل فيديو تجريبي — اضغط للتشغيل"}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">1080p Full HD</span>
              </div>
            </div>
          )}

          {/* Lesson Header */}
          <div
            className="p-6 rounded-2xl shadow-sm border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: theme.radius.cardCss,
            }}
          >
            <EditableWrapper
              value={data.title}
              label="عنوان الدرس"
              onEditText={onEditText}
              onSave={(v) => onUpdateDetail?.({ title: v })}
              as="h1"
              className="text-lg sm:text-2xl font-black mb-4"
              style={{ fontFamily: theme.fonts.display, color: colors.textPrimary }}
            />

            {/* Tab Controls */}
            <div className="flex items-center gap-2 border-b border-[#EEF0F2] pb-3 mb-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  activeTab === "overview"
                    ? "bg-[#EAF4F4] text-[#1F7A7B]"
                    : "text-[#4A5158] hover:bg-[#F7F8F9]"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                الوصف والملاحظات
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  activeTab === "pdf"
                    ? "bg-[#EAF4F4] text-[#1F7A7B]"
                    : "text-[#4A5158] hover:bg-[#F7F8F9]"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l7.9-7.9"/></svg>
                ملحقات PDF والتمارين
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <EditableWrapper
                  value={data.description}
                  label="وصف الدرس"
                  multiline
                  onEditText={onEditText}
                  onSave={(v) => onUpdateDetail?.({ description: v })}
                  as="p"
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: colors.textSecondary }}
                />

                <div
                  className="p-4 rounded-xl border border-[#CFE6E6] bg-[#EAF4F4]/50"
                >
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#0F4E4F] mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                    ملاحظة المعلم للطلاب:
                  </span>
                  <EditableWrapper
                    value={data.teacherNote}
                    label="ملاحظة المعلم"
                    multiline
                    onEditText={onEditText}
                    onSave={(v) => onUpdateDetail?.({ teacherNote: v })}
                    as="p"
                    className="text-xs text-[#1C2126]"
                  />
                </div>
              </div>
            )}

            {activeTab === "pdf" && (
              <div className="p-4 rounded-xl border border-[#D3D7DC] bg-[#F7F8F9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4F4] text-[#1F7A7B]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <EditableWrapper
                    value={data.pdfTitle}
                    label="عنوان ملف PDF الملحق"
                    onEditText={onEditText}
                    onSave={(v) => onUpdateDetail?.({ pdfTitle: v })}
                    className="text-xs font-bold"
                  />
                </div>
                <button
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  تحميل PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Lesson Playlist Sidebar */}
        <div
          className="p-5 rounded-2xl shadow-sm border h-fit space-y-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: theme.radius.cardCss,
          }}
        >
          <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-3">
            <h3
              className="inline-flex items-center gap-1.5 text-sm font-black"
              style={{ color: colors.textPrimary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              قائمة دروس الوحدة ({playlistLessons.length > 0 ? playlistLessons.length : 6} دروس)
            </h3>
            {playlistLessons.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4F4] text-[#1F7A7B]">
                تفاعلية
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {playlistLessons.length > 0 ? (
              playlistLessons.map((item, idx) => {
                const isActive = item.id === currentLessonId;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectLesson?.(item.id)}
                    className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-[#EAF4F4] text-[#1F7A7B] font-black border-2 border-[#1F7A7B]/40 shadow-sm"
                        : "hover:bg-[#F7F8F9] text-[#4A5158] font-medium border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="flex h-2 w-2 rounded-full bg-[#2E9E5B] flex-shrink-0" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-[#8A929B] flex-shrink-0 fill-current" viewBox="0 0 24 24">
                          <polygon points="6 4 19 12 6 20 6 4" />
                        </svg>
                      )}
                      <span className="line-clamp-1">{idx + 1}. {item.title}</span>
                    </div>
                    <span className="text-[10px] opacity-75">
                      {isActive ? "نشط الآن" : item.duration || "فيديو"}
                    </span>
                  </button>
                );
              })
            ) : (
              <>
                <div className="p-3 rounded-xl bg-[#EAF4F4] text-[#1F7A7B] font-bold border border-[#CFE6E6] flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><span className="flex h-2 w-2 rounded-full bg-[#2E9E5B] flex-shrink-0" />1. مقدمة الأعداد المركبة</span>
                  <span className="text-[10px]">نشط الآن</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between">
                  <span>2. الشكل الجبري والشكل القطبي</span>
                  <span className="text-[10px]">38 د</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between">
                  <span>3. نظرية ديموافر وتطبيقاتها</span>
                  <span className="text-[10px]">45 د</span>
                </div>
                <div className="p-3 rounded-xl hover:bg-[#F7F8F9] text-[#4A5158] font-medium flex items-center justify-between opacity-60">
                  <span className="inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>4. الجذور التكعيبية للواحد الصحيح</span>
                  <span className="text-[10px]">مشتركين</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
