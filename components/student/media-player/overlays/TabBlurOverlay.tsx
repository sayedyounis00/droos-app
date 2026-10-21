import React from "react";

/**
 * Overlay shown when student switches to another browser tab.
 */
export function TabBlurOverlay() {
  return (
    <div
      className="absolute inset-0 z-25 flex items-center justify-center select-none"
      style={{
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <div className="text-center text-white space-y-2 animate-pulse">
        <svg
          width={40}
          height={40}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto text-[#F3C97C]"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-sm font-bold">عُد للتبويب لمتابعة المشاهدة</p>
        <p className="text-[11px] text-white/60">يتم إيقاف العرض مؤقتاً لحماية المحتوى</p>
      </div>
    </div>
  );
}
