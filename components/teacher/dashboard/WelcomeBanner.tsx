import React from 'react';
import { TeacherUser } from '@/lib/auth/teacher-auth';

interface WelcomeBannerProps {
  teacher: TeacherUser | null;
  subdomain: string;
}

export function WelcomeBanner({ teacher, subdomain }: WelcomeBannerProps) {
  return (
    <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0F4E4F] via-[#1F7A7B] to-[#166465] p-6 sm:p-8 text-white shadow-xl shadow-[#1F7A7B]/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md mb-3">
            <span className="h-2 w-2 rounded-full bg-[#E8A83C] animate-pulse" />
            حساب معلم معتمد وموثق
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            أهلاً بك، {teacher?.name || 'أحمد سعد'} 👋
          </h1>
          <p className="mt-1.5 text-sm text-white/80 max-w-xl">
            إدارة كاملة لبيانات الحساب الشخصي، النطاق الفرعي (Subdomain)، والدروس التعليمية.
          </p>
        </div>

        {/* Subdomain Active Preview Badge */}
        {subdomain ? (
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20 self-start md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8A83C] text-white font-bold">
              🔗
            </div>
            <div className="text-right dir-ltr">
              <span className="block text-[10px] text-white/70 dir-rtl">رابط المنصة الفرعي الخاصة بك</span>
              <a
                href={`https://${subdomain}.droos.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-white underline hover:text-[#E8A83C]"
              >
                {subdomain}.droos.app
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 self-start md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-bold">
              🌐
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-white/70">النطاق الفرعي (Subdomain)</span>
              <span className="text-xs font-bold text-[#F3C97C]">لم يتم التعيين بعد (يمكن تغييره مرة واحدة)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
