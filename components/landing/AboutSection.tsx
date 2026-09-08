export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#F7F8F9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-lg bg-[#CFE6E6] px-3.5 py-1 text-xs font-bold text-[#0F4E4F]">
            رؤيتنا ورسالتنا
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            منصة مصممة خصيصًا للمعلمين لتسهيل التعليم
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4A5158] sm:text-lg">
            نوفر لك منصتك التعليمية الخاصة، حيث يمكنك تنظيم موادك التعليمية، ومتابعة طلابك، وإدارة كل شيء بسهولة تامة — دون الحاجة إلى خبرة تقنية. كل ما عليك فعله هو التسجيل، وسنهتم نحن بالباقي.
          </p>
        </div>

        {/* Feature Cards Comparison */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-8 shadow-xs transition-all hover:border-[#7EB8B9] hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4F4] text-[#1F7A7B] mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1C2126]">منصة تعليمية وليس متجراً</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4A5158]">
              نظامنا مبني كـ"منصة تعليمية" تُعنى بالتفاعل ومتابعة الدروس، وليس كمتجر إلكتروني معقد يشتت الطالب بأساليـب البيع والتسوق.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-8 shadow-xs transition-all hover:border-[#7EB8B9] hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF3E3] text-[#E8A83C] mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1C2126]">تسجيل فوري عبر واتساب</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4A5158]">
              لا داعي لاستكمال نماذج التسجيل المعقدة. تتواصل معنا عبر واتساب وسيتم إعداد وتجهيز حسابك كمعلم في دقائق معدودة.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-8 shadow-xs transition-all hover:border-[#7EB8B9] hover:shadow-md md:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4F4] text-[#3A8DDE] mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1C2126]">استقلالية ومرونة كاملة</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4A5158]">
              تحكم كامل في الملف الشخصي والمحتوى التعليمي والدروس المرفوعة مع مرونة تعديل البيانات والتخصصات في أي وقت.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
