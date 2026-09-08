# Agent Instructions — بناء قسم "إدارة الدروس والحصص الدراسية" (Droos Table)

**Audience:** This file is written to be read and executed by a coding agent (Antigravity) working
inside the Ta3leem project. It is not a discussion doc — treat every numbered step as an action item.

**Scope:** Build the teacher-facing section where a teacher picks a المرحلة/الصف (educational
stage/grade), manages courses under it, and adds دروس (lessons/chapters) and حصص (class sessions)
inside each course, with filter chips to narrow the view by year.

---

## 0. Mandatory Pre-Check — Do This Before Writing Any Code

Do not assume the schema described below is missing. Connect via the Supabase MCP connection and
inspect the live project first.

Run (via MCP tools — `list_tables`, then `execute_sql` or the schema-inspection equivalent):

- [ ] List all tables in the `public` schema.
- [ ] Check whether a stage/grade reference table already exists under any name
      (`grade_levels`, `academic_years`, `educational_stages`, `stages`, etc.).
- [ ] Describe the `courses` table — does it already have a column linking it to a grade/level?
- [ ] Describe the `modules` table — confirm it has a `course_id` FK and a title/name column.
- [ ] Describe the `lessons` table — confirm it has a `module_id` FK and a title/name column.

**Decision branch:**
- Everything below already exists and matches → skip straight to Section 3 (Frontend).
- Some of it exists under different names → **reuse it, do not create duplicates.** Adapt the
  naming in this doc to match what's live, and note the mismatch back to the user.
- Nothing exists → proceed with Section 2 in full.

> ⚠️ **Guardrail (from `GEMINI.md`):** If `courses` already has rows in it, confirm with the user
> before running any migration that adds a required (`NOT NULL`) column to it. Add the column as
> nullable first, backfill, then tighten the constraint in a follow-up, confirmed step.

---

## 1. Terminology Map (Arabic UI ↔ Database)

| Arabic term (shown in UI) | What it means | Maps to |
|---|---|---|
| المرحلة الدراسية | Educational stage (primary/prep/secondary) | **NEW:** `educational_stages` |
| الصف الدراسي | Grade/year within a stage | **NEW:** `grade_levels` |
| الدورة / الكورس | Course | existing `courses` |
| **الدرس** | Lesson — a chapter/topic grouping, teacher types its name | existing `modules` table |
| **الحصة** | Class session — the actual content unit, teacher types its name | existing `lessons` table |

Do **not** create new tables for "الدرس" or "الحصة" — they are UI labels over `modules` and
`lessons`, which already exist. Only "المرحلة" / "الصف" are genuinely new concepts.

---

## 2. Database Schema (only build what Section 0 found missing)

### 2.1 `educational_stages`

```sql
create table if not exists educational_stages (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null unique,
  name_en text,
  sort_order int not null,
  created_at timestamptz not null default now()
);
```

### 2.2 `grade_levels`

```sql
create table if not exists grade_levels (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references educational_stages(id) on delete cascade,
  name_ar text not null,
  name_en text,
  sort_order int not null,
  created_at timestamptz not null default now(),
  unique (stage_id, name_ar)
);
```

### 2.3 Link `courses` to a grade level

```sql
alter table courses
  add column if not exists grade_level_id uuid references grade_levels(id);

create index if not exists idx_courses_grade_level on courses (grade_level_id);
```

Leave this nullable initially (see guardrail in Section 0). Once existing rows are backfilled and
the user confirms, tighten it:

```sql
alter table courses alter column grade_level_id set not null;
```

### 2.4 Seed data (assumption — see Section 6)

```sql
insert into educational_stages (name_ar, name_en, sort_order) values
  ('المرحلة الابتدائية', 'Primary', 1),
  ('المرحلة الإعدادية', 'Preparatory', 2),
  ('المرحلة الثانوية', 'Secondary', 3)
on conflict (name_ar) do nothing;

insert into grade_levels (stage_id, name_ar, sort_order) values
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف الأول الابتدائي', 1),
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف الثاني الابتدائي', 2),
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف الثالث الابتدائي', 3),
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف الرابع الابتدائي', 4),
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف الخامس الابتدائي', 5),
  ((select id from educational_stages where name_ar = 'المرحلة الابتدائية'), 'الصف السادس الابتدائي', 6)
on conflict (stage_id, name_ar) do nothing;

insert into grade_levels (stage_id, name_ar, sort_order) values
  ((select id from educational_stages where name_ar = 'المرحلة الإعدادية'), 'الصف الأول الإعدادي', 1),
  ((select id from educational_stages where name_ar = 'المرحلة الإعدادية'), 'الصف الثاني الإعدادي', 2),
  ((select id from educational_stages where name_ar = 'المرحلة الإعدادية'), 'الصف الثالث الإعدادي', 3)
on conflict (stage_id, name_ar) do nothing;

insert into grade_levels (stage_id, name_ar, sort_order) values
  ((select id from educational_stages where name_ar = 'المرحلة الثانوية'), 'الصف الأول الثانوي', 1),
  ((select id from educational_stages where name_ar = 'المرحلة الثانوية'), 'الصف الثاني الثانوي', 2),
  ((select id from educational_stages where name_ar = 'المرحلة الثانوية'), 'الصف الثالث الثانوي', 3)
on conflict (stage_id, name_ar) do nothing;
```

