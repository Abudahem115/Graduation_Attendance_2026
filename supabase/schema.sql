-- ============================================================
-- Graduation Attendance System — Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Create Batch Year Enum
CREATE TYPE batch_year AS ENUM ('2566', '2567', '2568', '2569');

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,
    title_prefix TEXT NOT NULL,
    full_name TEXT NOT NULL,
    batch batch_year NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Realtime for the students table
ALTER PUBLICATION supabase_realtime ADD TABLE students;

-- 4. Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow everyone to read students (for the public leaderboard)
CREATE POLICY "Anyone can view students"
    ON students FOR SELECT
    USING (true);

-- Allow public inserts for the registration form (anon users)
CREATE POLICY "Anyone can register"
    ON students FOR INSERT
    WITH CHECK (true);

-- Only authenticated users (admins) can update students
CREATE POLICY "Admins can update students"
    ON students FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can delete students
CREATE POLICY "Admins can delete students"
    ON students FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage Bucket Setup
-- ============================================================
-- NOTE: Create a storage bucket named 'student-photos' in the
-- Supabase Dashboard (Storage → New Bucket → "student-photos")
-- Set it as PUBLIC.
--
-- Then run the following policies:

-- Allow anyone to upload photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to the student-photos bucket
CREATE POLICY "Anyone can upload student photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'student-photos');

-- Allow public reads from the student-photos bucket
CREATE POLICY "Anyone can view student photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'student-photos');

-- Allow authenticated users to delete photos
CREATE POLICY "Admins can delete student photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'student-photos' AND auth.role() = 'authenticated');
