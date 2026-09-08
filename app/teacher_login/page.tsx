"use client";

import { useState } from "react";
import Link from "next/link";

export default function TeacherLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Simple validation
    if (!phone.trim()) {
      setErrorMessage("يرجى إدخال رقم الهاتف.");
      return;
    }
    if (!password) {
      setErrorMessage("يرجى إدخال كلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulation of teacher login auth call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري التوجيه إلى لوحة التحكم...");
      // In production, redirect to teacher dashboard here
    } catch {
      setErrorMessage("حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من البيانات والمحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[#F7F8F9] font-sans antialiased text-[#1C2126] selection:bg-[#CFE6E6] selection:text-[#0F4E4F]">
      
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-[#1F7A7B]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#E8A83C]/10 blur-3xl" />

      {/* Top Bar Header */}
      <header className="w-full border-b border-[#EEF0F2] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A7B] text-white shadow-sm shadow-[#1F7A7B]/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1C2126]">دُرُوس</span>
              <span className="text-[10px] font-medium text-[#1F7A7B]">منصة المعلمين في مصر</span>
            </div>
          </Link>

        </div>
      </header>

      {/* Main Login Content Card Area */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-6 shadow-xl shadow-[#1F7A7B]/5 sm:p-8">
            
            {/* Header Badge & Title */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-2xl bg-[#EAF4F4] p-3 text-[#1F7A7B] mb-3">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-[#1C2126] sm:text-3xl">
                تسجيل دخول المعلم
              </h1>
              <p className="mt-2 text-sm text-[#4A5158]">
                أدخل رقم الهاتف وكلمة المرور للدخول إلى لوحة التحكم الخاصة بك
              </p>
            </div>

            {/* Notification Alerts */}
            {errorMessage && (
              <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-[#D9483D]/10 p-4 text-xs font-medium text-[#D9483D]">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-[#2E9E5B]/10 p-4 text-xs font-medium text-[#2E9E5B]">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              
              {/* Phone Field (Without flag, Egyptian format) */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-[#1C2126] mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-[#1C2126] mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              {/* Extra Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A5158]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-[#D3D7DC] text-[#1F7A7B] focus:ring-[#1F7A7B]"
                  />
                  <span>تذكرني في هذا الجهاز</span>
                </label>

                <a
                  href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%86%D8%B3%D9%8A%D8%AA%20%D9%83%D9%84%D9%85%D8%A9%20%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%B1%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%83%D9%85%D8%B9%D9%84%D9%85"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1F7A7B] hover:underline"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F7A7B] py-4 text-base font-bold text-white shadow-lg shadow-[#1F7A7B]/20 transition-all hover:bg-[#166465] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Support Callout */}
            <div className="mt-8 pt-6 border-t border-[#EEF0F2] text-center text-xs text-[#8A929B]">
              <span>لا تملك حساب معلم بعد؟ </span>
              <a
                href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%AC%D8%AF%D9%8A%D8%AF"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#E8A83C] hover:underline"
              >
                تواصل معنا عبر واتساب للتفعيل الفوري
              </a>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#8A929B]">
        © {new Date().getFullYear()} دروس (Droos App). جميع الحقوق محفوظة.
      </footer>

    </div>
  );
}
