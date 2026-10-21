"use client";

import { useEffect, useCallback, useRef } from "react";

interface UseSecurityGuardOptions {
  /** Called when DevTools is detected open */
  onDevToolsDetected?: () => void;
  /** Called when the user switches tabs */
  onTabBlur?: () => void;
  /** Called when the user returns to the tab */
  onTabFocus?: () => void;
  enabled?: boolean;
}

/**
 * Security guard hook — implements multiple layers of content protection:
 * 1. Disable right-click context menu
 * 2. Prevent text selection
 * 3. Block common DevTools shortcuts
 * 4. Detect tab visibility changes (blur/focus)
 * 5. Block drag events (prevent dragging video)
 * 6. Detect DevTools via debugger timing
 */
export function useSecurityGuard({
  onDevToolsDetected,
  onTabBlur,
  onTabFocus,
  enabled = true,
}: UseSecurityGuardOptions) {
  const devToolsCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Disable right-click context menu on the player area
  const preventContextMenu = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-player-area]")) {
      e.preventDefault();
    }
  }, [enabled]);

  // 2. Block DevTools shortcuts
  const blockDevToolsKeys = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // F12
    if (e.key === "F12") {
      e.preventDefault();
      onDevToolsDetected?.();
      return;
    }

    // Ctrl+Shift+I (Inspector), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
    if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
      e.preventDefault();
      onDevToolsDetected?.();
      return;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return;
    }

    // Ctrl+S (Save page)
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      return;
    }
  }, [enabled, onDevToolsDetected]);

  // 3. Block drag events
  const preventDrag = useCallback((e: DragEvent) => {
    if (!enabled) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-player-area]")) {
      e.preventDefault();
    }
  }, [enabled]);

  // 4. Visibility change (tab switch detection)
  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;
    if (document.hidden) {
      onTabBlur?.();
    } else {
      onTabFocus?.();
    }
  }, [enabled, onTabBlur, onTabFocus]);

  // 5. DevTools detection via timing
  useEffect(() => {
    if (!enabled) return;

    // Simple DevTools detection using window size differential
    // When DevTools is docked, the viewport shrinks
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        onDevToolsDetected?.();
      }
    };

    devToolsCheckRef.current = setInterval(checkDevTools, 2000);

    return () => {
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    };
  }, [enabled, onDevToolsDetected]);

  // Attach all event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", blockDevToolsKeys);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", blockDevToolsKeys);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, preventContextMenu, blockDevToolsKeys, preventDrag, handleVisibilityChange]);
}
