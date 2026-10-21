"use client";

import { useEffect, useCallback, useRef } from "react";
import { isDevToolsShortcut, isDevToolsDimensionsOpen } from "../utils/security";

interface UseSecurityGuardOptions {
  onDevToolsDetected?: () => void;
  onDevToolsClosed?: () => void;
  onTabBlur?: () => void;
  onTabFocus?: () => void;
  enabled?: boolean;
}

/**
 * Security guard hook:
 * 1. Blocks right-click context menu
 * 2. Blocks DevTools keyboard shortcuts
 * 3. Prevents dragging video assets
 * 4. Detects DevTools window dimensions
 * 5. Detects tab switching (blur/focus)
 */
export function useSecurityGuard({
  onDevToolsDetected,
  onDevToolsClosed,
  onTabBlur,
  onTabFocus,
  enabled = true,
}: UseSecurityGuardOptions) {
  const isDevToolsOpenRef = useRef(false);

  // 1. Disable right-click context menu
  const preventContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [enabled]
  );

  // 2. Block DevTools keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (isDevToolsShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        onDevToolsDetected?.();
      }
    },
    [enabled, onDevToolsDetected]
  );

  // 3. Block drag events on player area
  const preventDrag = useCallback(
    (e: DragEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-player-area]")) {
        e.preventDefault();
      }
    },
    [enabled]
  );

  // 4. Tab visibility changes
  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;
    if (document.hidden) {
      onTabBlur?.();
    } else {
      onTabFocus?.();
    }
  }, [enabled, onTabBlur, onTabFocus]);

  // 5. Monitor DevTools dimension threshold
  useEffect(() => {
    if (!enabled) return;

    const checkDevTools = () => {
      const isOpen = isDevToolsDimensionsOpen();
      if (isOpen && !isDevToolsOpenRef.current) {
        isDevToolsOpenRef.current = true;
        onDevToolsDetected?.();
      } else if (!isOpen && isDevToolsOpenRef.current) {
        isDevToolsOpenRef.current = false;
        onDevToolsClosed?.();
      }
    };

    const intervalId = setInterval(checkDevTools, 1000);
    window.addEventListener("resize", checkDevTools);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", checkDevTools);
    };
  }, [enabled, onDevToolsDetected, onDevToolsClosed]);

  // Attach event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, preventContextMenu, handleKeyDown, preventDrag, handleVisibilityChange]);
}
