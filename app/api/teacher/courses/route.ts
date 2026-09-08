import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CourseItem } from '@/lib/droos-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeLevelId = searchParams.get('gradeLevelId');
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
            created_at
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (gradeLevelId && gradeLevelId !== 'all') {
      query = query.eq('grade_level_id', gradeLevelId);
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
    if (!validTeacherId || validTeacherId === 'tchr-ahmed-saad-01') {
      const { data: dbTeacher } = await supabase.from('teachers').select('id').eq('phone', '01143825523').single();
      if (dbTeacher) {
        validTeacherId = dbTeacher.id;
      }
    }

    let validGradeLevelId = grade_level_id;
    // Check if the provided grade_level_id is a static ID (e.g. 'grd-sec-3')
    const { EGYPTIAN_GRADE_LEVELS } = await import('@/lib/droos-data');
    const staticGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === grade_level_id);
    if (staticGrade) {
      const { data: dbGrade } = await supabase
        .from('grade_levels')
        .select('id')
        .eq('name_ar', staticGrade.name_ar)
        .single();
      if (dbGrade) {
        validGradeLevelId = dbGrade.id;
      }
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

