-- Add doshams column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS doshams TEXT[] DEFAULT '{}';

-- Create an index to optimize array searches
CREATE INDEX IF NOT EXISTS idx_profiles_doshams ON public.profiles USING GIN (doshams);
