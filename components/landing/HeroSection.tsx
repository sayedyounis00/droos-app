import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4F4]/50 via-[#F7F8F9] to-[#F7F8F9] pt-12 pb-20 md:pt-20 md:pb-28">
      
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-24 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-[#1F7A7B]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#E8A83C]/10 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Right Column (Content in RTL) */}
          <div className="animate-hero-entrance flex flex-col items-start lg:col-span-7">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7EB8B9]/40 bg-[#EAF4F4] px-4 py-1.5 text-xs font-semibold text-[#0F4E4F] shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#1F7A7B] animate-pulse" />
              <span>✨ المنصة الأبسط للمعلمين والطلاب في الوطن العربي</span>
            </div>

            {/* Main Headline H1 */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1C2126] sm:text-4xl md:text-5xl md:leading-[1.2]">
              منصتك التعليمية..  
              <span className="block mt-2 text-[#1F7A7B]">من التسجيل إلى النجاح في دقائق</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#4A5158] sm:text-lg">
              منصة متكاملة تتيح للمعلمين إنشاء منصتهم التعليمية الخاصة بسهولة، وإدارة الطلاب والمحتوى من مكان واحد دون الحاجة لأي خبرة تقنية.
            </p>

            {/* CTAs Group */}
            <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:w-auto">
              
              {/* Teacher Primary CTA */}
              <a
                href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#E8A83C] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#E8A83C]/25 transition-all hover:bg-[#C88A22] hover:shadow-xl active:scale-[0.98]"
              >
                <span>ابدأ الآن مجاناً — سجّل كمعلم</span>
                <svg className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              {/* Student Secondary CTA */}
              <Link
                href="#student-login"
                className="inline-flex items-center justify-center rounded-2xl border border-[#D3D7DC] bg-white px-6 py-4 text-base font-medium text-[#0F4E4F] shadow-xs transition-all hover:border-[#1F7A7B] hover:bg-[#EAF4F4]/50"
              >
                هل أنت طالب؟ سجّل دخولك
              </Link>
            </div>

            {/* Trust Micro-Note */}
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#8A929B]">
              <svg className="h-4 w-4 text-[#2E9E5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>التسجيل كمعلم يتم عبر واتساب خلال دقائق معدودة بدعم مباشر.</span>
            </div>

          </div>

          {/* Left Column (Interactive Mockup Card Preview) */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-[#EEF0F2] bg-white p-6 shadow-2xl shadow-[#1F7A7B]/10 lg:max-w-none">
              
              {/* Fake App Window Controls */}
              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#D9483D]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#E0A429]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#2E9E5B]/80" />
                </div>
                <span className="rounded-md bg-[#F7F8F9] px-3 py-1 text-[11px] font-mono text-[#8A929B]">
                  droos.app/teacher/dashboard
                </span>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="mt-6 space-y-4">
                
                {/* Header Profile Snippet */}
                <div className="flex items-center justify-between rounded-2xl bg-[#EAF4F4] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A7B] text-base font-bold text-white">
                      م.أ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F4E4F]">الأستاذ أحمد علي</h4>
                      <p className="text-xs text-[#166465]">معلم الرياضيات — الثانوية العامة</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#2E9E5B] shadow-xs">
                    ● متصل
                  </span>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-3.5 text-center">
                    <span className="block text-2xl font-black text-[#1F7A7B]">142</span>
                    <span className="text-xs font-medium text-[#4A5158]">طالب مسجّل</span>
                  </div>
                  <div className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-3.5 text-center">
                    <span className="block text-2xl font-black text-[#E8A83C]">18</span>
                    <span className="text-xs font-medium text-[#4A5158]">درس منشور</span>
                  </div>
                </div>

                {/* Course Item Preview */}
                <div className="rounded-2xl border border-[#D3D7DC]/60 p-4 transition-all hover:border-[#1F7A7B]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF3E3] text-[#E8A83C]">
                        📐
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[#1C2126]">الهندسة الفراغية — الفصل 1</h5>
                        <p className="text-xs text-[#8A929B]">12 فيديو • 4 اختبارات</p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-[#EAF4F4] px-2.5 py-1 text-xs font-semibold text-[#1F7A7B]">
                      نشط
                    </span>
                  </div>
                </div>

                {/* Action Floating Badge */}
                <div className="flex items-center justify-between rounded-xl bg-[#0A3536] p-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[#E8A83C]" />
                    <span className="text-xs font-medium">تم انضمام طالب جديد قبل 3 دقائق</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#F3C97C]">عرض</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
