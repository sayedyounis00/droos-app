import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ModuleItem } from '@/lib/droos-data';
import { apiSuccess, apiError } from '@/lib/api/responses';
import { MODULE_WITH_LESSONS_SELECT } from '@/lib/queries/droos-queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course_id, title } = body ?? {};

    if (!course_id || !title) {
      return apiError('اسم الدرس ومعرف الكورس مطلوبان', 400);
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
      return apiError(error?.message ?? 'فشل إضافة الدرس في قاعدة البيانات', 500);
    }

    const fullModule: ModuleItem = {
      ...data,
      lessons: [],
    };

    return apiSuccess({
      module: fullModule,
      message: 'تمت إضافة الدرس بنجاح في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return apiError('حدث خطأ أثناء إضافة الدرس', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return apiError('معرف الدرس مطلوب', 400);
    }

    const { error } = await supabase.from('modules').delete().eq('id', moduleId);

    if (error) {
      console.error('Supabase DB module delete error:', error);
      return apiError(error.message ?? 'فشل حذف الدرس من قاعدة البيانات', 500);
    }

    return apiSuccess({ message: 'تم حذف الدرس بنجاح من قاعدة البيانات' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return apiError('حدث خطأ أثناء حذف الدرس', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title } = body ?? {};

    if (!id || !title) {
      return apiError('معرف الدرس واسم الدرس مطلوبان', 400);
    }

    const { data, error } = await supabase
      .from('modules')
      .update({
        title: title.trim(),
      })
      .eq('id', id)
      .select(MODULE_WITH_LESSONS_SELECT)
      .single();

    if (error || !data) {
      console.error('Supabase DB module update error:', error);
      return apiError(error?.message ?? 'فشل تحديث اسم الدرس في قاعدة البيانات', 500);
    }

    return apiSuccess({
      module: data,
      message: 'تم تحديث اسم الدرس بنجاح',
    });
  } catch (error) {
    console.error('Error updating module:', error);
    return apiError('حدث خطأ أثناء تعديل اسم الدرس', 500);
  }
}
