/**
 * YouTube IFrame API script loader and utility functions.
 */

let apiLoadPromise: Promise<void> | null = null;

/**
 * Load the YouTube IFrame API script once globally and cache the promise.
 */
export function loadYouTubeApi(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise<void>((resolve) => {
    // If already loaded and initialized
    if (typeof window !== "undefined" && window.YT?.Player) {
      resolve();
      return;
    }

    // Set the global callback
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();
      resolve();
    };

    // Inject script tag if not already in document
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return apiLoadPromise;
}

/**
 * Extract YouTube video ID from various URL formats.
 */
export function extractYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match?.[1] ?? null;
}
