export default function AudiencePaths() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EEF0F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-lg bg-[#CFE6E6] px-3.5 py-1 text-xs font-bold text-[#0F4E4F]">
            لماذا تختار "دروس"؟
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            بيئة مخصصة بالكامل لنجاح المعلم
          </h2>
          <p className="mt-3 text-base text-[#4A5158]">
            صُمّمت المنصة لتلبي كافة متطلبات المعلم العصرية دون أي تعقيد.
          </p>
        </div>

        {/* Dual Value Proposition Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          
          {/* Card 1: Independence & Control */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#1F7A7B] bg-gradient-to-b from-[#EAF4F4]/40 to-white p-8 md:p-10 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#1F7A7B] px-4 py-1 text-xs font-bold text-white">
                  استقلالية كاملة 🎓
                </span>
                <span className="text-xs font-bold text-[#1F7A7B]">تحكم مطلق</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C2126]">
                منصتك الخاصة بهويتك وتخصصك
              </h3>
              <p className="mt-3 text-sm text-[#4A5158] leading-relaxed">
                احصل على بيئة خاصة يمكنك من خلالها تنظيم دروسك وموادك وتخصصك الدراسي، وتحديد المناهج كما يتناسب مع أسلوبك في التدريس.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>دون تكاليف تأسيس أو عمولات خفية.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>إمكانية تعديل البيانات الشخصية والتخصصات في أي وقت.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E5B] text-xs text-white">✓</span>
                  <span>لوحة تحكم سهلة وسريعة لمتابعة كافة طلابك.</span>
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

          {/* Card 2: Quick Onboarding & Support */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#1F7A7B]/40 bg-gradient-to-b from-[#1F7A7B]/5 to-white p-8 md:p-10 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#0F4E4F] px-4 py-1 text-xs font-bold text-white">
                  سهولة التأسيس 🚀
                </span>
                <span className="text-xs font-bold text-[#1F7A7B]">دعم مباشر</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C2126]">
                تفعيل سريع ومساعدة متواصلة
              </h3>
              <p className="mt-3 text-sm text-[#4A5158] leading-relaxed">
                لا داعي للقلق بشأن الإعدادات التقنية المعقدة، يتواصل معك فريقنا مباشرة لمساعدتك في إعداد وتجهيز حسابك في أسرع وقت.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F7A7B] text-xs text-white">✓</span>
                  <span>تواصل مباشر عبر واتساب لإنهاء إجراءات التفعيل.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F7A7B] text-xs text-white">✓</span>
                  <span>مساعدة متواصلة في رفع وتنظيم دروسك الأولى.</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#1C2126]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F7A7B] text-xs text-white">✓</span>
                  <span>واجهة خفيفة وسريعة تعمل بكفاءة على كافة الهواتف.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#EEF0F2]">
              <a
                href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#1F7A7B] bg-[#EAF4F4] py-4 text-center text-base font-bold text-[#0F4E4F] transition-all hover:bg-[#1F7A7B] hover:text-white"
              >
                <span>استفسر عبر واتساب فوراً</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
