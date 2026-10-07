import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast(duration = 3500) {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success' });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setToast({ message: '', type: 'success' });
      }, duration);
    },
    [duration]
  );

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ message: '', type: 'success' });
  }, []);

  // Legacy compat: expose toastMessage as plain string
  return {
    toast,
    toastMessage: toast.message,
    showToast,
    hideToast,
  };
}
