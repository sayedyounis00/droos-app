import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#EEF0F2] bg-[#1C2126] text-[#D3D7DC] pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F7A7B] text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">دُرُوس</span>
            </div>
            <p className="text-sm leading-relaxed text-[#8A929B]">
              منصة تعليمية تساعد المعلمين على إنشاء مساحتهم الخاصة لإدارة طلابهم ومحتواهم التعليمي بسهولة وأمان.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="transition-colors hover:text-[#7EB8B9]">عن المنصة</a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-[#7EB8B9]">كيف تعمل؟</a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-[#7EB8B9]">المميزات</a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-[#7EB8B9]">الأسئلة الشائعة</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">الدعم والخصوصية</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#7EB8B9]">تواصل معنا عبر واتساب</a>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#7EB8B9]">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#7EB8B9]">الشروط والأحكام</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Roles */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">الدخول للمنصة</h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D9%86%D8%B4%D8%A7%D8%A1%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D9%83%D9%85%D8%B9%D9%84%D9%85%20%D8%B9%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D8%B1%D9%88%D8%B3"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#E8A83C] px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-[#C88A22]"
              >
                تسجيل جديد كمعلم
              </a>
              <a
                href="#student-login"
                className="rounded-xl border border-[#3A8DDE] px-4 py-2.5 text-center text-xs font-bold text-[#3A8DDE] hover:bg-[#3A8DDE]/10"
              >
                تسجيل دخول طالب
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[#4A5158]/40 text-center text-xs text-[#8A929B]">
          © {new Date().getFullYear()} [دروس]. جميع الحقوق محفوظة.
        </div>

      </div>
    </footer>
  );
}
