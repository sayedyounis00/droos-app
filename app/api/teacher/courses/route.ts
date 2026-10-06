import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CourseItem, EGYPTIAN_GRADE_LEVELS, getGradeLevelUuid, isValidUuid } from '@/lib/droos-data';
import { apiSuccess, apiError } from '@/lib/api/responses';
import { COURSE_SELECT_QUERY } from '@/lib/queries/droos-queries';
import { getAuthenticatedTeacher } from '@/lib/auth/teacher-auth';

/**
 * Resolves any grade ID (e.g. 'grd-prep-3', 'الصف الثالث الإعدادي', or real UUID) to the database UUID.
 */
async function resolveGradeId(gradeId: string): Promise<string> {
  const mappedUuid = getGradeLevelUuid(gradeId);
  if (mappedUuid) return mappedUuid;

  const staticGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === gradeId);
  const nameToSearch = staticGrade?.name_ar ?? gradeId;

  const { data } = await supabase
    .from('grade_levels')
    .select('id')
    .eq('name_ar', nameToSearch)
    .maybeSingle();

  return data?.id ?? gradeId;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawGradeLevelIds = searchParams.get('gradeLevelIds') ?? searchParams.get('gradeLevelId');
    const teacherId = searchParams.get('teacherId');

    let query = supabase
      .from('courses')
      .select(COURSE_SELECT_QUERY)
      .order('created_at', { ascending: false });

    if (rawGradeLevelIds && rawGradeLevelIds !== 'all') {
      const ids = rawGradeLevelIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      const resolvedIds = await Promise.all(ids.map(resolveGradeId));
      const uniqueIds = [...new Set(resolvedIds)];

      if (uniqueIds.length === 1) {
        query = query.eq('grade_level_id', uniqueIds[0]);
      } else if (uniqueIds.length > 1) {
        query = query.in('grade_level_id', uniqueIds);
      }
    }

    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase DB fetch error:', error);
      return apiError('حدث خطأ في تحميل الكورسات من قاعدة البيانات', 500);
    }

    return apiSuccess({ courses: data ?? [], source: 'database' });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return apiError('حدث خطأ في الخادم أثناء تحميل الكورسات', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authTeacher = await getAuthenticatedTeacher(request);
    const body = await request.json();
    const { title, description, grade_level_id, teacher_id } = body ?? {};
    const effectiveTeacherId = authTeacher?.id ?? teacher_id;

    if (!title || !grade_level_id || !effectiveTeacherId) {
      return apiError('عنوان الدورة والصف الدراسي ومعرف المعلم مطلوبة', 400);
    }

    const validGradeLevelId = await resolveGradeId(grade_level_id);
    if (!isValidUuid(validGradeLevelId)) {
      return apiError('معرف الصف الدراسي غير صالح أو غير موجود بقاعدة البيانات', 400);
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        description: (description ?? '').trim(),
        grade_level_id: validGradeLevelId,
        teacher_id: effectiveTeacherId,
      })
      .select(COURSE_SELECT_QUERY)
      .single();

    if (error || !data) {
      console.error('Supabase DB insert error:', error);
      return apiError(error?.message ?? 'فشل حفظ الدورة في قاعدة البيانات', 500);
    }

    const rawData = data as Record<string, unknown>;
    const rawGradeLevels = rawData.grade_levels;
    const gradeLevelsObj = Array.isArray(rawGradeLevels) ? rawGradeLevels[0] : rawGradeLevels;

    const fullCourse: CourseItem = {
      ...(rawData as unknown as CourseItem),
      grade_levels: gradeLevelsObj as { name_ar: string } | undefined,
      modules: (rawData.modules as CourseItem['modules']) ?? [],
    };

    return apiSuccess({
      course: fullCourse,
      message: 'تمت إضافة الدورة بنجاح وحفظها في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return apiError('حدث خطأ أثناء إضافة الدورة', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, grade_level_id } = body ?? {};

    if (!id || !title) {
      return apiError('معرف الدورة وعنوانها مطلوبان', 400);
    }

    const updateData: Record<string, string> = { title: title.trim() };
    if (description !== undefined) updateData.description = (description ?? '').trim();
    if (grade_level_id) {
      const resolved = await resolveGradeId(grade_level_id);
      if (!isValidUuid(resolved)) {
        return apiError('معرف الصف الدراسي غير صالح', 400);
      }
      updateData.grade_level_id = resolved;
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select(COURSE_SELECT_QUERY)
      .single();

    if (error || !data) {
      console.error('Supabase DB course update error:', error);
      return apiError(error?.message ?? 'فشل تحديث الدورة في قاعدة البيانات', 500);
    }

    return apiSuccess({
      course: data,
      message: 'تم تحديث بيانات الدورة بنجاح',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return apiError('حدث خطأ أثناء تعديل الدورة', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return apiError('معرف الدورة مطلوب', 400);
    }

    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (error) {
      console.error('Supabase DB course delete error:', error);
      return apiError(error.message ?? 'فشل حذف الدورة من قاعدة البيانات', 500);
    }

    return apiSuccess({ message: 'تم حذف الدورة بنجاح' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return apiError('حدث خطأ أثناء حذف الدورة', 500);
  }
}
