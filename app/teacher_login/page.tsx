"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Spinner } from "@/components/ui/Spinner";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await fetch("/api/auth/teacher-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من البيانات.");
        return;
      }

      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري التوجيه إلى لوحة التحكم...");
      
      // Store session in localStorage for fast UI hydration
      if (data.teacher) {
        localStorage.setItem("droos_teacher", JSON.stringify(data.teacher));
      }

      const redirectTo = data.redirectTo || "/teacher/dashboard";
      setTimeout(() => {
        router.push(redirectTo);
      }, 600);
    } catch {
      setErrorMessage("حدث خطأ في الاتصال بالخادم. يرجى التأكد من الاتصال بالمواصفات والمحاولة مجدداً.");
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
          <Logo href="/" subtitle="منصة المعلمين في مصر" />
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
              
              {/* Phone Field */}
              <FormInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                label="رقم الهاتف"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              {/* Password Field */}
              <PasswordInput
                id="password"
                name="password"
                label="كلمة المرور"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

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
                    <Spinner size="md" className="text-white" />
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
