"use client";

import React, { useState } from "react";

interface PdfAttachmentCardProps {
  pdfTitle?: string;
  backgroundColor: string;
  borderColor: string;
}

/**
 * Card displaying downloadable lesson PDF materials and worksheets.
 */
export function PdfAttachmentCard({
  pdfTitle,
  backgroundColor,
  borderColor,
}: PdfAttachmentCardProps) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="pt-4">
      <div
        className="p-4 rounded-xl border flex items-center justify-between gap-4"
        style={{ backgroundColor, borderColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9483D]/10 text-[#D9483D] flex items-center justify-center font-bold">
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <strong className="block text-xs font-bold text-[#1C2126]">
              {pdfTitle || "ملخص الحصة والتمارين التطبيقية (PDF)"}
            </strong>
            <span className="text-[11px] text-[#8A929B]">جاهز للطباعة والحل المنزلي</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setNotice("ملف التمارين متاح للطلاب المشتركين في المجموعة الدراسية.")}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-[#D3D7DC] bg-white hover:bg-[#F7F8F9] text-[#1C2126] transition-colors shadow-2xs cursor-pointer"
        >
          تحميل الملف
        </button>
      </div>

      {notice && (
        <div className="mt-3 p-3 rounded-xl bg-[#1F7A7B]/10 border border-[#1F7A7B]/20 text-[#1F7A7B] text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs hover:opacity-75 cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
