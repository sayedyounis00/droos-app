import { NextRequest, NextResponse } from 'next/server';
import { authenticateTeacher } from '@/lib/auth/teacher-auth';
import { apiSuccess, apiError } from '@/lib/api/responses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password, rememberMe } = body ?? {};

    if (!phone || !password) {
      return apiError('يرجى إدخال رقم الهاتف وكلمة المرور كاملاً', 400);
    }

    const result = await authenticateTeacher(phone, password);

    if (!result.success || !result.teacher) {
      return apiError(result.error ?? 'بيانات الدخول غير صحيحة', 401);
    }

    // Return success response and cookie/session payload
    const response = apiSuccess(
      {
        teacher: result.teacher,
        redirectTo: '/teacher/dashboard',
        message: 'تم تسجيل الدخول بنجاح',
      },
      200
    );

    // 30 days if rememberMe is true/default, 1 day if unchecked
    const cookieMaxAge = rememberMe === false ? 60 * 60 * 24 : 60 * 60 * 24 * 30;
    const isProduction = process.env.NODE_ENV === 'production';

    // Set signed httpOnly session token cookie (protected from XSS and tampering)
    if (result.token) {
      response.cookies.set({
        name: 'droos_teacher_token',
        value: result.token,
        httpOnly: true,
        secure: isProduction,
        path: '/',
        maxAge: cookieMaxAge,
        sameSite: 'lax',
      });
    }

    // Set teacher session cookie for client UI
    response.cookies.set({
      name: 'droos_teacher_session',
      value: JSON.stringify(result.teacher),
      httpOnly: false,
      secure: isProduction,
      path: '/',
      maxAge: cookieMaxAge,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Teacher login API error:', error);
    return apiError('حدث خطأ في الخادم. يرجى المحاولة لاحقاً', 500);
  }
}
