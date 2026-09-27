export interface EducationalStage {
  id: string;
  name_ar: string;
  name_en?: string;
  sort_order: number;
}

export interface GradeLevel {
  id: string;
  stage_id: string;
  name_ar: string;
  name_en?: string;
  sort_order: number;
}

export interface LessonItem {
  id: string;
  module_id: string;
  title: string; // اسم الحصة
  content_type: 'video' | 'pdf' | 'quiz' | 'text';
  video_url?: string;
  description?: string;
  created_at: string;
}

export interface ModuleItem {
  id: string;
  course_id: string;
  title: string; // اسم الدرس
  sort_order: number;
  lessons: LessonItem[]; // قائمة الحصص
  created_at: string;
}

export interface CourseItem {
  id: string;
  teacher_id: string;
  grade_level_id: string;
  grade_levels?: { name_ar: string };
  title: string; // اسم الكورس / الدورة
  description?: string;
  modules: ModuleItem[]; // قائمة الدروس
  created_at: string;
}

// Reference Educational Stages
export const EGYPTIAN_STAGES: EducationalStage[] = [
  { id: 'stg-pri', name_ar: 'المرحلة الابتدائية', sort_order: 1 },
  { id: 'stg-prep', name_ar: 'المرحلة الإعدادية', sort_order: 2 },
  { id: 'stg-sec', name_ar: 'المرحلة الثانوية', sort_order: 3 },
];

// Reference Grade Levels
export const EGYPTIAN_GRADE_LEVELS: GradeLevel[] = [
  // المرحلة الابتدائية
  { id: 'grd-pri-1', stage_id: 'stg-pri', name_ar: 'الصف الأول الابتدائي', sort_order: 1 },
  { id: 'grd-pri-2', stage_id: 'stg-pri', name_ar: 'الصف الثاني الابتدائي', sort_order: 2 },
  { id: 'grd-pri-3', stage_id: 'stg-pri', name_ar: 'الصف الثالث الابتدائي', sort_order: 3 },
  { id: 'grd-pri-4', stage_id: 'stg-pri', name_ar: 'الصف الرابع الابتدائي', sort_order: 4 },
  { id: 'grd-pri-5', stage_id: 'stg-pri', name_ar: 'الصف الخامس الابتدائي', sort_order: 5 },
  { id: 'grd-pri-6', stage_id: 'stg-pri', name_ar: 'الصف السادس الابتدائي', sort_order: 6 },

  // المرحلة الإعدادية
  { id: 'grd-prep-1', stage_id: 'stg-prep', name_ar: 'الصف الأول الإعدادي', sort_order: 7 },
  { id: 'grd-prep-2', stage_id: 'stg-prep', name_ar: 'الصف الثاني الإعدادي', sort_order: 8 },
  { id: 'grd-prep-3', stage_id: 'stg-prep', name_ar: 'الصف الثالث الإعدادي', sort_order: 9 },

  // المرحلة الثانوية
  { id: 'grd-sec-1', stage_id: 'stg-sec', name_ar: 'الصف الأول الثانوي', sort_order: 10 },
  { id: 'grd-sec-2', stage_id: 'stg-sec', name_ar: 'الصف الثاني الثانوي', sort_order: 11 },
  { id: 'grd-sec-3', stage_id: 'stg-sec', name_ar: 'الصف الثالث الثانوي', sort_order: 12 },
];



