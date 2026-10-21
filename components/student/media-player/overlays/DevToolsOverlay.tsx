"use client";

import React from "react";

interface DevToolsOverlayProps {
  onCheckDevTools: () => void;
}

/**
 * High-security lockout overlay displayed when DevTools / Inspect is detected.
 */
export function DevToolsOverlay({ onCheckDevTools }: DevToolsOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none"
      style={{
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        backgroundColor: "rgba(10, 15, 20, 0.94)",
      }}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#D9483D]/15 border border-[#D9483D]/30 flex items-center justify-center mb-4 text-[#D9483D] animate-pulse">
        <svg
          width={32}
          height={32}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-base sm:text-lg font-black text-white mb-2">
        تم رصد فتح أدوات الفحص (Inspect / DevTools)
      </h3>
      <p className="text-xs text-white/70 max-w-md leading-relaxed mb-5">
        لحماية حقوق الملكية الفكرية وتأمين الدروس التعليمية، تم إيقاف المشغل وتعتيم المحتوى. يرجى إغلاق نافذة الفحص (Inspect) لمواصلة المشاهدة.
      </p>
      <button
        type="button"
        onClick={onCheckDevTools}
        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white transition-all border border-white/10 cursor-pointer"
      >
        إعادة التحقق واستئناف المشاهدة
      </button>
    </div>
  );
}
