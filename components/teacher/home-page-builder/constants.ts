import type {
  HomePageData,
  ModulesPageData,
  LessonsPageData,
  LessonDetailData,
  SectionConfig,
  PageConfig,
} from "./types";

// ─── Default Page Data ────────────────────────────────────────────────────────

export const defaultData: HomePageData = {
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
    title: "تواصل معنا",
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

export const defaultTeachingYears = [
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

// ─── Section & Page Navigation ────────────────────────────────────────────────

export const SECTIONS: readonly SectionConfig[] = [
  { id: "hero", label: "القسم الرئيسي", icon: "home" },
  { id: "about", label: "نبذة عني", icon: "user" },
  { id: "courses", label: "السنوات الدراسية", icon: "graduation-cap" },
  { id: "testimonials", label: "آراء الطلاب", icon: "message-square" },
  { id: "contact", label: "التواصل", icon: "phone" },
];

export const PAGES: readonly PageConfig[] = [
  { id: "home", label: "الصفحة الرئيسية", icon: "home", subtitle: "واجهة الهبوط العامة" },
  { id: "modules", label: "جميع الكورسات والوحدات", icon: "book-open", subtitle: "فهرس الكورسات والوحدات الدراسية" },
  { id: "lessons", label: "جميع الدروس والتمارين", icon: "play", subtitle: "مكتبة الدروس المتاحة للطلاب" },
  { id: "lesson-detail", label: "معاينة الدرس ومشغل الفيديو", icon: "tv", subtitle: "شاشة مشاهدة الدرس والملحقات" },
];

// ─── Default Preview Data (fallback when no real DB data is loaded) ───────────

export const defaultModulesData: ModulesPageData = {
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

export const defaultLessonsData: LessonsPageData = {
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

export const defaultLessonDetailData: LessonDetailData = {
  title: "الدرس الأول: مقدمة في الأعداد المركبة والعمليات الأساسية",
  moduleName: "وحدة الجبر والهندسة الفضائية — الصف الثالث الثانوي",
  description: "في هذا الدرس نستعرض المفاهيم التأسيسية للأعداد المركبة، العدد التخيلي i، وقواعد الجمع والضرب والمرافق للجذور التربيعية السالبة.",
  teacherNote: "تأكد من حل ملخص تمارين PDF قبل الانتقال للدرس القادم لضمان فهم التمارين المعقدة.",
  pdfTitle: "ملخص الدرس والملحق التدريبي (PDF - 2.4 MB)",
};
