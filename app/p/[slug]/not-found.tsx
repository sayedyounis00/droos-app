import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function PlatformNotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8F9] flex items-center justify-center p-6 text-center"
    >
      <div className="max-w-md w-full rounded-3xl bg-white border border-[#EEF0F2] p-8 sm:p-10 shadow-sm space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9483D]/10 text-[#D9483D]">
          <Icon name="alert-triangle" size={32} strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#1C2126]">
            عذراً، هذه المنصة غير متوفرة
          </h2>
          <p className="text-xs sm:text-sm text-[#8A929B] leading-relaxed">
            الرابط الذي تحاول الوصول إليه غير مسجل، أو ربما لم يقم المعلم بنشر صفحته التعليمية بعد.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl bg-[#1F7A7B] text-white shadow-md hover:bg-[#166465] transition-all"
          >
            <Icon name="home" size={14} />
            <span>العودة إلى الصفحة الرئيسية لمنصة دروس</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
