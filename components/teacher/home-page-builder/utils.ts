/** Extracts a privacy-enhanced YouTube embed URL from various YouTube URL formats. */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}
