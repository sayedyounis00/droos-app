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

      if (ids.length === 1) {
        query = query.eq('grade_level_id', ids[0]);
      } else if (ids.length > 1) {
        query = query.in('grade_level_id', ids);
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
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase DB insert error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل حفظ الدورة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const fullCourse: CourseItem = {
      ...data,
      modules: [],
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


