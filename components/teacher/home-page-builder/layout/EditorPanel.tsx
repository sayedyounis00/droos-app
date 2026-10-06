import React, { useRef } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { CourseItem } from "@/lib/droos-data";
import type {
  PageId,
  SectionId,
  SectionConfig,
  HomePageData,
  HeroSection,
  AboutSection,
  ContactSection,
  PageHeadingConfig,
  LessonDetailConfig,
  LessonDetailData,
} from "../types";
import { defaultModulesData, defaultLessonsData } from "../constants";
import { HeroEditor } from "../editors/HeroEditor";
import { AboutEditor } from "../editors/AboutEditor";
import { TeachingYearsEditor } from "../editors/TeachingYearsEditor";
import { TestimonialsEditor } from "../editors/TestimonialsEditor";
import { ContactEditor } from "../editors/ContactEditor";
import { ModulesEditor } from "../editors/ModulesEditor";
import { LessonsEditor } from "../editors/LessonsEditor";
import { LessonDetailEditor } from "../editors/LessonDetailEditor";

// ─── Section Nav Bar ──────────────────────────────────────────────────────────
// Extracted as its own component so useRef is always called unconditionally.

interface SectionNavBarProps {
  sections: readonly SectionConfig[];
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
}

function SectionNavBar({
  sections,
  activeSection,
  setActiveSection,
}: SectionNavBarProps) {
  const navRef = useRef<HTMLDivElement>(null);

  const scrollNav = (dir: "right" | "left") => {
    if (!navRef.current) return;
    navRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  return (
    <div className="bg-white border-b border-[#EEF0F2] flex-shrink-0 shadow-2xs">
      {/* Label row + arrow buttons */}
      <div className="px-3 pt-2 pb-0 flex items-center justify-between">
        <span className="text-[10px] font-black text-[#8A929B] uppercase tracking-widest">
          اختر القسم للتعديل:
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => scrollNav("right")}
            aria-label="التالي"
            title="التالي"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#4A5158] hover:bg-[#EEF0F2] hover:text-[#1F7A7B] transition-colors"
          >
            <Icon name="chevron-right" size={14} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => scrollNav("left")}
            aria-label="السابق"
            title="السابق"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#4A5158] hover:bg-[#EEF0F2] hover:text-[#1F7A7B] transition-colors"
          >
            <Icon name="chevron-left" size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Scrollable tab strip with fade edge hints */}
      <div className="relative">
        {/* Right-edge fade: indicates hidden tabs at RTL start */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />
        {/* Left-edge fade: indicates hidden tabs at RTL end */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />

        <div
          ref={navRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-none px-3 py-2"
        >
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#1F7A7B] text-white shadow-xs font-black"
                    : "text-[#4A5158] hover:bg-[#F7F8F9] hover:text-[#1F7A7B]"
                }`}
              >
                <Icon name={sec.icon as IconName} size={14} strokeWidth={isActive ? 2 : 1.8} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Editor Panel ─────────────────────────────────────────────────────────────

interface EditorPanelProps {
  activePage: PageId;
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  data: HomePageData;
  setData: React.Dispatch<React.SetStateAction<HomePageData>>;
  handleUpdateHero: (updated: Partial<HeroSection>) => void;
  handleUpdateAbout: (updated: Partial<AboutSection>) => void;
  handleUpdateContact: (updated: Partial<ContactSection>) => void;
  handleUpdateModulesPage: (updated: Partial<PageHeadingConfig>) => void;
  handleUpdateLessonsPage: (updated: Partial<PageHeadingConfig>) => void;
  handleUpdateLessonDetailPage: (updated: Partial<LessonDetailConfig>) => void;
  displayGrades: string[];
  courses: CourseItem[];
  allLessons: Array<{ id: string; title: string; courseTitle?: string }>;
  currentActiveLesson: { id: string; title: string } | null;
  setSelectedLessonId: (id: string) => void;
  lessonDetailData: LessonDetailData;
  sections: readonly SectionConfig[];
}

export function EditorPanel({
  activePage,
  activeSection,
  setActiveSection,
  data,
  setData,
  handleUpdateHero,
  handleUpdateAbout,
  handleUpdateContact,
  handleUpdateModulesPage,
  handleUpdateLessonsPage,
  handleUpdateLessonDetailPage,
  displayGrades,
  courses,
  allLessons,
  currentActiveLesson,
  setSelectedLessonId,
  lessonDetailData,
  sections,
}: EditorPanelProps) {
  if (activePage === "home") {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#F7F8F9]">
        <SectionNavBar
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Active Section Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeSection === "hero" && (
            <HeroEditor data={data.hero} onChange={handleUpdateHero} />
          )}
          {activeSection === "about" && (
            <AboutEditor data={data.about} onChange={handleUpdateAbout} />
          )}
          {activeSection === "courses" && (
            <TeachingYearsEditor grades={displayGrades} />
          )}
          {activeSection === "testimonials" && (
            <TestimonialsEditor
              data={data.testimonials}
              teacherGrades={displayGrades}
              onChange={(testimonials) =>
                setData((prev) => ({ ...prev, testimonials }))
              }
            />
          )}
          {activeSection === "contact" && (
            <ContactEditor data={data.contact} onChange={handleUpdateContact} />
          )}
        </div>
      </div>
    );
  }

  if (activePage === "modules") {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <ModulesEditor
          title={data.modulesPage?.title ?? defaultModulesData.title}
          subtitle={data.modulesPage?.subtitle ?? defaultModulesData.subtitle}
          onChangeTitle={(title) => handleUpdateModulesPage({ title })}
          onChangeSubtitle={(subtitle) => handleUpdateModulesPage({ subtitle })}
          coursesCount={courses.length}
          modulesCount={courses.reduce(
            (acc, c) => acc + (c.modules?.length || 0),
            0
          )}
        />
      </div>
    );
  }

  if (activePage === "lessons") {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <LessonsEditor
          title={data.lessonsPage?.title ?? defaultLessonsData.title}
          subtitle={data.lessonsPage?.subtitle ?? defaultLessonsData.subtitle}
          onChangeTitle={(title) => handleUpdateLessonsPage({ title })}
          onChangeSubtitle={(subtitle) => handleUpdateLessonsPage({ subtitle })}
          lessonsCount={allLessons.length}
        />
      </div>
    );
  }

  // activePage === "lesson-detail"
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <LessonDetailEditor
        data={lessonDetailData}
        onChange={(updated) => handleUpdateLessonDetailPage(updated)}
        lessons={allLessons}
        activeLessonId={currentActiveLesson?.id}
        onSelectLesson={(id) => setSelectedLessonId(id)}
      />
    </div>
  );
}
