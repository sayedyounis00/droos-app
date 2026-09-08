export default function TrustStats() {
  const stats = [
    { value: "+100", label: "معلم يعتمدون على المنصة", sub: "في مختلف التخصصات والمواد" },
    { value: "100%", label: "واجهة عربية متكاملة للمعلم", sub: "إدارة منظمة بأسلوب RTL" },
    { value: "0", label: "عمولات خفية أو تعقيدات متجر", sub: "مساحتك الخاصة وليست دكاناً" },
    { value: "24/7", label: "دعم فني مباشر للمعلمين", sub: "مساعدة عبر واتساب في أي وقت" },
  ];

  return (
    <section className="border-y border-[#EEF0F2] bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-[#1F7A7B] sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-bold text-[#1C2126]">
                {stat.label}
              </span>
              <span className="mt-1 text-xs text-[#8A929B]">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
