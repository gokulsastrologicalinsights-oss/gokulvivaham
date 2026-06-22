-- supabase/migrations/20260622153000_fix_rls_policies.sql

-- 1. Interests: Add DELETE policy for the sender
CREATE POLICY "Users can delete own sent interests" 
ON public.interests 
FOR DELETE 
USING (auth.uid() = sender_id);

-- 2. Chats: Add INSERT and UPDATE policies
-- Allow users to create chats as long as they are one of the participants
CREATE POLICY "Users can insert own chats" 
ON public.chats 
FOR INSERT 
WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Allow users to update their own chats (e.g., status, updated_at, blocked_by_id)
CREATE POLICY "Users can update own chats" 
ON public.chats 
FOR UPDATE 
USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- 3. Messages: Fix INSERT policy and add UPDATE policy
-- Drop the existing insecure insert policy
DROP POLICY IF EXISTS "Users can send messages to own chats" ON public.messages;

-- Create a secure insert policy that verifies the sender is part of the chat
CREATE POLICY "Users can send messages to own chats" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE id = chat_id 
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
  )
);

-- Allow users to update messages in their own chats (e.g., mark as read)
CREATE POLICY "Users can update messages of own chats" 
ON public.messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE id = messages.chat_id 
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
  )
);
