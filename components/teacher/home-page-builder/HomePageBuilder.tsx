"use client";

import { useState } from "react";
import { PLATFORM_THEMES, type ThemeId } from "@/lib/themes";
import type { TeacherUser } from "@/lib/auth/teacher-auth";
import { Icon } from "@/components/ui/Icon";
import type { SectionId, PageId } from "./types";
import { SECTIONS, PAGES, defaultTeachingYears } from "./constants";
import { useHomePageData } from "./hooks/useHomePageData";
import { useCourseData } from "./hooks/useCourseData";
import { BuilderHeader } from "./layout/BuilderHeader";
import { EditorPanel } from "./layout/EditorPanel";
import { PreviewPanel } from "./layout/PreviewPanel";
import { PreviewPage } from "./previews/PreviewPage";
import { ModulesPagePreview } from "./previews/ModulesPagePreview";
import { LessonsPagePreview } from "./previews/LessonsPagePreview";
import { LessonDetailPreview } from "./previews/LessonDetailPreview";

interface HomePageBuilderProps {
  onBack: () => void;
  teacherGrades?: string[];
  teacher?: TeacherUser | null;
}

export default function HomePageBuilder({
  onBack,
  teacherGrades,
  teacher,
}: HomePageBuilderProps) {
  // Navigation & UI state
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [activePage, setActivePage] = useState<PageId>("home");
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileEditorTab, setMobileEditorTab] = useState<"editor" | "preview">("editor");

  // Page data & persistence hook
  const {
    data,
    setData,
    selectedThemeId,
    setSelectedThemeId,
    showSaveConfirmation,
    isSaving,
    saveMessage,
    showThemePicker,
    setShowThemePicker,
    handleSave,
    handleUpdateHero,
    handleUpdateAbout,
    handleUpdateContact,
    handleUpdateModulesPage,
    handleUpdateLessonsPage,
    handleUpdateLessonDetailPage,
  } = useHomePageData({ teacher });

  // Course data & preview adapter hook
  const {
    courses,
    isLoadingCourses,
    coursesLoaded,
    allLessons,
    setSelectedLessonId,
    currentActiveLesson,
    currentPlaylist,
    modulesData,
    lessonsData,
    lessonDetailData,
  } = useCourseData({ teacher, homePageData: data });

  const currentTheme =
    PLATFORM_THEMES[selectedThemeId] || PLATFORM_THEMES["horizon"];
  const displayGrades =
    teacherGrades && teacherGrades.length > 0 ? teacherGrades : defaultTeachingYears;
  const currentPage =
    PAGES.find((p) => p.id === activePage) || PAGES[0];

  const handleSelectTheme = (id: ThemeId) => {
    setSelectedThemeId(id);
  };

  const renderActivePageContent = () => {
    switch (activePage) {
      case "home":
        return (
          <PreviewPage
            data={data}
            teachingYears={displayGrades}
            courses={courses}
            onViewAllCourses={() => setActivePage("modules")}
            onViewCourse={() => setActivePage("modules")}
            theme={currentTheme}
          />
        );

      case "modules":
        return isLoadingCourses ? (
          <div className="flex items-center justify-center py-32 text-[#1F7A7B]">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#1F7A7B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold">جاري تحميل الكورسات من قاعدة البيانات...</p>
            </div>
          </div>
        ) : (
          <ModulesPagePreview
            data={modulesData}
            theme={currentTheme}
            isLiveData={coursesLoaded && courses.length > 0}
            onViewLessons={() => setActivePage("lessons")}
          />
        );

      case "lessons":
        return isLoadingCourses ? (
          <div className="flex items-center justify-center py-32 text-[#1F7A7B]">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#1F7A7B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold">جاري تحميل الدروس من قاعدة البيانات...</p>
            </div>
          </div>
        ) : (
          <LessonsPagePreview
            data={lessonsData}
            theme={currentTheme}
            isLiveData={coursesLoaded && courses.length > 0}
            onSelectLesson={(lessonId) => {
              setSelectedLessonId(lessonId);
              setActivePage("lesson-detail");
            }}
          />
        );

      case "lesson-detail":
        return (
          <LessonDetailPreview
            data={lessonDetailData}
            theme={currentTheme}
            videoUrl={currentActiveLesson?.video_url}
            playlistLessons={currentPlaylist.map((l) => ({
              id: l.id,
              title: l.title,
              duration: l.content_type === "video" ? "فيديو" : "درس",
              content_type: l.content_type,
              video_url: l.video_url,
            }))}
            currentLessonId={currentActiveLesson?.id}
            onSelectLesson={(lessonId) => setSelectedLessonId(lessonId)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9] flex flex-col font-sans" dir="rtl">
      {/* Builder Top Bar Header */}
      <BuilderHeader
        onBack={onBack}
        pages={PAGES}
        activePage={activePage}
        onSelectPage={setActivePage}
        currentTheme={currentTheme}
        selectedThemeId={selectedThemeId}
        showThemePicker={showThemePicker}
        setShowThemePicker={setShowThemePicker}
        onSelectTheme={handleSelectTheme}
        previewMode={previewMode}
        onTogglePreviewMode={() => setPreviewMode(!previewMode)}
        isSaving={isSaving}
        showSaveConfirmation={showSaveConfirmation}
        onSave={handleSave}
        saveMessage={saveMessage}
      />

      {previewMode ? (
        /* Full-Screen Preview Mode */
        <div className="flex-1 overflow-auto bg-white flex flex-col min-h-0">
          <div className="bg-[#0A3536] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center gap-2">
              <Icon name="eye" size={16} strokeWidth={1.8} className="text-[#F3C97C]" />
              <span>
                أنت الآن في وضع ملء الشاشة لصفحة:{" "}
                <strong className="text-[#F3C97C]">({currentPage.label})</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-[#E8A83C] text-[#0F4E4F] font-black text-xs hover:bg-[#F3C97C] transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Icon name="edit" size={13} strokeWidth={2} />
              <span>العودة للتعديل والمشاهدة الجانبية</span>
            </button>
          </div>

          <div className="w-full flex-1">{renderActivePageContent()}</div>
        </div>
      ) : (
        /* Side-by-Side Editor & Live Page Preview Mode */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden bg-white border-b border-[#EEF0F2] p-2 flex items-center justify-center gap-2 shadow-xs flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileEditorTab("editor")}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl text-center transition-all inline-flex items-center justify-center gap-1.5 ${
                mobileEditorTab === "editor"
                  ? "bg-[#1F7A7B] text-white shadow-sm"
                  : "bg-[#F7F8F9] text-[#4A5158] hover:bg-[#EEF0F2]"
              }`}
            >
              <Icon name="edit" size={13} strokeWidth={1.8} />
              <span>نموذج التعديل ({currentPage.label})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileEditorTab("preview")}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl text-center transition-all inline-flex items-center justify-center gap-1.5 ${
                mobileEditorTab === "preview"
                  ? "bg-[#1F7A7B] text-white shadow-sm"
                  : "bg-[#F7F8F9] text-[#4A5158] hover:bg-[#EEF0F2]"
              }`}
            >
              <Icon name="eye" size={13} strokeWidth={1.8} />
              <span>معاينة الصفحة الحية</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Editor Panel - Generous width for easy writing and interaction */}
            <div
              className={`w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] flex-shrink-0 flex flex-col min-h-0 bg-[#F7F8F9] overflow-hidden border-l border-[#EEF0F2] ${
                mobileEditorTab === "editor" ? "flex" : "hidden lg:flex"
              }`}
            >
              <EditorPanel
                activePage={activePage}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                data={data}
                setData={setData}
                handleUpdateHero={handleUpdateHero}
                handleUpdateAbout={handleUpdateAbout}
                handleUpdateContact={handleUpdateContact}
                handleUpdateModulesPage={handleUpdateModulesPage}
                handleUpdateLessonsPage={handleUpdateLessonsPage}
                handleUpdateLessonDetailPage={handleUpdateLessonDetailPage}
                displayGrades={displayGrades}
                courses={courses}
                allLessons={allLessons}
                currentActiveLesson={currentActiveLesson}
                setSelectedLessonId={setSelectedLessonId}
                lessonDetailData={lessonDetailData}
                sections={SECTIONS}
              />
            </div>

            {/* Live Preview Panel - Expands to take all remaining spacious desktop width */}
            <div
              className={`flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden ${
                mobileEditorTab === "preview" ? "flex" : "hidden lg:flex"
              }`}
            >
              <PreviewPanel
                currentPage={currentPage}
                currentTheme={currentTheme}
                onExpandFullscreen={() => setPreviewMode(true)}
              >
                {renderActivePageContent()}
              </PreviewPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
