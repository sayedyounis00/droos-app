import React from "react";

/**
 * Placeholder displayed when a lesson has no attached video.
 */
export function NoVideoPlaceholder() {
  return (
    <div
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0D1420] flex flex-col items-center justify-center text-center p-6 text-white"
      data-player-area
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
        <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" className="text-[#F3C97C]">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
      <h4 className="text-base font-bold">حصة دراسية بدون رابط فيديو مباشر</h4>
      <p className="text-xs text-white/70 max-w-sm mt-1">
        هذا الدرس مسجل كحصة دراسية أو ملف تمارين. يمكنك مراجعة الملاحظات والملحقات أدناه.
      </p>
    </div>
  );
}

interface VideoErrorPlaceholderProps {
  onRetry?: () => void;
}

/**
 * Error state displayed if the video URL fails to load.
 */
export function VideoErrorPlaceholder({ onRetry }: VideoErrorPlaceholderProps) {
  return (
    <div
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0D1420] flex flex-col items-center justify-center text-center p-6 text-white"
      data-player-area
    >
      <div className="w-16 h-16 rounded-full bg-[#D9483D]/20 flex items-center justify-center mb-3">
        <svg
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D9483D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h4 className="text-base font-bold">تعذّر تحميل الفيديو</h4>
      <p className="text-xs text-white/60 max-w-sm mt-1">
        يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى
      </p>
      <button
        type="button"
        onClick={onRetry || (() => window.location.reload())}
        className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}

interface LoadingSpinnerProps {
  accentColor?: string;
}

/**
 * Centered buffering / loading spinner.
 */
export function LoadingSpinner({ accentColor = "#E8A83C" }: LoadingSpinnerProps) {
  return (
    <div className="absolute inset-0 z-12 flex items-center justify-center bg-black/30 pointer-events-none">
      <div
        className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${accentColor}60`, borderTopColor: "transparent" }}
      />
    </div>
  );
}
