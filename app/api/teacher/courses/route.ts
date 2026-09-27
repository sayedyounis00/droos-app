import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CourseItem, EGYPTIAN_GRADE_LEVELS } from '@/lib/droos-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawGradeLevelIds = searchParams.get('gradeLevelIds') || searchParams.get('gradeLevelId');
    const teacherId = searchParams.get('teacherId');

    let query = supabase
      .from('courses')
      .select(`
        id,
        teacher_id,
        grade_level_id,
        grade_levels (
          name_ar
        ),
        title,
        description,
        created_at,
        modules (
          id,
          course_id,
          title,
          sort_order,
          created_at,
          lessons (
            id,
            module_id,
            title,
            content_type,
            video_url,
            description,
            created_at
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (rawGradeLevelIds && rawGradeLevelIds !== 'all') {
      const ids = rawGradeLevelIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      // Translate static grade IDs (e.g. 'grd-sec-1') to actual database UUIDs
      const resolvedIds: string[] = [];
      for (const id of ids) {
        const staticGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === id);
        if (staticGrade) {
          const { data: gData } = await supabase
            .from('grade_levels')
            .select('id')
            .eq('name_ar', staticGrade.name_ar)
            .maybeSingle();
          if (gData?.id) {
            resolvedIds.push(gData.id);
          } else {
            resolvedIds.push(id);
          }
        } else {
          resolvedIds.push(id);
        }
      }

      if (resolvedIds.length === 1) {
        query = query.eq('grade_level_id', resolvedIds[0]);
      } else if (resolvedIds.length > 1) {
        query = query.in('grade_level_id', resolvedIds);
      }
    }

    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase DB fetch error:', error);
      return NextResponse.json({ success: false, error: 'حدث خطأ في تحميل الكورسات من قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({ success: true, courses: data || [], source: 'database' });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم أثناء تحميل الكورسات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, grade_level_id, teacher_id } = body || {};

    if (!title || !grade_level_id) {
      return NextResponse.json(
        { success: false, error: 'عنوان الدورة والصف الدراسي مطلوبة' },
        { status: 400 }
      );
    }

    let validTeacherId = teacher_id;
    let validGradeLevelId = grade_level_id;

    // Parallelize DB lookups for teacher & static grade resolution if needed
    const needTeacherLookup = !validTeacherId || validTeacherId === 'tchr-ahmed-saad-01';
    const staticGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === grade_level_id);

    if (needTeacherLookup || staticGrade) {
      const [teacherRes, gradeRes] = await Promise.all([
        needTeacherLookup
          ? supabase.from('teachers').select('id').eq('phone', '01143825523').maybeSingle()
          : Promise.resolve({ data: null }),
        staticGrade
          ? supabase.from('grade_levels').select('id').eq('name_ar', staticGrade.name_ar).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      if (teacherRes.data?.id) validTeacherId = teacherRes.data.id;
      if (gradeRes.data?.id) validGradeLevelId = gradeRes.data.id;
    }

    const courseData = {
      title: title.trim(),
      description: (description || '').trim(),
      grade_level_id: validGradeLevelId,
      teacher_id: validTeacherId,
    };

    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select(`
        id,
        teacher_id,
        grade_level_id,
        grade_levels (
          name_ar
        ),
        title,
        description,
        created_at,
        modules (
          id,
          course_id,
          title,
          sort_order,
          created_at,
          lessons (
            id,
            module_id,
            title,
            content_type,
            video_url,
            description,
            created_at
          )
        )
      `)
      .single();

    if (error || !data) {
      console.error('Supabase DB insert error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل حفظ الدورة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const rawGradeLevels = (data as any).grade_levels;
    const gradeLevelsObj = Array.isArray(rawGradeLevels) ? rawGradeLevels[0] : rawGradeLevels;

    const fullCourse: CourseItem = {
      ...(data as any),
      grade_levels: gradeLevelsObj || undefined,
      modules: data.modules || [],
    };

    return NextResponse.json({
      success: true,
      course: fullCourse,
      message: 'تمت إضافة الدورة بنجاح وحفظها في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إضافة الدورة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, grade_level_id } = body || {};

    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: 'معرف الدورة وعنوانها مطلوبان' },
        { status: 400 }
      );
    }

    // Resolve static grade ID to real DB UUID if needed
    let validGradeLevelId = grade_level_id;
    if (grade_level_id) {
      const staticGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === grade_level_id);
      if (staticGrade) {
        const { data: gradeData } = await supabase
          .from('grade_levels')
          .select('id')
          .eq('name_ar', staticGrade.name_ar)
          .maybeSingle();
        if (gradeData?.id) validGradeLevelId = gradeData.id;
      }
    }

    const updateData: Record<string, string> = {
      title: title.trim(),
    };
    if (description !== undefined) updateData.description = (description || '').trim();
    if (validGradeLevelId) updateData.grade_level_id = validGradeLevelId;

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        teacher_id,
        grade_level_id,
        grade_levels (
          name_ar
        ),
        title,
        description,
        created_at,
        modules (
          id,
          course_id,
          title,
          sort_order,
          created_at,
          lessons (
            id,
            module_id,
            title,
            content_type,
            video_url,
            description,
            created_at
          )
        )
      `)
      .single();

    if (error || !data) {
      console.error('Supabase DB course update error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل تحديث الدورة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      course: data,
      message: 'تم تحديث بيانات الدورة بنجاح',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء تعديل الدورة' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'معرف الدورة مطلوب' }, { status: 400 });
    }

    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (error) {
      console.error('Supabase DB course delete error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'فشل حذف الدورة من قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الدورة بنجاح' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حذف الدورة' }, { status: 500 });
  }
}
