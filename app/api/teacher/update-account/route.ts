import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  TeacherUser,
  mapDbRowToTeacherUser,
  hashPassword,
  createSessionToken,
} from '@/lib/auth/teacher-auth';
import { requireAuth } from '@/lib/auth/require-auth';
import { apiSuccess, apiError } from '@/lib/api/responses';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if ('response' in authResult) return authResult.response;
    const authTeacher = authResult.teacher;

    const body = await request.json();
    const {
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
    } = body ?? {};

    const targetTeacherId = authTeacher.id;

    if (!name || !phone || !subject) {
      return apiError('الاسم ورقم الهاتف والمادة الدراسية حقول مطلوبة.', 400);
    }

    // Clean subdomain: alphanumeric and dashes only, lowercase
    const cleanedSubdomain = (subdomain ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Subdomain lock logic:
    // - If already locked, keep current value unchanged.
    // - If a new non-empty value is set, lock it permanently.
    let finalSubdomain: string | null;
    let newSubdomainLocked: boolean;

    if (subdomainLocked) {
      finalSubdomain = currentSubdomain ?? cleanedSubdomain ?? null;
      newSubdomainLocked = true;
    } else if (cleanedSubdomain && cleanedSubdomain !== currentSubdomain) {
      finalSubdomain = cleanedSubdomain;
      newSubdomainLocked = true;
    } else {
      finalSubdomain = currentSubdomain ?? cleanedSubdomain ?? null;
      newSubdomainLocked = Boolean(subdomainLocked);
    }

    const updatePayload: Record<string, unknown> = {
      name: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      grades: Array.isArray(grades) ? grades : [],
      governorate: (governorate ?? 'القاهرة').trim(),
      bio: (bio ?? '').trim(),
      subdomain: finalSubdomain || null,
      subdomain_locked: newSubdomainLocked,
      updated_at: new Date().toISOString(),
    };

    // Securely hash password with bcrypt if provided
    if (password && password.trim().length > 0) {
      updatePayload.password_hash = await hashPassword(password.trim());
    }

    const { data: updatedDbTeacher, error } = await supabase
      .from('teachers')
      .update(updatePayload)
      .eq('id', targetTeacherId)
      .select()
      .single();

    if (error || !updatedDbTeacher) {
      console.error('Update teacher DB error:', error);
      return apiError(error?.message ?? 'فشل تحديث بيانات الحساب في قاعدة البيانات', 500);
    }

    const updatedTeacher: TeacherUser = mapDbRowToTeacherUser(updatedDbTeacher);
    const isProduction = process.env.NODE_ENV === 'production';
    const newToken = createSessionToken(updatedTeacher.id);

    const response = apiSuccess(
      {
        teacher: updatedTeacher,
        message: 'تم تحديث بيانات الحساب بنجاح في قاعدة البيانات',
      },
      200
    );

    // Update secure signed session token
    response.cookies.set({
      name: 'droos_teacher_token',
      value: newToken,
      httpOnly: true,
      secure: isProduction,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    // Update teacher session cache for client UI
    response.cookies.set({
      name: 'droos_teacher_session',
      value: JSON.stringify(updatedTeacher),
      httpOnly: false,
      secure: isProduction,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Update teacher profile error:', error);
    return apiError('حدث خطأ في الخادم أثناء تحديث البيانات', 500);
  }
}
