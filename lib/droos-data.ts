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
  { id: 'stg-sec', name_ar: 'المرحلة الثانوية', sort_order: 1 },
];

// Reference Grade Levels
export const EGYPTIAN_GRADE_LEVELS: GradeLevel[] = [
  // الثانوية
  { id: 'grd-sec-3', stage_id: 'stg-sec', name_ar: 'الصف الثالث الثانوي', sort_order: 1 },
  { id: 'grd-sec-2', stage_id: 'stg-sec', name_ar: 'الصف الثاني الثانوي', sort_order: 2 },
  { id: 'grd-sec-1', stage_id: 'stg-sec', name_ar: 'الصف الأول الثانوي', sort_order: 3 },
];


