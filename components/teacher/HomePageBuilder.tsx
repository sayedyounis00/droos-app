"use client";

import { useState } from "react";
import {
  PLATFORM_THEMES,
  THEME_LIST,
  ThemeId,
  PlatformTheme,
} from "@/lib/themes";

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

interface HomePageData {
  hero: HeroSection;
  about: AboutSection;
  testimonials: TestimonialsSection;
  contact: ContactSection;
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
};

const defaultTeachingYears = [
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

// ─── Section Icons ────────────────────────────────────────────────────────────

const sections = [
  { id: "hero", label: "القسم الرئيسي", icon: "🏠" },
  { id: "about", label: "نبذة عني", icon: "👤" },
  { id: "courses", label: "السنوات الدراسية", icon: "🎓" },
  { id: "testimonials", label: "آراء الطلاب", icon: "💬" },
  { id: "contact", label: "التواصل", icon: "📞" },
] as const;

type SectionId = (typeof sections)[number]["id"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePageBuilder({
  onBack,
  teacherGrades,
}: {
  onBack: () => void;
  teacherGrades?: string[];
}) {
  const [data, setData] = useState<HomePageData>(defaultData);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [previewMode, setPreviewMode] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>("horizon");
  const [showThemePicker, setShowThemePicker] = useState(false);
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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
                منشئ الصفحة الرئيسية
              </h1>
              <p className="text-[10px] text-white/60 hidden md:block">صمّم هوية منصتك المعمارية وشاهد التغيير مباشر</p>
            </div>
          </div>

          {/* Center: Theme Selector Dropdown Trigger in Header */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 text-xs font-bold transition-all shadow-inner"
            >
              <span className="text-sm">🎨</span>
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
                      <span>🎨</span> اختر هُوية المنصة (5 ثيمات مخصصة)
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

          {/* Right: Preview Actions & Mode Toggle */}
          <div className="flex items-center gap-2">
            
            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                previewMode
                  ? "bg-[#E8A83C] text-[#0F4E4F]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">{previewMode ? "إغلاق المعاينة" : "معاينة"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-[#E8A83C] hover:bg-[#C88A22] px-3.5 py-2 text-xs font-bold text-[#0F4E4F] transition-all active:scale-95 shadow-md shadow-[#E8A83C]/30"
            >
              {saved ? (
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
                  <span>حفظ</span>
                </>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Awesome Interactive Edit Dialog */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EEF0F2] transition-all transform scale-100">
            <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF4F4] text-lg text-[#1F7A7B]">
                  ✏️
                </span>
                <div>
                  <h3 className="text-base font-black text-[#1C2126]">{editModal.title}</h3>
                  <p className="text-xs text-[#8A929B]">{editModal.label}</p>
                </div>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8F9] text-[#8A929B] hover:bg-[#EEF0F2] hover:text-[#1C2126] transition-colors"
              >
                ✕
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
                <span>حفظ التعديل</span>
                <span>✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {previewMode ? (
        // ── Full Preview Mode ──────────────────────────────────────────────────
        <div className="flex-1 overflow-auto">
          {/* Helpful interactive hint banner */}
          <div className="bg-[#1F7A7B] text-white px-4 py-2.5 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">💡</span>
              <span>تعديل مباشر: انقر على أي نص في المعاينة لتعديله فوراً عبر النافذة التفاعلية!</span>
            </div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
              وضع التعديل بالنقر نشط ✨
            </span>
          </div>

          <PreviewPage
            data={data}
            teachingYears={displayGrades}
            theme={currentTheme}
            onEditText={(config) => setEditModal(config)}
            onUpdateHero={handleUpdateHero}
            onUpdateAbout={handleUpdateAbout}
            onUpdateTestimonialsTitle={handleUpdateTestimonialsTitle}
            onUpdateTestimonial={handleUpdateTestimonial}
            onUpdateContact={handleUpdateContact}
          />
        </div>
      ) : (
        // ── Editor Mode ────────────────────────────────────────────────────────
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

          {/* Left: Section Navigator */}
          <aside className="lg:w-56 border-b lg:border-b-0 lg:border-l border-[#EEF0F2] bg-white flex-shrink-0">
            <div className="flex lg:flex-col gap-1 p-3 overflow-x-auto lg:overflow-x-visible">
              <p className="hidden lg:block text-[10px] font-bold text-[#8A929B] uppercase tracking-widest px-2 mb-2">
                أقسام الصفحة
              </p>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-all whitespace-nowrap ${
                    activeSection === sec.id
                      ? "bg-[#EAF4F4] text-[#1F7A7B] shadow-sm"
                      : "text-[#4A5158] hover:bg-[#F7F8F9]"
                  }`}
                >
                  <span className="text-base">{sec.icon}</span>
                  <span className="hidden sm:inline">{sec.label}</span>
                </button>
              ))}

              {/* Theme quick status box in sidebar */}
              <div className="hidden lg:block mt-6 p-3 rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] text-xs">
                <span className="block text-[10px] font-bold text-[#8A929B] mb-1">الثيم النشط:</span>
                <div className="font-bold text-[#1C2126] flex items-center justify-between">
                  <span>{currentTheme.nameAr}</span>
                  <div className="flex gap-1 dir-ltr">
                    {currentTheme.swatches.slice(0, 3).map((hex, i) => (
                      <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#5C646B] mt-1 line-clamp-2">{currentTheme.mood}</p>
              </div>

            </div>
          </aside>

          {/* Center: Editor Panel */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {activeSection === "hero" && (
              <HeroEditor data={data.hero} onChange={(hero) => setData({ ...data, hero })} />
            )}
            {activeSection === "about" && (
              <AboutEditor data={data.about} onChange={(about) => setData({ ...data, about })} />
            )}
            {activeSection === "courses" && (
              <TeachingYearsEditor grades={displayGrades} />
            )}
            {activeSection === "testimonials" && (
              <TestimonialsEditor data={data.testimonials} onChange={(testimonials) => setData({ ...data, testimonials })} />
            )}
            {activeSection === "contact" && (
              <ContactEditor data={data.contact} onChange={(contact) => setData({ ...data, contact })} />
            )}
          </div>

          {/* Right: Live Mini-Preview Panel */}
          <aside className="hidden xl:block xl:w-96 border-r border-[#EEF0F2] bg-white overflow-auto flex-shrink-0">
            <div className="p-3 border-b border-[#EEF0F2] flex items-center justify-between bg-[#F7F8F9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C2126]">معاينة مباشرة</span>
                <span className="rounded-full bg-[#1F7A7B]/10 text-[#1F7A7B] text-[10px] font-bold px-2 py-0.5">
                  {currentTheme.nameAr}
                </span>
              </div>
            </div>
            <div className="transform scale-[0.46] origin-top-right w-[217%] pointer-events-none overflow-hidden shadow-inner">
              <PreviewPage
                data={data}
                teachingYears={displayGrades}
                theme={currentTheme}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function EditorCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F4] text-xl">{icon}</span>
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
    <EditorCard title="القسم الرئيسي (Hero)" icon="🏠">
      <InputField label="الشارة التعريفية (Badge)" value={data.badge} onChange={(v) => onChange({ ...data, badge: v })} placeholder="نتائج مضمونة..." />
      <InputField label="العنوان الرئيسي" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} placeholder="تعلّم بطريقة مختلفة..." />
      <InputField label="النص التوضيحي" value={data.subheadline} onChange={(v) => onChange({ ...data, subheadline: v })} placeholder="وصف مختصر..." multiline />
      <InputField label="نص زر التسجيل" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} placeholder="سجّل الآن" />
    </EditorCard>
  );
}

function AboutEditor({ data, onChange }: { data: AboutSection; onChange: (d: AboutSection) => void }) {
  return (
    <EditorCard title="نبذة عني (About)" icon="👤">
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
    <EditorCard title="السنوات والصفوف الدراسية (قسم ثابت)" icon="🎓">
      <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/60 p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#0F4E4F] font-bold text-sm">
          <span>🔒 هذا القسم ثابت ومربوط ببيانات الحساب</span>
        </div>
        <p className="text-xs text-[#4A5158] leading-relaxed">
          يتم عرض السنوات والصفوف الدراسية الخاصة بالمعلم تلقائياً من بيانات الحساب، ولا يمكن تعديل الدروس أو الكورسات الفردية من هنا.
        </p>
        <div className="pt-3 border-t border-[#CFE6E6]">
          <span className="block text-xs font-bold text-[#1C2126] mb-3">الصفوف الدراسية المتاحة حالياً:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {grades.map((grade, idx) => (
              <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-white border border-[#7EB8B9] p-3 text-xs font-bold text-[#1F7A7B] shadow-sm">
                <span className="text-base">🎓</span>
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
    <EditorCard title="آراء الطلاب" icon="💬">
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
    <EditorCard title="معلومات التواصل" icon="📞">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="رقم الهاتف" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="01143825523" />
        <InputField label="رقم واتساب" value={data.whatsapp} onChange={(v) => onChange({ ...data, whatsapp: v })} placeholder="01143825523" />
      </div>
      <InputField label="ملاحظة التواصل" value={data.note} onChange={(v) => onChange({ ...data, note: v })} multiline placeholder="أوقات التواصل والمواعيد..." />
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
        ✏️ تعديل
      </span>
    </Component>
  );
}

// ─── Preview Page Component ───────────────────────────────────────────────────

function PreviewPage({
  data,
  teachingYears,
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
                  🎓
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
                <div className="text-xl mb-3" style={{ color: colors.accent }}>
                  ❝
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
