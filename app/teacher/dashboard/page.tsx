"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TeacherUser } from "@/lib/auth/teacher-auth";
import DroosTableManager from "@/components/teacher/DroosTableManager";
import HomePageBuilder from "@/components/teacher/HomePageBuilder";

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [activeTab, setActiveTab] = useState<"account" | "droos" | "students" | "homepage">("account");
  const [showBuilder, setShowBuilder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Editable Account Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [grades, setGrades] = useState<string[]>([]);
  const [governorate, setGovernorate] = useState("");
  const [bio, setBio] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainLocked, setSubdomainLocked] = useState(false);

  useEffect(() => {
    // Hydrate teacher session from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("droos_teacher");
      let initialData: TeacherUser | null = null;

      if (stored) {
        try {
          initialData = JSON.parse(stored);
        } catch {
          initialData = null;
        }
      }

      if (initialData) {
        setTeacher(initialData);
        setName(initialData.name || "");
        setPhone(initialData.phone || "");
        setPassword(initialData.password || "");
        setSubject(initialData.subject || "");
        const safeGrades = Array.isArray(initialData.grades) 
          ? initialData.grades 
          : (typeof initialData.grades === 'string' && initialData.grades ? [initialData.grades] : []);
        setGrades(safeGrades);
        setGovernorate(initialData.governorate || "");
        setBio(initialData.bio || "");
        setSubdomain(initialData.subdomain || "");
        setSubdomainLocked(Boolean(initialData.subdomainLocked));
      } else {
        // If not logged in, redirect to login page
        window.location.href = "/teacher_login";
      }
    }
  }, []);


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("droos_teacher");
      document.cookie = "droos_teacher_session=; path=/; max-age=0;";
      window.location.href = "/teacher_login";
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/teacher/update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: teacher?.id,
          name,
          phone,
          password,
          subject,
          grades,
          governorate,
          bio,
          subdomain,
          currentSubdomain: teacher?.subdomain,
          subdomainLocked,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "حدث خطأ أثناء حفظ البيانات في قاعدة البيانات.");
        return;
      }

      const updated = data.teacher as TeacherUser;
      setTeacher(updated);
      setSubdomain(updated.subdomain || "");
      setSubdomainLocked(Boolean(updated.subdomainLocked));

      if (typeof window !== "undefined") {
        localStorage.setItem("droos_teacher", JSON.stringify(updated));
      }

      setToastMessage(data.message || "تم حفظ جميع بيانات الحساب بنجاح في قاعدة البيانات");
      setTimeout(() => setToastMessage(""), 4000);
    } catch {
      setErrorMessage("حدث خطأ في الاتصال بالخادم عند تحديث البيانات.");
    } finally {
      setIsSaving(false);
    }
  };

  // Full-page builder view — replaces dashboard entirely
  if (showBuilder) {
    return <HomePageBuilder onBack={() => setShowBuilder(false)} teacherGrades={teacher?.grades || grades} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9] font-sans antialiased text-[#1C2126]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[#EEF0F2] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A7B] text-white shadow-sm shadow-[#1F7A7B]/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="hidden sm:flex sm:flex-col">
                <span className="text-lg font-bold text-[#1C2126]">دُرُوس</span>
                <span className="text-[10px] font-medium text-[#1F7A7B]">لوحة تحكم المعلم</span>
              </div>
            </Link>
          </div>

          {/* Teacher Profile Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full bg-[#EAF4F4] py-1.5 px-3 border border-[#CFE6E6]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F7A7B] text-xs font-bold text-white">
                {teacher?.name?.charAt(0) || "أ"}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-[#0F4E4F]">{teacher?.name || "أحمد سعد"}</span>
                <span className="text-[10px] font-medium text-[#166465]">{teacher?.phone || "01143825523"}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-[#EEF0F2] bg-white py-2 px-3 text-xs font-bold text-[#D9483D] transition-colors hover:bg-[#D9483D]/5"
              title="تسجيل الخروج"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Header Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0F4E4F] via-[#1F7A7B] to-[#166465] p-6 sm:p-8 text-white shadow-xl shadow-[#1F7A7B]/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md mb-3">
                <span className="h-2 w-2 rounded-full bg-[#E8A83C] animate-pulse" />
                حساب معلم معتمد وموثق
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                أهلاً بك، {teacher?.name || "أحمد سعد"} 👋
              </h1>
              <p className="mt-1.5 text-sm text-white/80 max-w-xl">
                إدارة كاملة لبيانات الحساب الشخصي، النطاق الفرعي (Subdomain)، والدروس التعليمية.
              </p>
            </div>

            {/* Subdomain Active Preview Badge */}
            {subdomain ? (
              <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20 self-start md:self-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8A83C] text-white font-bold">
                  🔗
                </div>
                <div className="text-right dir-ltr">
                  <span className="block text-[10px] text-white/70 dir-rtl">رابط المنصة الفرعي الخاصة بك</span>
                  <a
                    href={`https://${subdomain}.droos.app`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-white underline hover:text-[#E8A83C]"
                  >
                    {subdomain}.droos.app
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 self-start md:self-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-bold">
                  🌐
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-white/70">النطاق الفرعي (Subdomain)</span>
                  <span className="text-xs font-bold text-[#F3C97C]">لم يتم التعيين بعد (يمكن تغييره مرة واحدة)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="mb-8 border-b border-[#EEF0F2] flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 rounded-2xl py-3 px-5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "account"
                ? "bg-[#1F7A7B] text-white shadow-md shadow-[#1F7A7B]/20"
                : "bg-white text-[#4A5158] hover:bg-[#EEF0F2]"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>بيانات الحساب والتحكم</span>
          </button>

          <button
            onClick={() => setActiveTab("droos")}
            className={`flex items-center gap-2 rounded-2xl py-3 px-5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "droos"
                ? "bg-[#1F7A7B] text-white shadow-md shadow-[#1F7A7B]/20"
                : "bg-white text-[#4A5158] hover:bg-[#EEF0F2]"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>الدروس والحصص</span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 rounded-2xl py-3 px-5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "students"
                ? "bg-[#1F7A7B] text-white shadow-md shadow-[#1F7A7B]/20"
                : "bg-white text-[#4A5158] hover:bg-[#EEF0F2]"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>الطلاب والمجموعات</span>
          </button>

          <button
            onClick={() => setShowBuilder(true)}
            className="flex items-center gap-2 rounded-2xl py-3 px-5 text-sm font-bold transition-all whitespace-nowrap bg-gradient-to-r from-[#E8A83C] to-[#C88A22] text-white shadow-md shadow-[#E8A83C]/30 hover:shadow-lg hover:shadow-[#E8A83C]/40 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>منشئ الصفحة الرئيسية</span>
          </button>
        </div>

        {/* Tab 1: Account Control (بيانات الحساب) */}
        {activeTab === "account" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Comprehensive Account Form Card */}
            <div className="lg:col-span-2 rounded-3xl border border-[#EEF0F2] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1C2126]">بيانات الحساب الشاملة</h2>
                  <p className="text-xs text-[#8A929B] mt-1">إدارة وتحكم كافة بيانات المعلم والنطاق الفرعي</p>
                </div>
                <span className="rounded-full bg-[#EAF4F4] px-3 py-1 text-xs font-bold text-[#1F7A7B]">
                  تحديث مباشر في قاعدة البيانات
                </span>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-6">
                
                {/* 1. Subdomain Section (Specific Rule: Edit Only ONE TIME) */}
                <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="subdomain" className="block text-xs font-bold text-[#0F4E4F]">
                      النطاق الفرعي الخاص بك (Subdomain)
                    </label>
                    {subdomainLocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#D9483D]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#D9483D]">
                        🔒 تم قفل الرابط (تعديل لمرة واحدة فقط)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8A83C]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#9C6B18]">
                        ✏️ متاح للتعديل لمرة واحدة فقط
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center dir-ltr">
                    <span className="absolute left-4 text-xs font-bold text-[#1F7A7B] select-none">
                      .droos.app
                    </span>
                    <input
                      id="subdomain"
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      disabled={subdomainLocked}
                      placeholder="e.g. ahmedsaad"
                      className={`w-full rounded-xl border py-3.5 pl-24 pr-4 text-sm font-bold outline-none transition-all ${
                        subdomainLocked
                          ? "border-[#D3D7DC] bg-[#EEF0F2] text-[#8A929B] cursor-not-allowed"
                          : "border-[#7EB8B9] bg-white text-[#0F4E4F] focus:border-[#1F7A7B] focus:ring-2 focus:ring-[#1F7A7B]/20"
                      }`}
                    />
                  </div>

                  {subdomainLocked ? (
                    <p className="text-[11px] font-medium text-[#4A5158] dir-rtl">
                      ⚠️ **الرابط مقفول:** لقد قمت بتعيين رابطك الفرعي مسبقاً. لتقديم طلب تغيير الرابط يرجى التواصل مع الدعم الفني عبر واتساب.
                    </p>
                  ) : (
                    <p className="text-[11px] font-medium text-[#C88A22] dir-rtl">
                      💡 **تنبيه هام:** يمكنك تغيير وتخصيص رابطك الفرعي **لمرة واحدة فقط**. بمجرد الضغط على "حفظ التعديلات" سيتفعل الرابط ويتم قفله تلقائياً.
                    </p>
                  )}

                  {subdomain && (
                    <div className="pt-2 border-t border-[#CFE6E6]/60 flex items-center justify-between text-xs dir-rtl">
                      <span className="text-[#0F4E4F] font-bold">معاينة الرابط الخاص بك:</span>
                      <a
                        href={`https://${subdomain}.droos.app`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#1F7A7B] underline hover:text-[#166465] dir-ltr"
                      >
                        https://{subdomain}.droos.app
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Personal & Profile Info Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">اسم المعلم الثلاثي</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="أحمد سعد علي"
                      className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">رقم الهاتف (مصر)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="01143825523"
                      className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 pr-4 pl-12 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A929B] hover:text-[#1F7A7B]"
                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.97 8.97 0 013.682-.787c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">المادة التخصصية</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="الرياضيات / الفيزياء"
                      className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                    />
                  </div>

                  {/* Educational Stages / Grades Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">المراحل التعليمية</label>
                    <div className="flex flex-col gap-2 rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] p-4 text-sm font-medium text-[#1C2126]">
                      {['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'].map((gradeOption) => (
                        <label key={gradeOption} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={grades.includes(gradeOption)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGrades([...grades, gradeOption]);
                              } else {
                                setGrades(grades.filter((g) => g !== gradeOption));
                              }
                            }}
                            className="h-4 w-4 rounded border-[#D3D7DC] text-[#1F7A7B] focus:ring-[#1F7A7B]"
                          />
                          <span>{gradeOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                  {/* Governorate */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-2">المحافظة</label>
                    <input
                      type="text"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      placeholder="القاهرة / الجيزة"
                      className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                    />
                  </div>

                </div>

                {/* Bio Description */}
                <div>
                  <label className="block text-xs font-bold text-[#1C2126] mb-2">نبذة عن المعلم والخبرة التدريسية</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="اكتب نبذة مختصرة تظهر للطلاب في صفحتك الشخصية..."
                    className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                  />
                </div>

                {/* Save Button */}
                <div className="flex flex-col gap-3 pt-4 border-t border-[#EEF0F2] sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-medium text-[#8A929B]">
                    سيتم تحديث البيانات مباشرة في قاعدة البيانات.
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {toastMessage && (
                      <div
                        role="status"
                        className="flex max-w-xs items-center gap-2 rounded-xl bg-[#2E9E5B] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#2E9E5B]/20"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{toastMessage}</span>
                      </div>
                    )}
                    {errorMessage && (
                      <div
                        role="alert"
                        className="flex max-w-xs items-center gap-2 rounded-xl bg-[#D9483D]/10 px-3 py-2 text-xs font-bold text-[#D9483D]"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 rounded-2xl bg-[#1F7A7B] py-3.5 px-7 text-sm font-bold text-white shadow-lg shadow-[#1F7A7B]/20 transition-all hover:bg-[#166465] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>جاري التحديث...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>حفظ التعديلات في قاعدة البيانات</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>

            {/* Comprehensive Profile Overview Side Card */}
            <div className="space-y-6">
              
              <div className="rounded-3xl border border-[#EEF0F2] bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#1C2126] mb-4 border-b border-[#EEF0F2] pb-3">ملخص الحساب في قاعدة البيانات</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">اسم المعلم:</span>
                    <span className="font-bold text-[#1C2126]">{teacher?.name || name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">رقم الهاتف:</span>
                    <span className="font-bold text-[#1C2126] dir-ltr">{teacher?.phone || phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">كلمة المرور:</span>
                    <span className="font-bold text-[#1C2126]">••••••••</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">المادة التخصصية:</span>
                    <span className="font-bold text-[#1F7A7B]">{teacher?.subject || subject}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#EEF0F2] last:border-0">
                    <span className="text-[#8A929B]">المراحل:</span>
                    <span className="font-bold text-[#1C2126] text-right">
                      {Array.isArray(teacher?.grades) && teacher.grades.length > 0
                        ? teacher.grades.join('، ')
                        : typeof teacher?.grades === 'string'
                        ? teacher.grades
                        : Array.isArray(grades)
                        ? grades.join('، ')
                        : grades}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">المحافظة:</span>
                    <span className="font-bold text-[#1C2126]">{teacher?.governorate || governorate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">النطاق الفرعي (Subdomain):</span>
                    {subdomain ? (
                      <span className="font-bold text-[#1F7A7B] dir-ltr">{subdomain}.droos.app</span>
                    ) : (
                      <span className="font-bold text-[#E8A83C]">غير محدد بعد</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
                    <span className="text-[#8A929B]">حالة قفل الرابط:</span>
                    {subdomainLocked ? (
                      <span className="font-bold text-[#D9483D]">مقفول 🔒</span>
                    ) : (
                      <span className="font-bold text-[#2E9E5B]">متاح للتعديل ✏️</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#8A929B]">حالة الحساب:</span>
                    <span className="font-bold text-[#2E9E5B]">نشط ومعتمد ✔</span>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="rounded-3xl bg-[#FDF3E3] border border-[#F3C97C] p-6 text-xs text-[#9C6B18]">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <svg className="h-5 w-5 text-[#E8A83C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>مساعدة الدعم الفني</span>
                </div>
                <p className="leading-relaxed mb-3 text-[#7A520C]">
                  إذا كنت ترغب في تغيير رابطك الفرعي بعد قفله أو ربط نطاق خاص (Custom Domain)، تواصل معنا عبر واتساب.
                </p>
                <a
                  href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%BA%D9%8A%D9%8A%D8%B1%20%D8%A7%D9%84%D9%86%D8%B7%D8%A7%D9%82%20%D8%A7%D9%84%D9%81%D8%B1%D8%B9%D9%8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#E8A83C] hover:underline"
                >
                  <span>طلب مساعدة من الدعم</span>
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Droos Table Manager */}
        {activeTab === "droos" && (
          <DroosTableManager teacherGrades={teacher?.grades && teacher.grades.length > 0 ? teacher.grades : grades} />
        )}

        {/* Tab 3: Students Placeholder */}
        {activeTab === "students" && (
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF3E3] text-[#E8A83C]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1C2126]">إدارة الطلاب والمجموعات الدراسية</h3>
            <p className="mt-2 text-sm text-[#8A929B] max-w-md mx-auto">
              ستتمكن قريباً من متابعة حضور وغياب الطلاب، الاشتراكات الشهرية، والواجبات المدرسية.
            </p>
          </div>
        )}



      </main>

    </div>
  );
}

