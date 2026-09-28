"use client";

import { useState } from "react";
import { useTeacherSession } from "@/hooks/useTeacherSession";
import DroosTableManager from "@/components/teacher/DroosTableManager";
import HomePageBuilder from "@/components/teacher/HomePageBuilder";
import { DashboardHeader } from "@/components/teacher/dashboard/DashboardHeader";
import { WelcomeBanner } from "@/components/teacher/dashboard/WelcomeBanner";
import { DashboardTabs, DashboardTab } from "@/components/teacher/dashboard/DashboardTabs";
import { AccountTab } from "@/components/teacher/dashboard/AccountTab";
import { Spinner } from "@/components/ui/Spinner";

export default function TeacherDashboardPage() {
  const { teacher, setTeacher, isLoading, handleLogout } = useTeacherSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>("account");
  const [showBuilder, setShowBuilder] = useState(false);

  // Full-page builder view — replaces dashboard entirely
  if (showBuilder) {
    return (
      <HomePageBuilder
        onBack={() => setShowBuilder(false)}
        teacherGrades={teacher?.grades ?? []}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <Spinner size="lg" className="text-[#1F7A7B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9] font-sans antialiased text-[#1C2126]">
      {/* Top Navbar */}
      <DashboardHeader teacher={teacher} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header Banner */}
        <WelcomeBanner teacher={teacher} subdomain={teacher?.subdomain || ""} />

        {/* Dashboard Tabs Navigation */}
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenBuilder={() => setShowBuilder(true)}
        />

        {/* Tab 1: Account Control */}
        {activeTab === "account" && (
          <AccountTab
            teacher={teacher}
            onTeacherUpdated={(updated) => setTeacher(updated)}
          />
        )}

        {/* Tab 2: Droos Table Manager */}
        {activeTab === "droos" && (
          <DroosTableManager
            teacherGrades={
              Array.isArray(teacher?.grades) && teacher.grades.length > 0
                ? teacher.grades
                : []
            }
          />
        )}

        {/* Tab 3: Students Placeholder */}
        {activeTab === "students" && (
          <div className="rounded-3xl border border-[#EEF0F2] bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF3E3] text-[#E8A83C]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1C2126]">إدارة الطلاب والمجموعات الدراسية</h3>
            <p className="mt-2 text-sm text-[#8A929B] max-w-md mx-auto">
              ستتمكن قريباً من متابعة حضور وغياب الطلاب، الاشتراكات الشهرية، والواجبات المدرسية.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
