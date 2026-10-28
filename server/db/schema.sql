-- ==============================================================================
-- Precious Pearls International School (PPIS) - Supabase Schema
-- Run this script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create Tables

-- studentREG Table (Student Registration)
CREATE TABLE IF NOT EXISTS public.studentREG (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    adm_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- student_results Table (Student Results)
CREATE TABLE IF NOT EXISTS public.student_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.studentREG(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    grade TEXT NOT NULL,
    term TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- school_media Table (School Media)
CREATE TABLE IF NOT EXISTS public.school_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    description TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 2. Setup Row Level Security (RLS)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.studentREG ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_media ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- studentREG Policies
-- ------------------------------------------------------------------------------
-- Admins can manage student registrations
CREATE POLICY "Admins can insert student registration" 
ON public.studentREG FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update student registration" 
ON public.studentREG FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete student registration" 
ON public.studentREG FOR DELETE 
TO authenticated 
USING (true);

-- Anyone can view student registration (needed for checking results if public)
-- If checking results requires an access code, adjust this as needed.
CREATE POLICY "Public can view student registration" 
ON public.studentREG FOR SELECT 
TO public 
USING (true);

-- ------------------------------------------------------------------------------
-- student_results Policies
-- ------------------------------------------------------------------------------
-- Admins can manage student results
CREATE POLICY "Admins can insert student results" 
ON public.student_results FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update student results" 
ON public.student_results FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete student results" 
ON public.student_results FOR DELETE 
TO authenticated 
USING (true);

-- Public can view student results (e.g. by student ID)
CREATE POLICY "Public can view student results" 
ON public.student_results FOR SELECT 
TO public 
USING (true);

-- ------------------------------------------------------------------------------
-- school_media Policies
-- ------------------------------------------------------------------------------
-- Admins can insert/delete media records
CREATE POLICY "Admins can insert school media" 
ON public.school_media FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Admins can delete school media" 
ON public.school_media FOR DELETE 
TO authenticated 
USING (true);

-- Public can view school media metadata
CREATE POLICY "Public can view school media" 
ON public.school_media FOR SELECT 
TO public 
USING (true);

-- ==============================================================================
-- 3. Storage Bucket Setup
-- ==============================================================================
-- Insert the bucket for school media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-media', 'school-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'school-media' bucket
-- Public can read files
CREATE POLICY "Public can view school media files" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'school-media');

-- Authenticated users (admins) can upload files
CREATE POLICY "Admins can upload school media files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'school-media');

-- Authenticated users (admins) can delete files
CREATE POLICY "Admins can delete school media files" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'school-media');
