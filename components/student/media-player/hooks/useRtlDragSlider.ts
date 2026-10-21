"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseRtlDragSliderOptions {
  onValueChange: (percent: number) => void;
}

/**
 * Reusable hook for RTL horizontal draggable sliders (ProgressBar, VolumeSlider).
 * Right edge = 0%, Left edge = 100%.
 */
export function useRtlDragSlider({ onValueChange }: UseRtlDragSliderOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const onValueChangeRef = useRef(onValueChange);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const getPercentFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const x = rect.right - e.clientX;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const percent = getPercentFromEvent(e);
      onValueChangeRef.current(percent);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onValueChangeRef.current(getPercentFromEvent(moveEvent));
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [getPercentFromEvent]
  );

  return {
    trackRef,
    isDragging,
    handleMouseDown,
    getPercentFromEvent,
  };
}
