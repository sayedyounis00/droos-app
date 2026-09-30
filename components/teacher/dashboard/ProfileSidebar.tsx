import React from 'react';
import { TeacherUser } from '@/lib/auth/teacher-auth';
import { Icon } from '@/components/ui/Icon';

interface ProfileSidebarProps {
  teacher: TeacherUser | null;
  name: string;
  phone: string;
  subject: string;
  grades: string[];
  governorate: string;
  subdomain: string;
  subdomainLocked: boolean;
}

export function ProfileSidebar({
  teacher,
  name,
  phone,
  subject,
  grades,
  governorate,
  subdomain,
  subdomainLocked,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Account Overview Summary Card */}
      <div className="rounded-3xl border border-[#EEF0F2] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1C2126] mb-4 border-b border-[#EEF0F2] pb-3">
          ملخص الحساب في قاعدة البيانات
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">اسم المعلم:</span>
            <span className="font-bold text-[#1C2126]">{teacher?.name || name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">رقم الهاتف:</span>
            <span className="font-bold text-[#1C2126] dir-ltr">{teacher?.phone || phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">كلمة المرور:</span>
            <span className="font-bold text-[#1C2126]">••••••••</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">المادة التخصصية:</span>
            <span className="font-bold text-[#1F7A7B]">{teacher?.subject || subject}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#EEF0F2] last:border-0">
            <span className="text-[#8A929B]">المراحل:</span>
            <span className="font-bold text-[#1C2126] text-right">
              {Array.isArray(teacher?.grades) && teacher.grades.length > 0
                ? teacher.grades.join('، ')
                : grades.join('، ') || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">المحافظة:</span>
            <span className="font-bold text-[#1C2126]">{teacher?.governorate || governorate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">النطاق الفرعي (Subdomain):</span>
            {subdomain ? (
              <span className="font-bold text-[#1F7A7B] dir-ltr">{subdomain}.droos.app</span>
            ) : (
              <span className="font-bold text-[#E8A83C]">غير محدد بعد</span>
            )}
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F8F9]">
            <span className="text-[#8A929B]">حالة قفل الرابط:</span>
            {subdomainLocked ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#D9483D]">
                <Icon name="lock" size={13} strokeWidth={1.8} />
                <span>مقفول</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#2E9E5B]">
                <Icon name="edit" size={13} strokeWidth={1.8} />
                <span>متاح للتعديل</span>
              </span>
            )}
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#8A929B]">حالة الحساب:</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#2E9E5B]">
              <Icon name="check-circle" size={13} strokeWidth={1.8} />
              <span>نشط ومعتمد</span>
            </span>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="rounded-3xl bg-[#FDF3E3] border border-[#F3C97C] p-6 text-xs text-[#9C6B18]">
        <div className="flex items-center gap-2 font-bold mb-2">
          <svg className="h-5 w-5 text-[#E8A83C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>مساعدة الدعم الفني</span>
        </div>
        <p className="leading-relaxed mb-3 text-[#7A520C]">
          إذا كنت ترغب في تغيير رابطك الفرعي بعد قفله أو ربط نطاق خاص (Custom Domain)، تواصل معنا عبر واتساب.
        </p>
        <a
          href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%BA%D9%8A%D9%8A%D8%B1%20%D8%A7%D9%84%D9%86%D8%B7%D8%A7%D9%82%20%D8%A7%D9%84%D9%81%D8%B1%D8%B9%D9%8A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-[#E8A83C] hover:underline"
        >
          <span>طلب مساعدة من الدعم</span>
          <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
