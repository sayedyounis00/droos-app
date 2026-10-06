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

/**
 * Mapping of static grade IDs to real database UUIDs in Supabase grade_levels table.
 */
export const STATIC_GRADE_TO_UUID: Record<string, string> = {
  'grd-pri-1': 'b1b2c3d4-0001-0000-0000-000000000001',
  'grd-pri-2': 'b1b2c3d4-0002-0000-0000-000000000002',
  'grd-pri-3': 'b1b2c3d4-0003-0000-0000-000000000003',
  'grd-pri-4': 'b1b2c3d4-0004-0000-0000-000000000004',
  'grd-pri-5': 'b1b2c3d4-0005-0000-0000-000000000005',
  'grd-pri-6': 'b1b2c3d4-0006-0000-0000-000000000006',
  'grd-prep-1': 'c1b2c3d4-0001-0000-0000-000000000001',
  'grd-prep-2': 'c1b2c3d4-0002-0000-0000-000000000002',
  'grd-prep-3': 'c1b2c3d4-0003-0000-0000-000000000003',
  'grd-sec-1': '2437cf94-7bf8-45e0-966e-25eda895c5a5',
  'grd-sec-2': 'd67be7c5-2373-49bd-a931-df55275dcacb',
  'grd-sec-3': 'f8b01c72-d5cd-48f8-9d97-b39aff14888e',
};

/**
 * Mapping of grade Arabic names to real database UUIDs in Supabase.
 */
export const GRADE_NAME_TO_UUID: Record<string, string> = {
  'الصف الأول الابتدائي': 'b1b2c3d4-0001-0000-0000-000000000001',
  'الصف الثاني الابتدائي': 'b1b2c3d4-0002-0000-0000-000000000002',
  'الصف الثالث الابتدائي': 'b1b2c3d4-0003-0000-0000-000000000003',
  'الصف الرابع الابتدائي': 'b1b2c3d4-0004-0000-0000-000000000004',
  'الصف الخامس الابتدائي': 'b1b2c3d4-0005-0000-0000-000000000005',
  'الصف السادس الابتدائي': 'b1b2c3d4-0006-0000-0000-000000000006',
  'الصف الأول الإعدادي': 'c1b2c3d4-0001-0000-0000-000000000001',
  'الصف الثاني الإعدادي': 'c1b2c3d4-0002-0000-0000-000000000002',
  'الصف الثالث الإعدادي': 'c1b2c3d4-0003-0000-0000-000000000003',
  'الصف الأول الثانوي': '2437cf94-7bf8-45e0-966e-25eda895c5a5',
  'الصف الثاني الثانوي': 'd67be7c5-2373-49bd-a931-df55275dcacb',
  'الصف الثالث الثانوي': 'f8b01c72-d5cd-48f8-9d97-b39aff14888e',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(val: string): boolean {
  return UUID_REGEX.test(val);
}

/**
 * Resolves any grade identifier (static id, name_ar, or uuid) to a valid database UUID if known.
 */
export function getGradeLevelUuid(identifier: string): string | null {
  if (!identifier) return null;
  const trimmed = identifier.trim();
  if (STATIC_GRADE_TO_UUID[trimmed]) return STATIC_GRADE_TO_UUID[trimmed];
  if (GRADE_NAME_TO_UUID[trimmed]) return GRADE_NAME_TO_UUID[trimmed];
  if (isValidUuid(trimmed)) return trimmed;
  return null;
}