### 2.5 RLS

These are shared reference tables (same for every teacher), not tenant data — readable by
everyone, writable by no one through the app.

```sql
alter table educational_stages enable row level security;
alter table grade_levels enable row level security;

create policy "public read educational_stages"
  on educational_stages for select
  using (true);

create policy "public read grade_levels"
  on grade_levels for select
  using (true);
```

Do **not** add insert/update/delete policies for teachers or students on these two tables — they
are managed only via migration/admin, not the app UI. Leave existing RLS on `courses`, `modules`,
`lessons` untouched — this feature only adds a filter column, it doesn't change ownership rules.

### 2.6 Regenerate types

After the migration is applied, run the Supabase MCP type-generation tool so the frontend gets
typed access to the two new tables and the new `courses.grade_level_id` column.

---

## 3. Frontend Spec

### 3.1 `GradeLevelSelector` (two-step dropdown)

Used inside the "إنشاء دورة" (create course) form. Required field.

- Step 1: dropdown of `educational_stages`, ordered by `sort_order`, label = `name_ar`.
- Step 2: dropdown of `grade_levels` filtered by the chosen `stage_id`, ordered by `sort_order`.
- On submit, store the selected `grade_levels.id` as `courses.grade_level_id`.

### 3.2 `GradeLevelFilterChips`

Sits above the courses list on the management page.

- One chip per `grade_level`, grouped visually by stage (e.g. a muted stage label above each
  cluster of chips, or a subtle divider between stages) — not a flat unordered list.
- A leading "الكل" chip, selected by default, which clears the filter.
- Single-select behavior (radio-like): choosing a chip narrows the courses list to that
  `grade_level_id`; choosing another chip replaces the filter, it doesn't add to it.
- RTL: chip row should scroll/flow right-to-left, consistent with the rest of the app's `dir="rtl"`.
- Style per `color-theme.md`: selected chip uses the teal primary; unselected chips neutral with a
  visible hover/focus state; keep contrast readable against the dark-mode palette too.

### 3.3 Page structure — `/dashboard/lessons` (or the project's existing dashboard route pattern —
confirm the convention already used by other dashboard pages, e.g. `/dashboard/courses`, and match
it rather than inventing a new one)

Top to bottom:

1. Page header: **"إدارة الدروس والحصص الدراسية"**
2. `GradeLevelFilterChips`
3. **"+ إضافة دورة"** button → opens the course creation form (includes `GradeLevelSelector`
   + course name/description fields already defined by the existing `courses` schema)
4. Filtered courses list. Each course is expandable (accordion) and shows:
   - **"+ إضافة درس"** → a text field, "اسم الدرس", writes into `modules.title`
   - List of دروس (modules) for that course, each expandable, showing:
     - **"+ إضافة حصة"** → a text field, "اسم الحصة", writes into `lessons.title`
       (plus whatever content-type field `lessons` already has — video/text/quiz/file — expose
       that too, don't drop it just because this task only asked for the name)
     - List of حصص (lessons) under that درس

Empty states needed: no courses yet for the selected grade, a course with no دروس yet, a درس with
no حصص yet — each should show a short Arabic prompt + the relevant "add" action, not a blank space.

---

## 4. Execution Order

1. Run the Section 0 pre-check via Supabase MCP.
2. If schema gaps found: write the migration from Section 2.1–2.3, **pause and confirm with the
   user** if `courses` already has data, then apply it via the MCP migration tool.
3. Seed reference data (2.4) — check for existing rows first so this stays idempotent if re-run.
4. Apply RLS (2.5).
5. Regenerate TypeScript types (2.6).
6. Build `GradeLevelSelector` and `GradeLevelFilterChips` components.
7. Build the `/dashboard/lessons` page wiring courses/modules/lessons CRUD to the two components.
8. Test end-to-end: create a course tagged to "الصف الأول الثانوي" → add a درس → add a حصة →
   confirm the chip for "الصف الأول الثانوي" correctly shows/hides that course.
9. Report back: what already existed vs. what was created, and flag any naming mismatches found
   in Section 0 that this doc didn't anticipate.

---

## 5. Guardrails (carried over from `GEMINI.md`)

- Confirm with the user before any migration that could touch existing data (`NOT NULL` on a
  populated table, renaming live columns, altering RLS on `courses`/`modules`/`lessons`).
- Do not change teacher/student auth logic as part of this task — out of scope here.
- Commit the migration and the frontend work as separate, clearly labeled commits.

---

## 6. Assumptions Made in This Doc — Confirm or Override

- Seeded all three standard Egyptian pre-university stages (ابتدائي / إعدادي / ثانوي), not just
  ثانوي — since the platform likely isn't secondary-only. Trim the seed data if it should be.
- Filter chips are single-select, not multi-select.
- "الدرس" = `modules`, "الحصة" = `lessons` — confirm this matches intent before the agent builds
  on it, since Section 0 may reveal these tables are named or shaped differently than assumed here.
