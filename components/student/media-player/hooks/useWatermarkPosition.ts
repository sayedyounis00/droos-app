"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Periodically generates a randomized (x, y) percentage position for dynamic watermarks.
 * Keeps coordinates within 10-85% to prevent edge clipping.
 */
export function useWatermarkPosition(intervalMs = 25000) {
  const [position, setPosition] = useState(() => ({
    x: 10 + Math.random() * 75,
    y: 10 + Math.random() * 70,
  }));

  const randomize = useCallback(() => {
    setPosition({
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 70,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(randomize, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, randomize]);

  return position;
}
