export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: "💬",
      title: "تواصل معنا عبر واتساب",
      desc: "خطوة واحدة فقط لإنشاء وتفعيل حساب المعلم الخاص بك مباشرة.",
    },
    {
      step: "02",
      icon: "👤",
      title: "أكمل بيانات ملفك الشخصي",
      desc: "أضف معلوماتك، تخصصك الدراسي، وصورتك الشخصية في أي وقت يناسبك.",
    },
    {
      step: "03",
      icon: "🚀",
      title: "أنشئ منصتك وابدأ التدريس",
      desc: "أضف دروسك وموادك التعليمية، واستقبل طلابك فوراً بكل سهولة.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-[#EEF0F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-lg bg-[#FDF3E3] px-3.5 py-1 text-xs font-bold text-[#9C6B18]">
            طريقة العمل
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            ابدأ في 3 خطوات بسيطة
          </h2>
          <p className="mt-3 text-base text-[#4A5158]">
            صممنا العملية لتكون أسرع وأبسط تجربة إعداد معلم في الوطن العربي.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-start rounded-3xl border border-[#EEF0F2] bg-[#F7F8F9] p-8 transition-all hover:bg-white hover:border-[#1F7A7B] hover:shadow-xl"
            >
              {/* Step Badge */}
              <div className="flex w-full items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-3xl font-black text-[#CFE6E6]">{item.step}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#1C2126]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5158]">
                {item.desc}
              </p>

              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#1F7A7B]">
                <span>خطوة سهلة وآمنة</span>
                <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base font-bold text-[#1F7A7B] hover:underline"
          >
            <span>هل لديك سؤال حول خطوات التفعيل؟ تواصل معنا فوراً</span>
            <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
