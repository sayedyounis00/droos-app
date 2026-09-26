import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ModuleItem } from '@/lib/droos-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course_id, title } = body || {};

    if (!course_id || !title) {
      return NextResponse.json(
        { success: false, error: 'اسم الدرس ومعرف الكورس مطلوبان' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('modules')
      .insert({
        course_id,
        title: title.trim(),
        sort_order: 1,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase DB module insert error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل إضافة الدرس في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const fullModule: ModuleItem = {
      ...data,
      lessons: [],
    };

    return NextResponse.json({
      success: true,
      module: fullModule,
      message: 'تمت إضافة الدرس بنجاح في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إضافة الدرس' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ success: false, error: 'معرف الدرس مطلوب' }, { status: 400 });
    }

    const { error } = await supabase.from('modules').delete().eq('id', moduleId);

    if (error) {
      console.error('Supabase DB module delete error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'فشل حذف الدرس من قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الدرس بنجاح من قاعدة البيانات' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حذف الدرس' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title } = body || {};

    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: 'معرف الدرس واسم الدرس مطلوبان' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('modules')
      .update({
        title: title.trim(),
      })
      .eq('id', id)
      .select(`
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
      `)
      .single();

    if (error || !data) {
      console.error('Supabase DB module update error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل تحديث اسم الدرس في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      module: data,
      message: 'تم تحديث اسم الدرس بنجاح',
    });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء تعديل اسم الدرس' }, { status: 500 });
  }
}
