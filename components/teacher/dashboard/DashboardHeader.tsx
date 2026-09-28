import React from 'react';
import { TeacherUser } from '@/lib/auth/teacher-auth';
import { Logo } from '@/components/ui/Logo';

interface DashboardHeaderProps {
  teacher: TeacherUser | null;
  onLogout: () => void;
}

export function DashboardHeader({ teacher, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#EEF0F2] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo & Platform Name */}
        <Logo href="/" subtitle="لوحة تحكم المعلم" />

        {/* Teacher Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full bg-[#EAF4F4] py-1.5 px-3 border border-[#CFE6E6]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F7A7B] text-xs font-bold text-white">
              {teacher?.name?.charAt(0) || 'أ'}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-[#0F4E4F]">{teacher?.name || 'أحمد سعد'}</span>
              <span className="text-[10px] font-medium text-[#166465]">{teacher?.phone || '01143825523'}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-[#EEF0F2] bg-white py-2 px-3 text-xs font-bold text-[#D9483D] transition-colors hover:bg-[#D9483D]/5"
            title="تسجيل الخروج"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
