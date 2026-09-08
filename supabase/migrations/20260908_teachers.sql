-- Migration: Create teachers table with subdomain single-edit lock & comprehensive fields
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    subject TEXT DEFAULT 'الرياضيات',
    grades TEXT DEFAULT 'الثانوية العامة والصف الثالث الثانوي',
    governorate TEXT DEFAULT 'القاهرة',
    bio TEXT DEFAULT 'معلم خبير مادة الرياضيات - المراحل الإعدادية والثانوية',
    subdomain TEXT UNIQUE,
    subdomain_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement & Policies
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read teachers" ON public.teachers;
DROP POLICY IF EXISTS "public write teachers" ON public.teachers;
DROP POLICY IF EXISTS "public all access teachers" ON public.teachers;
CREATE POLICY "public all access teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

-- Seed Dummy Teacher Data for "أحمد سعد"
-- Phone: 01143825523
-- Password: 12345678
-- Subdomain: ahmed-saad (Initially unlocked so user can test editing it once!)
INSERT INTO public.teachers (name, phone, password_hash, subject, grades, governorate, bio, subdomain, subdomain_locked)
VALUES (
    'أحمد سعد',
    '01143825523',
    '12345678',
    'الرياضيات',
    'الثانوية العامة والصف الثالث الثانوي',
    'القاهرة',
    'معلم خبير مادة الرياضيات - المراحل الإعدادية والثانوية',
    'ahmed-saad',
    FALSE
)
ON CONFLICT (phone) DO UPDATE 
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    subject = EXCLUDED.subject,
    grades = EXCLUDED.grades,
    governorate = EXCLUDED.governorate,
    bio = EXCLUDED.bio,
    subdomain = COALESCE(teachers.subdomain, EXCLUDED.subdomain);
