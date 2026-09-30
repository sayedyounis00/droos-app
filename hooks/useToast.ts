import { useState, useCallback, useRef } from 'react';

export function useToast(duration = 3500) {
  const [toastMessage, setToastMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setToastMessage('');
      }, duration);
    },
    [duration]
  );

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToastMessage('');
  }, []);

  return {
    toastMessage,
    showToast,
    hideToast,
  };
}
