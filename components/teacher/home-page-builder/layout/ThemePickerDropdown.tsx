import { Icon } from "@/components/ui/Icon";
import { THEME_LIST, type ThemeId } from "@/lib/themes";

interface ThemePickerDropdownProps {
  selectedThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ThemePickerDropdown({
  selectedThemeId,
  onSelectTheme,
  isOpen,
  onClose,
}: ThemePickerDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute left-0 sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white text-[#1C2126] shadow-2xl border border-[#EEF0F2] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-2.5 mb-2.5 px-1">
          <span className="text-xs font-black text-[#0F4E4F] flex items-center gap-1.5">
            <Icon name="palette" size={15} strokeWidth={1.8} className="text-[#1F7A7B]" />
            <span>اختر هُوية المنصة (4 ثيمات مخصصة)</span>
          </span>
          <span className="text-[10px] text-[#8A929B]">تحدث فوراً في المعاينة</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-auto pl-1 pr-1">
          {THEME_LIST.map((t) => {
            const isSelected = t.id === selectedThemeId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTheme(t.id);
                  onClose();
                }}
                className={`w-full text-right p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? "border-[#1F7A7B] bg-[#EAF4F4]/70 ring-2 ring-[#1F7A7B]/20"
                    : "border-[#EEF0F2] hover:bg-[#F7F8F9] hover:border-[#D3D7DC]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1C2126] flex items-center gap-2">
                    {t.nameAr}
                    <span className="text-[10px] font-normal text-[#8A929B] dir-ltr">
                      ({t.name})
                    </span>
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-[#1F7A7B] p-0.5 text-white">
                      <Icon name="check" size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#4A5158] leading-tight line-clamp-1">
                  {t.bestFor}
                </p>

                {/* Swatches Strip */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 dir-ltr">
                    {t.swatches.map((color, idx) => (
                      <span
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#8A929B] bg-white px-2 py-0.5 rounded-md border border-[#EEF0F2]">
                    {t.mood.split("،")[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
