"use client";

import { useState } from "react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "هل التسجيل مجاني كمعلم؟",
      a: "نعم، يمكنك التسجيل كمعلم مجاناً وبدء تجربة المنصة وتنظيم دروسك دون أي رسوم تأسيس خفية.",
    },
    {
      q: "كيف يتم تفعيل حساب المعلم؟",
      a: "تواصل معنا مباشرة عبر واتساب، وسيساعدك فريقنا في إعداد وتفعيل مساحتك التعليمية خلال دقائق معدودة.",
    },
    {
      q: "كيف يسجل الطالب دخوله للمنصة؟",
      a: "يسجل الطالب دخوله بسهولة من خلال إدخال رقم هاتفه وكلمة المرور الخاصة به للوصول الفوري لدروس معلمه.",
    },
    {
      q: "هل يمكنني إكمال بيانات ملفي الشخصي لاحقاً؟",
      a: "نعم، يمكن للمعلم إكمال وتحديث كافة بياناته الشخصية والتخصصية والصورة التعريفية في أي وقت بعد التفعيل.",
    },
    {
      q: "هل المنصة مناسبة لجميع المواد التعليمية والمراحل؟",
      a: "نعم، المنصة مرنة وتستوعب جميع التخصصات والمراحل والمواد الدراسية أياً كان نوع المحتوى المراد مشاركته.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#F7F8F9]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-lg bg-[#EAF4F4] px-3.5 py-1 text-xs font-bold text-[#0F4E4F]">
            الإجابات الشائعة
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-[#1C2126] sm:text-4xl">
            أسئلة شائعة
          </h2>
          <p className="mt-3 text-base text-[#4A5158]">
            إليك الإجابات عن أكثر الاستفسارات شيوعاً بين المعلمين والطلاب.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#EEF0F2] bg-white transition-all hover:border-[#7EB8B9]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-right font-bold text-[#1C2126] sm:p-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF4F4] text-[#1F7A7B] transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#1F7A7B] text-white" : ""
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 text-sm leading-relaxed text-[#4A5158] sm:px-6">
                    <p className="border-t border-[#EEF0F2] pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
