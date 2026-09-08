import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TeacherUser } from '@/lib/auth/teacher-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      phone,
      password,
      subject,
      grades,
      governorate,
      bio,
      subdomain,
      currentSubdomain,
      subdomainLocked,
    } = body || {};

    if (!name || !phone || !subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'الاسم ورقم الهاتف والمادة الدراسية حقول مطلوبة.',
        },
        { status: 400 }
      );
    }

    // Clean subdomain input (alphanumeric and dashes only, lowercase)
    let cleanedSubdomain = (subdomain || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Subdomain Lock Logic Check:
    let newSubdomainLocked = Boolean(subdomainLocked);
    let finalSubdomain = currentSubdomain || cleanedSubdomain;

    if (subdomainLocked) {
      finalSubdomain = currentSubdomain || cleanedSubdomain;
    } else if (cleanedSubdomain && cleanedSubdomain !== currentSubdomain) {
      finalSubdomain = cleanedSubdomain;
      newSubdomainLocked = true;
    }

    let targetTeacherId = id;
    if (!targetTeacherId || targetTeacherId === 'tchr-ahmed-saad-01') {
      const { data: dbTeacher } = await supabase.from('teachers').select('id').eq('phone', phone.trim()).single();
      if (dbTeacher) {
        targetTeacherId = dbTeacher.id;
      }
    }

    const updatePayload: Record<string, unknown> = {
      name: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      grades: (grades || 'المراحل الإعدادية والابتدائية').trim(),
      governorate: (governorate || 'القاهرة').trim(),
      bio: (bio || '').trim(),
      subdomain: finalSubdomain || null,
      subdomain_locked: newSubdomainLocked,
      updated_at: new Date().toISOString(),
    };

    if (password) {
      updatePayload.password_hash = password;
    }

    const { data: updatedDbTeacher, error } = await supabase
      .from('teachers')
      .update(updatePayload)
      .eq('id', targetTeacherId)
      .select()
      .single();

    if (error || !updatedDbTeacher) {
      console.error('Update teacher DB error:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'فشل تحديث بيانات الحساب في قاعدة البيانات' },
        { status: 500 }
      );
    }

    const updatedTeacher: TeacherUser = {
      id: updatedDbTeacher.id,
      name: updatedDbTeacher.name,
      phone: updatedDbTeacher.phone,
      password: updatedDbTeacher.password_hash,
      subject: updatedDbTeacher.subject,
      grades: updatedDbTeacher.grades,
      governorate: updatedDbTeacher.governorate,
      bio: updatedDbTeacher.bio,
      subdomain: updatedDbTeacher.subdomain || '',
      subdomainLocked: Boolean(updatedDbTeacher.subdomain_locked),
      createdAt: updatedDbTeacher.created_at || new Date().toISOString(),
    };

    const response = NextResponse.json(
      {
        success: true,
        teacher: updatedTeacher,
        message: 'تم تحديث بيانات الحساب بنجاح في قاعدة البيانات',
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'droos_teacher_session',
      value: JSON.stringify(updatedTeacher),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Update teacher profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في الخادم أثناء تحديث البيانات',
      },
      { status: 500 }
    );
  }
}

