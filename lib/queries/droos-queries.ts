/**
 * Shared Supabase SELECT query fragments for courses, modules, and lessons.
 */

export const LESSON_SELECT_FIELDS = `
  id,
  module_id,
  title,
  content_type,
  video_url,
  description,
  created_at
` as const;

export const MODULE_WITH_LESSONS_SELECT = `
  id,
  course_id,
  title,
  sort_order,
  created_at,
  lessons (
    ${LESSON_SELECT_FIELDS}
  )
` as const;

export const COURSE_SELECT_QUERY = `
  id,
  teacher_id,
  grade_level_id,
  grade_levels (
    name_ar
  ),
  title,
  description,
  created_at,
  modules (
    ${MODULE_WITH_LESSONS_SELECT}
  )
` as const;
