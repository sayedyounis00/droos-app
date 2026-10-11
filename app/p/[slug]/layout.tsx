import React from "react";
import { notFound } from "next/navigation";
import { getPublicPlatformBySlug } from "@/lib/queries/public-platform";
import { PLATFORM_THEMES } from "@/lib/themes";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { StudentFooter } from "@/components/student/StudentFooter";

interface PlatformLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublicPlatformBySlug(slug);

  if (!data) {
    return {
      title: "المنصة غير موجودة | دروس",
    };
  }

  const teacherName = data.teacher?.name || data.platform.name;
  const subject = data.teacher?.subject || "التعليم";

  return {
    title: `${teacherName} — منصة ${subject} التعليمية`,
    description: data.platform.description || data.homePageData.hero.subheadline,
  };
}

export default async function PlatformLayout({
  children,
  params,
}: PlatformLayoutProps) {
  const { slug } = await params;
  const data = await getPublicPlatformBySlug(slug);

  if (!data) {
    notFound();
  }

  const currentTheme =
    PLATFORM_THEMES[data.themeId] || PLATFORM_THEMES["horizon"];

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col font-sans"
      style={{
        backgroundColor: currentTheme.light.background,
        color: currentTheme.light.textPrimary,
        fontFamily: currentTheme.fonts.body,
      }}
    >
      {/* Google Fonts Dynamic Load */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Baloo+Bhaijaan+2:wght@400;600;800&family=Cairo:wght@400;600;700;900&family=El+Messiri:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=Tajawal:wght@400;500;700;900&display=swap"
      />

      {/* Shared Student Navbar */}
      <StudentNavbar
        platformName={data.teacher?.name || data.platform.name}
        slug={slug}
        theme={currentTheme}
        whatsapp={data.homePageData.contact.whatsapp}
      />

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Shared Student Footer */}
      <StudentFooter
        platformName={data.teacher?.name || data.platform.name}
        slug={slug}
        theme={currentTheme}
        contact={data.homePageData.contact}
        subject={data.teacher?.subject}
      />
    </div>
  );
}
