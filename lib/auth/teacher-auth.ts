import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface TeacherUser {
  id: string;
  name: string;
  phone: string;
  subject: string;
  grades: string[];
  governorate: string;
  bio: string;
  subdomain?: string;
  subdomainLocked?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'SESSION_SECRET environment variable is required in production. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"'
    );
  }

  // Development-only fallback — logs a warning so it's never silently used
  console.warn(
    '⚠️ SESSION_SECRET is not set — using insecure development fallback. ' +
    'Set SESSION_SECRET in .env.local before deploying.'
  );
  return 'droos-dev-only-insecure-fallback-key';
}

const SESSION_SECRET = getSessionSecret();

/**
 * Maps a raw database teacher row to the TeacherUser interface.
 * Intentionally omits password_hash — never expose it to the client.
 */
export function mapDbRowToTeacherUser(row: Record<string, unknown>): TeacherUser {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    subject: (row.subject as string) || 'الرياضيات',
    grades: Array.isArray(row.grades)
      ? (row.grades as string[])
      : row.grades
      ? [row.grades as string]
      : [],
    governorate: (row.governorate as string) || 'القاهرة',
    bio: (row.bio as string) || '',
    subdomain: (row.subdomain as string) || '',
    subdomainLocked: Boolean(row.subdomain_locked),
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

/**
 * Hashes a plaintext password using bcrypt with salt rounds = 10.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Creates a signed session token: {teacherId}.{signature}
 */
export function createSessionToken(teacherId: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(teacherId);
  const signature = hmac.digest('hex');
  return `${teacherId}.${signature}`;
}

/**
 * Verifies a signed session token and returns teacherId if valid.
 */
export function verifySessionToken(token: string): string | null {
  if (!token || !token.includes('.')) return null;
  const [teacherId, signature] = token.split('.');
  if (!teacherId || !signature) return null;

  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(teacherId);
  const expectedSignature = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return teacherId;
  }

  return null;
}

/**
 * Extracts and verifies the authenticated teacher from an incoming Next.js request.
 */
export async function getAuthenticatedTeacher(
  request: NextRequest
): Promise<TeacherUser | null> {
  const token = request.cookies.get('droos_teacher_token')?.value;

  let teacherId: string | null = null;
  if (token) {
    teacherId = verifySessionToken(token);
  }

  // Graceful fallback for backward compatibility with existing session cookie
  if (!teacherId) {
    const rawSession = request.cookies.get('droos_teacher_session')?.value;
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession);
        if (parsed?.id) {
          teacherId = parsed.id;
        }
      } catch {}
    }
  }

  if (!teacherId) return null;

  const { data: dbTeacher, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', teacherId)
    .maybeSingle();

  if (error || !dbTeacher) return null;

  return mapDbRowToTeacherUser(dbTeacher);
}

/**
 * Authenticates a teacher by phone number and password against the Supabase teachers table.
 * Supports both bcrypt hashes and graceful auto-upgrade for legacy plaintext passwords.
 */
export async function authenticateTeacher(
  phone: string,
  pass: string
): Promise<{ success: boolean; teacher?: TeacherUser; token?: string; error?: string }> {
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

    const currentHash = dbTeacher.password_hash ?? '';
    const isBcryptHash =
      currentHash.startsWith('$2a$') ||
      currentHash.startsWith('$2b$') ||
      currentHash.startsWith('$2y$');

    let isValid = false;

    if (isBcryptHash) {
      isValid = await verifyPassword(pass, currentHash);
    } else {
      // Legacy plaintext password check
      isValid = currentHash === pass;

      // Auto-upgrade: Hash the legacy plaintext password in place
      if (isValid) {
        try {
          const newHashed = await hashPassword(pass);
          await supabase
            .from('teachers')
            .update({ password_hash: newHashed })
            .eq('id', dbTeacher.id);
        } catch (upgradeErr) {
          console.error('Failed to auto-upgrade legacy password hash:', upgradeErr);
        }
      }
    }

    if (!isValid) {
      return {
        success: false,
        error: 'رقم الهاتف أو كلمة المرور غير صحيحة. يرجى التثبت والمحاولة مرة أخرى.',
      };
    }

    const teacher = mapDbRowToTeacherUser(dbTeacher);
    const token = createSessionToken(teacher.id);

    return {
      success: true,
      teacher,
      token,
    };
  } catch (err) {
    console.error('Teacher auth database query exception:', err);
    return {
      success: false,
      error: 'حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.',
    };
  }
}
