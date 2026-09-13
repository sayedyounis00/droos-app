"use client";

import { useState } from "react";

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
  { id: "hero", label: "القسم الرئيسي", icon: "🏠", color: "#1F7A7B" },
  { id: "about", label: "نبذة عني", icon: "👤", color: "#3A8DDE" },
  { id: "courses", label: "السنوات الدراسية", icon: "🎓", color: "#E8A83C" },
  { id: "testimonials", label: "آراء الطلاب", icon: "💬", color: "#2E9E5B" },
  { id: "contact", label: "التواصل", icon: "📞", color: "#D9483D" },
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
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const displayGrades = teacherGrades && teacherGrades.length > 0 ? teacherGrades : defaultTeachingYears;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9] flex flex-col" dir="rtl">

      {/* Builder Top Bar */}
      <div className="sticky top-0 z-40 bg-[#0F4E4F] text-white shadow-xl">
        <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Back + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold transition-colors"
            >
              <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">العودة للداشبورد</span>
            </button>
            <div>
              <h1 className="text-sm font-black tracking-tight">منشئ الصفحة الرئيسية</h1>
              <p className="text-[10px] text-white/60 hidden sm:block">صمّم صفحتك الشخصية كما تريد</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
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

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-[#E8A83C] hover:bg-[#C88A22] px-4 py-2 text-xs font-bold text-[#0F4E4F] transition-all active:scale-95 shadow-md shadow-[#E8A83C]/30"
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
                  <span>حفظ التغييرات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        // ── Full Preview Mode ──────────────────────────────────────────────────
        <div className="flex-1 overflow-auto">
          <PreviewPage data={data} teachingYears={displayGrades} />
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

          {/* Right: Live Mini-Preview */}
          <aside className="hidden xl:block xl:w-80 border-r border-[#EEF0F2] bg-white overflow-auto">
            <div className="p-4 border-b border-[#EEF0F2] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2126]">معاينة مباشرة</span>
              <span className="text-[10px] text-[#8A929B]">محدّثة تلقائياً</span>
            </div>
            <div className="transform scale-[0.45] origin-top-right w-[220%] pointer-events-none overflow-hidden">
              <PreviewPage data={data} teachingYears={displayGrades} />
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

// ─── Preview Page ─────────────────────────────────────────────────────────────

function PreviewPage({ data, teachingYears }: { data: HomePageData; teachingYears: string[] }) {
  return (
    <div dir="rtl" className="font-sans bg-[#F7F8F9] text-[#1C2126]" style={{ minWidth: 360 }}>

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A3536] via-[#0F4E4F] to-[#1F7A7B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:"radial-gradient(circle at 20% 50%, #E8A83C 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7EB8B9 0%, transparent 50%)"}} />
        <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-white/90 mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#E8A83C] animate-pulse" />
            {data.hero.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-5">
            {data.hero.headline}
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-8 leading-relaxed">
            {data.hero.subheadline}
          </p>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#E8A83C] hover:bg-[#C88A22] text-[#0A3536] font-black px-8 py-4 text-sm shadow-xl shadow-[#E8A83C]/30 transition-colors">
            {data.hero.ctaText}
            <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        {/* wave divider */}
        <svg viewBox="0 0 1440 60" className="w-full text-[#F7F8F9]" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
        </svg>
      </section>

      {/* 2. About Section */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-shrink-0 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1F7A7B] to-[#0F4E4F] text-4xl font-black text-white shadow-xl shadow-[#1F7A7B]/20">
            {data.about.name.charAt(0)}
          </div>
          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF4F4] px-3 py-1 text-xs font-bold text-[#1F7A7B] mb-3">
              {data.about.subject} · {data.about.experience}
            </div>
            <h2 className="text-2xl font-black text-[#0F4E4F] mb-3">{data.about.name}</h2>
            <p className="text-sm text-[#4A5158] leading-relaxed max-w-xl">{data.about.bio}</p>
          </div>
        </div>
      </section>

      {/* 3. Teaching Years Section (Static) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#1C2126] mb-2">السنوات والصفوف الدراسية</h2>
            <p className="text-sm text-[#8A929B]">الصفوف والمراحل المتاحة للتسجيل مع المعلم</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {teachingYears.map((year, i) => (
              <div key={i} className="rounded-3xl border border-[#EEF0F2] bg-[#F7F8F9] p-6 text-center hover:shadow-lg hover:border-[#7EB8B9] transition-all group">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4F4] text-2xl text-[#1F7A7B]">
                  🎓
                </div>
                <h3 className="text-base font-bold text-[#1C2126] mb-2">{year}</h3>
                <span className="inline-block rounded-full bg-[#EAF4F4] px-3 py-1 text-xs font-bold text-[#1F7A7B]">
                  متاح للتسجيل
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-[#EAF4F4] to-[#F7F8F9]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-black text-[#1C2126] text-center mb-10">{data.testimonials.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {data.testimonials.testimonials.map((t, i) => (
              <div key={i} className="rounded-3xl bg-white border border-[#EEF0F2] p-6 shadow-sm">
                <div className="text-[#E8A83C] text-xl mb-3">❝</div>
                <p className="text-sm text-[#4A5158] leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 border-t border-[#F7F8F9] pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF4F4] text-xs font-bold text-[#1F7A7B]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1C2126]">{t.name}</div>
                    <div className="text-[10px] text-[#8A929B]">{t.grade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section className="bg-[#0F4E4F] text-white py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-black mb-3">تواصل معنا</h2>
          <p className="text-sm text-white/70 mb-8">{data.contact.note}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${data.contact.phone}`}
              className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-bold transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {data.contact.phone}
            </a>
            <a
              href={`https://wa.me/${data.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-[#E8A83C] hover:bg-[#C88A22] text-[#0A3536] px-6 py-3.5 text-sm font-bold transition-colors shadow-lg shadow-[#E8A83C]/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              واتساب
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A3536] text-white/40 text-center text-xs py-6">
        مدعوم بواسطة <span className="text-white/70 font-bold">دُرُوس</span> — منصة التعليم الذكي
      </footer>
    </div>
  );
}
