import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { LessonItem } from '@/lib/droos-data';
import { apiSuccess, apiError } from '@/lib/api/responses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module_id, title, content_type, video_url, description } = body ?? {};

    if (!module_id || !title) {
      return apiError('اسم الحصة ومعرف الدرس مطلوبان', 400);
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
      return apiError(error?.message ?? 'فشل إضافة الحصة في قاعدة البيانات', 500);
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

    return apiSuccess({
      lesson: newLesson,
      message: 'تمت إضافة الحصة بنجاح في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return apiError('حدث خطأ أثناء إضافة الحصة', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, video_url, description } = body ?? {};

    if (!id || !title) {
      return apiError('معرف الحصة واسم الحصة مطلوبان', 400);
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
      return apiError(error?.message ?? 'فشل تحديث الحصة في قاعدة البيانات', 500);
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

    return apiSuccess({
      lesson: updatedLesson,
      message: 'تم تحديث الحصة بنجاح',
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return apiError('حدث خطأ أثناء تعديل الحصة', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return apiError('معرف الحصة مطلوب', 400);
    }

    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

    if (error) {
      console.error('Supabase DB lesson delete error:', error);
      return apiError(error.message ?? 'فشل حذف الحصة من قاعدة البيانات', 500);
    }

    return apiSuccess({ message: 'تم حذف الحصة بنجاح من قاعدة البيانات' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return apiError('حدث خطأ أثناء حذف الحصة', 500);
  }
}

