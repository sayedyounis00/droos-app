import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'success' }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 start-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0F4E4F] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0F4E4F]/25 border border-[#166465]/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
    >
      {type === 'success' && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E9E5B] text-white">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {type === 'error' && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9483D] text-white">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )}
      <span>{message}</span>
    </div>
  );
}
