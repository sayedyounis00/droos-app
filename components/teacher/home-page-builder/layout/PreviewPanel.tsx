import React from "react";
import { Icon } from "@/components/ui/Icon";
import type { PlatformTheme } from "@/lib/themes";
import type { PageConfig } from "../types";

interface PreviewPanelProps {
  currentPage: PageConfig;
  currentTheme: PlatformTheme;
  onExpandFullscreen: () => void;
  children: React.ReactNode;
}

export function PreviewPanel({
  currentPage,
  currentTheme,
  onExpandFullscreen,
  children,
}: PreviewPanelProps) {
  return (
    <aside className="w-full h-full flex flex-col min-h-0 bg-[#EEF0F2]/50 border-r border-[#EEF0F2] overflow-hidden">
      {/* Preview Bar Header */}
      <div className="bg-white border-b border-[#EEF0F2] px-4 py-3 flex items-center justify-between shadow-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon name={currentPage.icon} size={16} strokeWidth={1.8} className="text-[#1F7A7B]" />
          <span className="text-xs font-black text-[#1C2126]">
            معاينة الصفحة الحية: {currentPage.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E9E5B]/10 text-[#2E9E5B] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E5B] animate-pulse" />
            <span className="inline-flex items-center gap-1">
              <span>تحديث فوري</span>
              <Icon name="zap" size={11} strokeWidth={2} />
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll hint — reminds the user the preview is a full scrollable page */}
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-[#8A929B] bg-[#F7F8F9] px-2 py-1 rounded-lg border border-[#EEF0F2]">
            <Icon name="chevron-down" size={11} strokeWidth={1.8} />
            <span>قابل للتمرير</span>
          </span>
          <span className="text-[11px] font-bold text-[#8A929B] bg-[#F7F8F9] px-2.5 py-1 rounded-xl border border-[#EEF0F2]">
            ثيم {currentTheme.nameAr}
          </span>
          <button
            type="button"
            onClick={onExpandFullscreen}
            className="text-[11px] font-black text-[#1F7A7B] hover:text-[#0F4E4F] flex items-center gap-1 hover:underline bg-[#EAF4F4] px-2.5 py-1 rounded-xl transition-colors"
            title="تكبير المعاينة ملء الشاشة"
          >
            <span>ملء الشاشة</span>
            <Icon name="external-link" size={12} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Scrollable Live Preview Container (Maximum width for readability) */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-[#D3D7DC]/70 overflow-hidden min-h-full">
          {children}
        </div>
      </div>
    </aside>
  );
}
