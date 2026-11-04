/**
 * Detects whether a keyboard event matches known DevTools or inspect shortcuts
 * across Windows, macOS, and Linux.
 */
export function isDevToolsShortcut(e: KeyboardEvent): boolean {
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
  const key = e.key.toLowerCase();

  // F12 key
  if (e.key === "F12" || e.keyCode === 123) {
    return true;
  }

  // Ctrl+Shift+I / Cmd+Opt+I (Developer Tools)
  // Ctrl+Shift+J / Cmd+Opt+J (Console)
  // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element)
  // Ctrl+Shift+K (Firefox console)
  const hasModifier = isMac ? e.metaKey && e.altKey : e.ctrlKey && e.shiftKey;
  if (hasModifier && ["i", "j", "c", "k"].includes(key)) {
    return true;
  }

  // Ctrl+U / Cmd+Opt+U (View Source)
  if ((cmdOrCtrl && key === "u") || (isMac && e.metaKey && e.altKey && key === "u")) {
    return true;
  }

  // Ctrl+S / Cmd+S (Save page)
  if (cmdOrCtrl && key === "s") {
    return true;
  }

  return false;
}

/**
 * Checks window dimensions to detect whether docked DevTools are currently open.
 */
export function isDevToolsDimensionsOpen(): boolean {
  if (typeof window === "undefined") return false;
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;
  return widthThreshold || heightThreshold;
}
