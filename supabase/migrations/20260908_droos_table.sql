-- Migration: Create Educational Stages (Primary & Preparatory only), Grade Levels, Courses, Modules (الدروس), and Lessons (الحصص)

-- 1. Educational Stages (المراحل الدراسية)
CREATE TABLE IF NOT EXISTS public.educational_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL UNIQUE,
    name_en TEXT,
    sort_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Grade Levels (الصفوف الدراسية)
CREATE TABLE IF NOT EXISTS public.grade_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES public.educational_stages(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    sort_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (stage_id, name_ar)
);

-- 3. Courses (الدورات / الكورسات)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    grade_level_id UUID REFERENCES public.grade_levels(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS grade_level_id UUID REFERENCES public.grade_levels(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'platform_id') THEN 
        ALTER TABLE public.courses ALTER COLUMN platform_id DROP NOT NULL; 
    END IF; 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'slug') THEN 
        ALTER TABLE public.courses ALTER COLUMN slug DROP NOT NULL; 
    END IF; 
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_grade_level ON public.courses (grade_level_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON public.courses (teacher_id);

-- 4. Modules (الدروس — Topic/Chapter Groupings)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules (course_id);

-- 5. Lessons (الحصص — Class Sessions / Units)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT DEFAULT 'video', -- 'video' | 'pdf' | 'quiz' | 'text'
    video_url TEXT,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons (module_id);

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url TEXT;

DO $$ 
BEGIN 
    ALTER TABLE public.lessons ALTER COLUMN content_type TYPE TEXT USING content_type::text;
    ALTER TABLE public.lessons ALTER COLUMN content_type SET DEFAULT 'video';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Seed Reference Data for Educational Stages
INSERT INTO public.educational_stages (name_ar, name_en, sort_order) VALUES
    ('المرحلة الثانوية', 'Secondary', 1)
ON CONFLICT (name_ar) DO NOTHING;

-- Seed Secondary Grade Levels
INSERT INTO public.grade_levels (stage_id, name_ar, sort_order) VALUES
    ((SELECT id FROM public.educational_stages WHERE name_ar = 'المرحلة الثانوية'), 'الصف الأول الثانوي', 1),
    ((SELECT id FROM public.educational_stages WHERE name_ar = 'المرحلة الثانوية'), 'الصف الثاني الثانوي', 2),
    ((SELECT id FROM public.educational_stages WHERE name_ar = 'المرحلة الثانوية'), 'الصف الثالث الثانوي', 3)
ON CONFLICT (stage_id, name_ar) DO NOTHING;


-- RLS Policies
ALTER TABLE public.educational_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read educational_stages" ON public.educational_stages;
DROP POLICY IF EXISTS "public all access educational_stages" ON public.educational_stages;
CREATE POLICY "public all access educational_stages" ON public.educational_stages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read grade_levels" ON public.grade_levels;
DROP POLICY IF EXISTS "public all access grade_levels" ON public.grade_levels;
CREATE POLICY "public all access grade_levels" ON public.grade_levels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read courses" ON public.courses;
DROP POLICY IF EXISTS "public all access courses" ON public.courses;
CREATE POLICY "public all access courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read modules" ON public.modules;
DROP POLICY IF EXISTS "public all access modules" ON public.modules;
CREATE POLICY "public all access modules" ON public.modules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read lessons" ON public.lessons;
DROP POLICY IF EXISTS "public all access lessons" ON public.lessons;
CREATE POLICY "public all access lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);


-- Seed Sample Courses, Modules, and Lessons for Ahmed Saad (phone: 01143825523)
DO $$
DECLARE
    v_teacher_id UUID;
    v_prep3_id UUID;
    v_prep2_id UUID;
    v_course1_id UUID;
    v_course2_id UUID;
    v_module1_id UUID;
    v_module2_id UUID;
    v_module3_id UUID;
BEGIN
    SELECT id INTO v_teacher_id FROM public.teachers WHERE phone = '01143825523' LIMIT 1;
    IF v_teacher_id IS NOT NULL THEN
        -- Course 1: Prep 3 Math (Kept as an example, but perhaps we should change it to Sec 3 Math)
        SELECT id INTO v_prep3_id FROM public.grade_levels WHERE name_ar = 'الصف الثالث الثانوي' LIMIT 1;
        
        INSERT INTO public.courses (teacher_id, grade_level_id, title, description)
        VALUES (
            v_teacher_id,
            v_prep3_id,
            'دورة الجبر والهندسة والتمارين العامة - الصف الثالث الثانوي',
            'شرح كامل وتدريبات شاملة لمنهج الرياضيات الشهادة الثانوية'
        )
        RETURNING id INTO v_course1_id;

        IF v_course1_id IS NOT NULL THEN
            -- Module 1
            INSERT INTO public.modules (course_id, title, sort_order)
            VALUES (v_course1_id, 'الدرس الأول: التفاضل والتكامل', 1)
            RETURNING id INTO v_module1_id;

            INSERT INTO public.lessons (module_id, title, content_type, video_url, sort_order)
            VALUES 
                (v_module1_id, 'الحصة 1: مفهوم التفاضل', 'video', 'https://youtube.com/watch?v=sample1', 1),
                (v_module1_id, 'الحصة 2: تمارين محلولة واختبار قصير', 'pdf', NULL, 2);
        END IF;
    END IF;
END $$;
