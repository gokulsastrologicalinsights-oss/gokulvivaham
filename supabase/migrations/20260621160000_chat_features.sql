-- Add image_url to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add status and blocked_by_id to chats table
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- active, blocked
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS blocked_by_id UUID REFERENCES public.profiles(id);

-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-images', 'chat-images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'chat-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read chat images
-- Since images are private and part of a chat, ideally only chat participants can view.
-- For simplicity in a prototype, if you have the URL, you can read it if authenticated.
CREATE POLICY "Authenticated users can read chat images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');

-- Allow users to update/delete their own images
CREATE POLICY "Users can update their own chat images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);
