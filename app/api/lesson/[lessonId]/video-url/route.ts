import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/lesson/[lessonId]/video-url
 * 
 * Returns the YouTube video ID for a lesson WITHOUT exposing the full URL
 * to the client-side code. This prevents users from easily finding the
 * direct YouTube URL via browser DevTools network tab.
 * 
 * Phase 2 will add:
 * - Student authentication check
 * - Enrollment/subscription verification
 * - Rate limiting
 * - Token-based access with rotation
 */

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { lessonId } = await context.params;

    if (!lessonId) {
      return NextResponse.json(
        { error: "معرّف الحصة مطلوب" },
        { status: 400 }
      );
    }

    // Fetch the lesson's video_url from database
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("id, video_url, content_type")
      .eq("id", lessonId)
      .maybeSingle();

    if (error || !lesson) {
      return NextResponse.json(
        { error: "الحصة غير موجودة" },
        { status: 404 }
      );
    }

    if (!lesson.video_url) {
      return NextResponse.json(
        { error: "لا يوجد فيديو لهذه الحصة" },
        { status: 404 }
      );
    }

    // Extract YouTube video ID
    const match = lesson.video_url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );

    if (!match) {
      return NextResponse.json(
        { error: "رابط الفيديو غير صالح" },
        { status: 400 }
      );
    }

    const videoId = match[1];

    // Return only the video ID — not the full URL
    // Phase 2: Add signed token, expiry, session check
    return NextResponse.json({
      videoId,
      contentType: lesson.content_type,
      // In Phase 2, this will be a signed token with expiry
      // token: generateSignedToken(videoId, studentId, Date.now())
    });
  } catch (err) {
    console.error("Error in video-url API:", err);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
