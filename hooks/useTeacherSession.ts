import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherUser } from '@/lib/auth/teacher-auth';

export function useTeacherSession() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('droos_teacher');
    let initialData: TeacherUser | null = null;

    if (stored) {
      try {
        initialData = JSON.parse(stored);
      } catch {
        initialData = null;
      }
    }

    if (initialData) {
      setTeacher(initialData);
      setIsLoading(false);
    } else {
      router.replace('/teacher_login');
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('droos_teacher');
    document.cookie = 'droos_teacher_session=; path=/; max-age=0;';
    document.cookie = 'droos_teacher_token=; path=/; max-age=0;';
    router.replace('/teacher_login');
  }, [router]);

  return {
    teacher,
    setTeacher,
    isLoading,
    handleLogout,
  };
}
