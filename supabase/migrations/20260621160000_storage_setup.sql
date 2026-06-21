-- supabase/migrations/20260621160000_storage_setup.sql

-- Enable storage schema if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert the 'galleries' bucket for storing profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the 'galleries' bucket
-- Allow public read access to all objects in the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'galleries' );

-- Allow authenticated users to insert files to the bucket
CREATE POLICY "Authenticated users can upload photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'galleries' );

-- Allow users to update and delete their own photos
-- User ID is extracted from the path or handled by application logic assuming the first folder is their UUID or simply using auth.uid() check
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'galleries' AND owner = auth.uid() );

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'galleries' AND owner = auth.uid() );
