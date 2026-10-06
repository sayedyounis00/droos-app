import { Icon } from "@/components/ui/Icon";
import type { PlatformTheme, ThemeId } from "@/lib/themes";
import type { PageId, PageConfig } from "../types";
import { ThemePickerDropdown } from "./ThemePickerDropdown";

interface BuilderHeaderProps {
  onBack: () => void;
  pages: readonly PageConfig[];
  activePage: PageId;
  onSelectPage: (id: PageId) => void;
  currentTheme: PlatformTheme;
  selectedThemeId: ThemeId;
  showThemePicker: boolean;
  setShowThemePicker: (show: boolean) => void;
  onSelectTheme: (id: ThemeId) => void;
  previewMode: boolean;
  onTogglePreviewMode: () => void;
  isSaving: boolean;
  showSaveConfirmation: boolean;
  onSave: () => void;
  saveMessage: string | null;
}

export function BuilderHeader({
  onBack,
  pages,
  activePage,
  onSelectPage,
  currentTheme,
  selectedThemeId,
  showThemePicker,
  setShowThemePicker,
  onSelectTheme,
  previewMode,
  onTogglePreviewMode,
  isSaving,
  showSaveConfirmation,
  onSave,
  saveMessage,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0F4E4F] text-white shadow-xl">
      <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5 gap-3">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold transition-colors"
            title="العودة للوحة التحكم"
          >
            <Icon name="arrow-right" size={16} strokeWidth={2} />
            <span className="hidden sm:inline">العودة للداشبورد</span>
          </button>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-2">
              منشئ صفحات المنصة
            </h1>
            <p className="text-[10px] text-white/60 hidden md:block">
              صمّم هوية منصتك وشاهد التغيير فوراً
            </p>
          </div>
        </div>

        {/* Center: Prominent Page Selector Tabs */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 gap-1 overflow-x-auto max-w-full">
          {pages.map((p) => {
            const isSelected = p.id === activePage;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPage(p.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#E8A83C] text-[#0F4E4F] shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title={p.subtitle}
              >
                <Icon name={p.icon} size={14} strokeWidth={1.8} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Theme Selector + Fullscreen Toggle + Save Button */}
        <div className="flex items-center gap-2">
          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 text-xs font-bold transition-all shadow-inner"
            >
              <Icon name="palette" size={15} strokeWidth={1.8} className="text-[#F3C97C]" />
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 text-[11px] hidden xs:inline">الثيم:</span>
                <span className="font-bold text-[#F3C97C]">{currentTheme.nameAr}</span>
              </div>
              {/* Color swatch dots */}
              <div className="hidden sm:flex items-center gap-1 dir-ltr">
                {currentTheme.swatches.slice(0, 3).map((hex, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <Icon
                name="chevron-down"
                size={14}
                className={`text-white/70 transition-transform ${showThemePicker ? "rotate-180" : ""}`}
              />
            </button>

            <ThemePickerDropdown
              isOpen={showThemePicker}
              onClose={() => setShowThemePicker(false)}
              selectedThemeId={selectedThemeId}
              onSelectTheme={onSelectTheme}
            />
          </div>

          {/* Fullscreen Preview Toggle */}
          <button
            type="button"
            onClick={onTogglePreviewMode}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              previewMode
                ? "bg-[#E8A83C] text-[#0F4E4F]"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={
              previewMode
                ? "العودة للتحرير والمشاهدة الجانبية"
                : "عرض الصفحة ملء الشاشة"
            }
          >
            <Icon name="eye" size={16} strokeWidth={1.8} />
            <span className="hidden sm:inline">
              {previewMode ? "العودة للتعديل" : "ملء الشاشة"}
            </span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-[#E8A83C] hover:bg-[#C88A22] disabled:opacity-75 px-3.5 py-2 text-xs font-bold text-[#0F4E4F] transition-all active:scale-95 shadow-md shadow-[#E8A83C]/30"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-[#0F4E4F] border-t-transparent rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : showSaveConfirmation ? (
              <>
                <Icon name="check" size={16} strokeWidth={2.5} />
                <span>تم الحفظ!</span>
              </>
            ) : (
              <>
                <Icon name="save" size={16} strokeWidth={1.8} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Save Feedback Toast Notification */}
      {saveMessage && (
        <div className="bg-[#0A3536] border-t border-white/10 px-4 py-2 text-center text-xs font-bold text-[#F3C97C] animate-in slide-in-from-top-1 duration-200 flex items-center justify-center gap-2">
          <Icon
            name={
              saveMessage.includes("خطأ") || saveMessage.includes("تعذر")
                ? "alert-triangle"
                : "check-circle"
            }
            size={14}
            strokeWidth={2}
            className="text-[#F3C97C]"
          />
          <span>{saveMessage}</span>
        </div>
      )}
    </header>
  );
}
