import { supabase } from '@/lib/supabase';

export interface TeacherUser {
  id: string;
  name: string;
  phone: string;
  password?: string;
  subject: string;
  grades: string;
  governorate: string;
  bio: string;
  subdomain?: string;
  subdomainLocked?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Authenticates teacher by phone number and password from Supabase public.teachers table
 */
export async function authenticateTeacher(
  phone: string,
  pass: string
): Promise<{ success: boolean; teacher?: TeacherUser; error?: string }> {
  const cleanPhone = phone.trim().replace(/\s+/g, '');

  try {
    const { data: dbTeacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('phone', cleanPhone)
      .single();

    if (error || !dbTeacher) {
      return {
        success: false,
        error: 'رقم الهاتف أو كلمة المرور غير صحيحة. يرجى التثبت والمحاولة مرة أخرى.',
      };
    }

    if (dbTeacher.password_hash !== pass) {
      return {
        success: false,
        error: 'رقم الهاتف أو كلمة المرور غير صحيحة. يرجى التثبت والمحاولة مرة أخرى.',
      };
    }

    const teacher: TeacherUser = {
      id: dbTeacher.id,
      name: dbTeacher.name,
      phone: dbTeacher.phone,
      password: dbTeacher.password_hash,
      subject: dbTeacher.subject || 'الرياضيات',
      grades: dbTeacher.grades || 'المراحل الإعدادية والابتدائية',
      governorate: dbTeacher.governorate || 'القاهرة',
      bio: dbTeacher.bio || '',
      subdomain: dbTeacher.subdomain || '',
      subdomainLocked: Boolean(dbTeacher.subdomain_locked),
      createdAt: dbTeacher.created_at || new Date().toISOString(),
    };

    return {
      success: true,
      teacher,
    };
  } catch (err) {
    console.error('Teacher auth database query exception:', err);
    return {
      success: false,
      error: 'حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.',
    };
  }
}

