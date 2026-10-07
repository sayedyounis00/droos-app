export default function FeaturesGrid() {
  const features = [
    {
      icon: "🔑",
      title: "تفعيل سريع كمعلم",
      desc: "إنشاء وتفعيل حساب المعلم مباشرة عبر واتساب بدون تعقيدات أو تذكر كلمات مرور مفقودة.",
    },
    {
      icon: "🎓",
      title: "منصتك الخاصة المستقلة",
      desc: "مساحتك المستقلة بالكامل لإدارة المحتوى التعليمي والدروس بما يتوافق مع أسلوبك.",
    },
    {
      icon: "📚",
      title: "إدارة المحتوى المنهجي",
      desc: "أضف الدروس والمواد المطبوعة والمقاطع وتنظيم المناهج والدورات بكل مرونة.",
    },
    {
      icon: "👥",
      title: "متابعة انضمام الطلاب",
      desc: "شاهد انضمام الطلاب لقاعتك، وتابع حضورهم وتقدمهم الدراسي من لوحة تحكم واحدة.",
    },
    {
      icon: "🔒",
      title: "حماية وأمان المحتوى",
      desc: "تقنيات حديثة وتشفير آمن لحفظ بياناتك ومحتواك التعليمي وملفاتك الدراسية.",
    },
    {
      icon: "⚡",
      title: "أداء سريع على جميع الأجهزة",
      desc: "سريعة الاستجابة على الجوال والتابلت والكمبيوتر دون أي بطء أو انقطاع.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#F7F8F9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-lg bg-[#EAF4F4] px-3.5 py-1 text-xs font-bold text-[#0F4E4F]">
            مميزات المعلم
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            كل ما يحتاجه المعلم لإدارة منصته في مكان واحد
          </h2>
          <p className="mt-3 text-base text-[#4A5158]">
            أدوات متوازنة مصممة خصيصاً لتمنحك كمعلم الأداء العالي والسهولة التامة.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group flex flex-col rounded-3xl border border-[#EEF0F2] bg-white p-8 transition-all hover:border-[#1F7A7B] hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4F4] text-2xl transition-transform group-hover:scale-110">
                {feat.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#1C2126]">
                {feat.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5158]">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
