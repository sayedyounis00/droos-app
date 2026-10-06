import { useState, useEffect, useCallback } from "react";
import type { ThemeId } from "@/lib/themes";
import type { TeacherUser } from "@/lib/auth/teacher-auth";
import type {
  HomePageData,
  HeroSection,
  AboutSection,
  ContactSection,
  PageHeadingConfig,
  LessonDetailConfig,
} from "../types";
import { defaultData, defaultModulesData, defaultLessonsData } from "../constants";

interface UseHomePageDataOptions {
  teacher?: TeacherUser | null;
}

export function useHomePageData({ teacher }: UseHomePageDataOptions = {}) {
  // Build teacher-aware default values
  const teacherDefaultData: HomePageData = {
    ...defaultData,
    hero: {
      ...defaultData.hero,
      subheadline: teacher?.bio
        ? teacher.bio
        : "دروس متخصصة لطلاب المرحلة الثانوية — شرح واضح، ومتابعة حقيقية.",
    },
    about: {
      ...defaultData.about,
      name: teacher?.name ?? "اسم المعلم",
      subject: teacher?.subject ?? "المادة التخصصية",
      bio: teacher?.bio ?? "نبذة مختصرة عن المعلم وخبراته التعليمية.",
    },
  };

  const storageKey = teacher?.id ? `droos_homepage_${teacher.id}` : null;

  // Restore saved data from localStorage
  const [data, setData] = useState<HomePageData>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.homePageData) return { ...teacherDefaultData, ...parsed.homePageData };
        }
      } catch (err) {
        console.warn("Failed to parse cached homepage settings from localStorage:", err);
      }
    }
    return teacherDefaultData;
  });

  // Restore saved theme from localStorage
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.themeId) return parsed.themeId as ThemeId;
        }
      } catch (err) {
        console.warn("Failed to parse cached theme from localStorage:", err);
      }
    }
    return "horizon";
  });

  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Restore saved settings from Database
  useEffect(() => {
    let isMounted = true;

    const loadSavedSettings = async () => {
      try {
        const res = await fetch(`/api/teacher/homepage`);
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
  }, []);

  const handleSave = useCallback(async () => {
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
      const res = await fetch("/api/teacher/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    } catch (err) {
      console.error("Failed to save homepage:", err);
      setSaveMessage("تم الحفظ محلياً (تعذر الاتصال بالخادم)");
    } finally {
      setIsSaving(false);
      setShowSaveConfirmation(true);
      setTimeout(() => {
        setShowSaveConfirmation(false);
        setSaveMessage(null);
      }, 4000);
    }
  }, [data, selectedThemeId, storageKey]);

  const handleUpdateHero = useCallback((updated: Partial<HeroSection>) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...updated } }));
  }, []);

  const handleUpdateAbout = useCallback((updated: Partial<AboutSection>) => {
    setData((prev) => ({ ...prev, about: { ...prev.about, ...updated } }));
  }, []);

  const handleUpdateContact = useCallback((updated: Partial<ContactSection>) => {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, ...updated } }));
  }, []);

  const handleUpdateModulesPage = useCallback((updated: Partial<PageHeadingConfig>) => {
    setData((prev) => ({
      ...prev,
      modulesPage: {
        title: updated.title ?? prev.modulesPage?.title ?? defaultModulesData.title,
        subtitle: updated.subtitle ?? prev.modulesPage?.subtitle ?? defaultModulesData.subtitle,
      },
    }));
  }, []);

  const handleUpdateLessonsPage = useCallback((updated: Partial<PageHeadingConfig>) => {
    setData((prev) => ({
      ...prev,
      lessonsPage: {
        title: updated.title ?? prev.lessonsPage?.title ?? defaultLessonsData.title,
        subtitle: updated.subtitle ?? prev.lessonsPage?.subtitle ?? defaultLessonsData.subtitle,
      },
    }));
  }, []);

  const handleUpdateLessonDetailPage = useCallback((updated: Partial<LessonDetailConfig>) => {
    setData((prev) => ({
      ...prev,
      lessonDetailPage: {
        ...prev.lessonDetailPage,
        ...updated,
      },
    }));
  }, []);

  return {
    data,
    setData,
    selectedThemeId,
    setSelectedThemeId,
    showSaveConfirmation,
    isSaving,
    saveMessage,
    showThemePicker,
    setShowThemePicker,
    handleSave,
    handleUpdateHero,
    handleUpdateAbout,
    handleUpdateContact,
    handleUpdateModulesPage,
    handleUpdateLessonsPage,
    handleUpdateLessonDetailPage,
  };
}
