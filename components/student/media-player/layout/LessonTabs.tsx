"use client";

import React, { useState } from "react";
import { TeacherNoteBanner } from "./TeacherNoteBanner";
import { PdfAttachmentCard } from "./PdfAttachmentCard";

interface LessonTabsProps {
  description?: string | null;
  teacherNote?: string;
  pdfTitle?: string;
  borderColor: string;
  backgroundColor: string;
  accentColor: string;
  primaryColor: string;
}

/**
 * Tabbed section displaying lesson description/notes and attached PDF worksheets.
 */
export function LessonTabs({
  description,
  teacherNote,
  pdfTitle,
  borderColor,
  backgroundColor,
  accentColor,
  primaryColor,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview");

  return (
    <div>
      {/* Tab navigation headers */}
      <div className="pt-4 border-t flex items-center gap-4" style={{ borderColor }}>
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-[#1F7A7B] text-[#1F7A7B]"
              : "border-transparent text-[#8A929B] hover:text-[#4A5158]"
          }`}
        >
          شرح وملاحظات الدرس
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pdf")}
          className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "pdf"
              ? "border-[#1F7A7B] text-[#1F7A7B]"
              : "border-transparent text-[#8A929B] hover:text-[#4A5158]"
          }`}
        >
          الملحقات والتمارين (PDF)
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="pt-4 space-y-4 text-xs sm:text-sm text-[#5B6270] leading-relaxed">
          <p>
            {description ||
              "في هذه الحصة يتم شرح المفاهيم التأسيسية وحل التطبيقات النموذجية خطوة بخطوة."}
          </p>

          {teacherNote && (
            <TeacherNoteBanner
              note={teacherNote}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          )}
        </div>
      )}

      {activeTab === "pdf" && (
        <PdfAttachmentCard
          pdfTitle={pdfTitle}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}
