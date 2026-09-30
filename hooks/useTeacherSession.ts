import { useEffect, useState } from 'react';
import { TeacherUser } from '@/lib/auth/teacher-auth';

export function useTeacherSession() {
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        window.location.href = '/teacher_login';
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('droos_teacher');
      document.cookie = 'droos_teacher_session=; path=/; max-age=0;';
      window.location.href = '/teacher_login';
    }
  };

  return {
    teacher,
    setTeacher,
    isLoading,
    handleLogout,
  };
}
