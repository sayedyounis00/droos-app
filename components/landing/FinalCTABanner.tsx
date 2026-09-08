export default function FinalCTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4E4F] via-[#1F7A7B] to-[#0A3536] py-16 md:py-24 text-white">
      
      {/* Background Decorative Blur Circles */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-[#E8A83C]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#7EB8B9]/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold text-[#FDF3E3] backdrop-blur-xs mb-4">
          ابدأ اليوم دون تأخير 🚀
        </span>

        <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          جاهز لإنشاء منصتك التعليمية الخاصة؟
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#CFE6E6] sm:text-lg">
          انضم الآن إلى مجتمع المعلمين وابدأ رحلتك في تنظيم دروسك ومتابعة طلابك بكل يسر وسهولة.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#E8A83C] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#E8A83C]/30 transition-all hover:bg-[#C88A22] active:scale-[0.98]"
          >
            <span>سجّل كمعلم الآن عبر واتساب</span>
            <svg className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <p className="mt-4 text-xs font-medium text-[#7EB8B9]">
          تفعيل سريع • بدون رسوم خفية • دعم مباشر 24/7
        </p>

      </div>
    </section>
  );
}
