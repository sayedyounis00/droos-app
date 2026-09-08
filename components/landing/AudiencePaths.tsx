"use client";

import Link from "next/link";

export default function AudiencePaths() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EEF0F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-lg bg-[#CFE6E6] px-3.5 py-1 text-xs font-bold text-[#0F4E4F]">
            لمن هذه المنصة؟
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            تجربة مخصصة لكل من المعلم والطالب
          </h2>
          <p className="mt-3 text-base text-[#4A5158]">
            اختر مسارك للبدء فوراً في المنصة بسهولة ووضوح.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          
          {/* Teacher Card */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#1F7A7B] bg-gradient-to-b from-[#EAF4F4]/40 to-white p-8 md:p-10 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#1F7A7B] px-4 py-1 text-xs font-bold text-white">
                  مسار المعلم 👨‍🏫
                </span>
                <span className="text-xs font-bold text-[#1F7A7B]">تفعيل عبر واتساب</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C2126]">
                أنشئ منصتك التعليمية الخاصة
              </h3>
              <p className="mt-3 text-sm text-[#4A5158] leading-relaxed">
                مصممة للمعلمين الراغبين في إنشاء بيئة تعليمية مستقلة تنظم دوراتهم وطلابهم دون تعقيد تقني أو عمولات خفية.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>إنشاء الحساب والتفعيل الفوري خلال دقائق.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>إمكانية تعديل الملف الشخصي وإضافة التخصص لاحقاً.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>لوحة تحكم كاملة لإدارة الطلاب والدروس والمواد.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#EEF0F2]">
              <a
                href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8A83C] py-4 text-center text-base font-bold text-white shadow-md transition-all hover:bg-[#C88A22]"
              >
                <span>سجّل كمعلم الآن عبر واتساب</span>
                <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Student Card */}
          <div id="student-login" className="relative flex flex-col justify-between rounded-3xl border-2 border-[#3A8DDE] bg-gradient-to-b from-[#3A8DDE]/5 to-white p-8 md:p-10 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#3A8DDE] px-4 py-1 text-xs font-bold text-white">
                  مسار الطالب 🎓
                </span>
                <span className="text-xs font-bold text-[#3A8DDE]">دخول برقم الهاتف</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C2126]">
                تعلّم من معلميك المفضلين
              </h3>
              <p className="mt-3 text-sm text-[#4A5158] leading-relaxed">
                مساحة سهلة ومباشرة للطلاب الباحثين عن محتوى منظّم من معلميهم المفضلين للوصول السريع للدروس والمواد.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3A8DDE] text-xs text-white">✓</span>
                  <span>دخول آمن وسريع باستخدام رقم الهاتف وكلمة المرور.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3A8DDE] text-xs text-white">✓</span>
                  <span>وصول سلس للمواد الدراسية والمناهج المرفوعة.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3A8DDE] text-xs text-white">✓</span>
                  <span>واجهة خالية من الإعلانات والمشتتات الخارجية.</span>
                </li>
              </ul>
            </div>

            {/* Student Login Form Prototype */}
            <div className="mt-8 pt-6 border-t border-[#EEF0F2]">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <div>
                  <input
                    type="tel"
                    placeholder="رقم الهاتف (مثال: 0501234567)"
                    className="w-full rounded-xl border border-[#D3D7DC] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#3A8DDE] focus:ring-2 focus:ring-[#3A8DDE]/20"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    className="w-full rounded-xl border border-[#D3D7DC] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#3A8DDE] focus:ring-2 focus:ring-[#3A8DDE]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3A8DDE] py-3.5 text-center text-base font-bold text-white shadow-md transition-all hover:bg-[#2B77C0]"
                >
                  تسجيل دخول الطالب
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
