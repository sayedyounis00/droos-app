import { NextRequest, NextResponse } from 'next/server';
import { authenticateTeacher } from '@/lib/auth/teacher-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body || {};

    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'يرجى إدخال رقم الهاتف وكلمة المرور كاملاً',
        },
        { status: 400 }
      );
    }

    const result = await authenticateTeacher(phone, password);

    if (!result.success || !result.teacher) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'بيانات الدخول غير صحيحة',
        },
        { status: 401 }
      );
    }

    // Return success response and cookie/session payload
    const response = NextResponse.json(
      {
        success: true,
        teacher: result.teacher,
        redirectTo: '/teacher/dashboard',
        message: 'تم تسجيل الدخول بنجاح',
      },
      { status: 200 }
    );

    // Set HTTP-only teacher session cookie
    response.cookies.set({
      name: 'droos_teacher_session',
      value: JSON.stringify(result.teacher),
      httpOnly: false, // Accessible to client-side session state
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Teacher login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً',
      },
      { status: 500 }
    );
  }
}
