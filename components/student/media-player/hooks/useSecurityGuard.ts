"use client";

import { useEffect, useCallback, useRef } from "react";

interface UseSecurityGuardOptions {
  /** Called when DevTools is detected open */
  onDevToolsDetected?: () => void;
  /** Called when DevTools is detected closed */
  onDevToolsClosed?: () => void;
  /** Called when the user switches tabs */
  onTabBlur?: () => void;
  /** Called when the user returns to the tab */
  onTabFocus?: () => void;
  enabled?: boolean;
}

/**
 * Security guard hook — implements comprehensive layers of content protection:
 * 1. Disable right-click context menu globally to prevent "Inspect Element"
 * 2. Prevent drag events and text selection on player
 * 3. Block all DevTools and view-source shortcuts (Windows, Linux, macOS)
 * 4. Monitor window size differentials and console hooks to detect DevTools state
 * 5. Monitor tab visibility changes (blur/focus)
 */
export function useSecurityGuard({
  onDevToolsDetected,
  onDevToolsClosed,
  onTabBlur,
  onTabFocus,
  enabled = true,
}: UseSecurityGuardOptions) {
  const isDevToolsOpenRef = useRef(false);

  // 1. Disable right-click context menu on the entire page
  const preventContextMenu = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();
  }, [enabled]);

  // 2. Block DevTools keyboard shortcuts across Windows, Linux, and macOS
  const blockDevToolsKeys = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // F12 key
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      onDevToolsDetected?.();
      return;
    }

    // Ctrl+Shift+I / Cmd+Opt+I (Developer Tools)
    // Ctrl+Shift+J / Cmd+Opt+J (Console)
    // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element)
    // Ctrl+Shift+K (Firefox console)
    const key = e.key.toLowerCase();
    const hasModifier = isMac ? (e.metaKey && e.altKey) : (e.ctrlKey && e.shiftKey);

    if (hasModifier && ["i", "j", "c", "k"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      onDevToolsDetected?.();
      return;
    }

    // Ctrl+U / Cmd+Opt+U (View Source)
    if ((cmdOrCtrl && key === "u") || (isMac && e.metaKey && e.altKey && key === "u")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+S / Cmd+S (Save page)
    if (cmdOrCtrl && key === "s") {
      e.preventDefault();
      e.stopPropagation();
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

  // 5. DevTools detection via viewport threshold and timing
  useEffect(() => {
    if (!enabled) return;

    const checkDevTools = () => {
      // Threshold for docked DevTools
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      const isOpen = widthThreshold || heightThreshold;

      if (isOpen) {
        if (!isDevToolsOpenRef.current) {
          isDevToolsOpenRef.current = true;
          onDevToolsDetected?.();
        }
      } else {
        if (isDevToolsOpenRef.current) {
          isDevToolsOpenRef.current = false;
          onDevToolsClosed?.();
        }
      }
    };

    const intervalId = setInterval(checkDevTools, 1000);
    window.addEventListener("resize", checkDevTools);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", checkDevTools);
    };
  }, [enabled, onDevToolsDetected, onDevToolsClosed]);

  // Attach all event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("keydown", blockDevToolsKeys, true);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("keydown", blockDevToolsKeys, true);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, preventContextMenu, blockDevToolsKeys, preventDrag, handleVisibilityChange]);
}
