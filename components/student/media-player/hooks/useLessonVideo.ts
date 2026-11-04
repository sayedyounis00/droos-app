"use client";

import { useState, useEffect, useCallback } from "react";

interface UseLessonVideoResult {
  videoId: string | null;
  fetchError: boolean;
  isFetchingVideo: boolean;
  retry: () => void;
}

/**
 * Manages secure video ID fetching for a given lesson.
 * Obfuscates video source URL by fetching through the server-side API.
 */
export function useLessonVideo(lessonId: string, hasVideo: boolean): UseLessonVideoResult {
  const [loadedVideo, setLoadedVideo] = useState<{ lessonId: string; videoId: string } | null>(null);
  const [failedLessonId, setFailedLessonId] = useState<string | null>(null);

  const videoId = loadedVideo?.lessonId === lessonId ? loadedVideo.videoId : null;
  const fetchError = failedLessonId === lessonId;
  const isFetchingVideo = hasVideo && !videoId && !fetchError;

  useEffect(() => {
    if (!hasVideo || !lessonId) return;
    let cancelled = false;

    fetch(`/api/lesson/${lessonId}/video-url`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data.videoId) {
          setLoadedVideo({ lessonId, videoId: data.videoId });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailedLessonId(lessonId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId, hasVideo]);

  const retry = useCallback(() => {
    setFailedLessonId(null);
  }, []);

  return { videoId, fetchError, isFetchingVideo, retry };
}
