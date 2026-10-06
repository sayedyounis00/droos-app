import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth/require-auth';
import { apiSuccess, apiError } from '@/lib/api/responses';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('response' in authResult) return authResult.response;
    const teacher = authResult.teacher;

    const teacherId = teacher.id;

    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .eq('teacher_id', teacherId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching teacher platform:', error);
      return apiError('حدث خطأ أثناء تحميل بيانات المنصة', 500);
    }

    if (!data) {
      return apiSuccess({ platform: null });
    }

    const themeConfig = data.theme as Record<string, unknown> | null;

    return apiSuccess({
      platform: data,
      themeId: themeConfig?.themeId ?? 'horizon',
      homePageData: themeConfig?.homePageData ?? null,
    });
  } catch (error) {
    console.error('Error in GET /api/teacher/homepage:', error);
    return apiError('حدث خطأ في الخادم أثناء تحميل إعدادات الصفحة', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('response' in authResult) return authResult.response;
    const teacher = authResult.teacher;

    const body = await request.json();
    const {
      themeId,
      homePageData,
      status = 'published',
    } = body ?? {};

    const effectiveTeacherId = teacher.id;

    // Fetch teacher row to get verified name and subdomain
    const { data: teacherRow, error: teacherError } = await supabase
      .from('teachers')
      .select('name, subdomain')
      .eq('id', effectiveTeacherId)
      .maybeSingle();

    if (teacherError) {
      console.error('Error fetching teacher for platform:', teacherError);
    }

    const fallbackSlug = `teacher-${effectiveTeacherId.slice(0, 8)}`;
    const platformSlug = teacherRow?.subdomain?.trim().toLowerCase() || fallbackSlug;
    const platformName = teacherRow?.name?.trim() || homePageData?.about?.name || 'منصة المعلم';

    const themePayload = {
      themeId: themeId || 'horizon',
      homePageData: homePageData || {},
      updatedAt: new Date().toISOString(),
    };

    const { data: savedPlatform, error: upsertError } = await supabase
      .from('platforms')
      .upsert(
        {
          teacher_id: effectiveTeacherId,
          name: platformName,
          slug: platformSlug,
          description: homePageData?.about?.bio || '',
          theme: themePayload,
          status: status === 'published' ? 'published' : 'draft',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'teacher_id' }
      )
      .select()
      .maybeSingle();

    if (upsertError) {
      console.error('Error upserting platform:', upsertError);
      return apiError(`فشل حفظ إعدادات المنصة: ${upsertError.message}`, 500);
    }

    return apiSuccess({
      message: 'تم حفظ الصفحة وإعدادات المنصة بنجاح',
      platform: savedPlatform,
    });
  } catch (error) {
    console.error('Error in POST /api/teacher/homepage:', error);
    const message = error instanceof Error ? error.message : 'حدث خطأ في الخادم أثناء حفظ إعدادات الصفحة';
    return apiError(message, 500);
  }
}
