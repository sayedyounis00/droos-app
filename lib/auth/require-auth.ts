import { NextRequest } from 'next/server';
import { getAuthenticatedTeacher, TeacherUser } from '@/lib/auth/teacher-auth';
import { apiError } from '@/lib/api/responses';

/**
 * Verifies the authenticated teacher from an incoming request.
 * Returns the teacher if authenticated, or a 401 JSON response if not.
 *
 * Usage in API routes:
 * ```ts
 * const authResult = await requireAuth(request);
 * if ('response' in authResult) return authResult.response;
 * const teacher = authResult.teacher;
 * ```
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ teacher: TeacherUser } | { response: ReturnType<typeof apiError> }> {
  const teacher = await getAuthenticatedTeacher(request);

  if (!teacher) {
    return {
      response: apiError('غير مصرح لك بتنفيذ هذا الإجراء. يرجى تسجيل الدخول أولاً.', 401),
    };
  }

  return { teacher };
}
