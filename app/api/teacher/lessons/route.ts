import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { LessonItem } from '@/lib/droos-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module_id, title, content_type, video_url, description } = body || {};

    if (!module_id || !title) {
      return NextResponse.json(
        { success: false, error: 'اسم الحصة ومعرف الدرس مطلوبان' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id,
        title: title.trim(),
        content_type: content_type || 'video',
        video_url: video_url ? video_url.trim() : null,
        description: description ? description.trim() : null,
        sort_order: 1,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase DB lesson insert error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل إضافة الحصة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const newLesson: LessonItem = {
      id: data.id,
      module_id: data.module_id,
      title: data.title,
      content_type: data.content_type || 'video',
      video_url: data.video_url || undefined,
      description: data.description || undefined,
      created_at: data.created_at,
    };

    return NextResponse.json({ success: true, lesson: newLesson, message: 'تمت إضافة الحصة بنجاح في قاعدة البيانات' });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إضافة الحصة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, video_url, description } = body || {};

    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: 'معرف الحصة واسم الحصة مطلوبان' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({
        title: title.trim(),
        video_url: video_url ? video_url.trim() : null,
        description: description ? description.trim() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase DB lesson update error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل تحديث الحصة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const updatedLesson: LessonItem = {
      id: data.id,
      module_id: data.module_id,
      title: data.title,
      content_type: data.content_type || 'video',
      video_url: data.video_url || undefined,
      description: data.description || undefined,
      created_at: data.created_at,
    };

    return NextResponse.json({ success: true, lesson: updatedLesson, message: 'تم تحديث الحصة بنجاح' });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء تعديل الحصة' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'معرف الحصة مطلوب' }, { status: 400 });
    }

    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

    if (error) {
      console.error('Supabase DB lesson delete error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'فشل حذف الحصة من قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الحصة بنجاح من قاعدة البيانات' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حذف الحصة' }, { status: 500 });
  }
}

