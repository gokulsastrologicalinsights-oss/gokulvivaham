-- supabase/migrations/20260621151500_scalable_matrimony_schema.sql

-- Enable the UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  date_of_birth DATE,
  marital_status TEXT,
  height DECIMAL, -- stored in cm
  weight DECIMAL, -- stored in kg
  mother_tongue TEXT,
  religion TEXT,
  caste TEXT,
  sub_caste TEXT,
  gothram TEXT,
  rasi TEXT,
  nakshatra TEXT,
  lagnam TEXT,
  education TEXT,
  profession TEXT,
  annual_income TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  about_me TEXT,
  profile_picture_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active', -- active, suspended, deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. PARTNER PREFERENCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.partner_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  age_min INTEGER,
  age_max INTEGER,
  height_min DECIMAL,
  height_max DECIMAL,
  marital_status_pref TEXT[], -- Array of acceptable statuses
  religion_pref TEXT[],
  caste_pref TEXT[],
  mother_tongue_pref TEXT[],
  education_pref TEXT[],
  occupation_pref TEXT[],
  location_country_pref TEXT[],
  location_state_pref TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. GALLERIES TABLE (User Photos)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. INTERESTS TABLE (Expressing interest in another profile)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(sender_id, receiver_id) -- Prevent duplicate interests
);

-- ==========================================
-- 5. SHORTLISTS TABLE (Saving a profile)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shortlisted_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, shortlisted_profile_id) -- Prevent duplicate shortlists
);

-- ==========================================
-- 6. CHATS TABLE (Conversation Rooms)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CHECK (participant1_id < participant2_id), -- Ensure unique combination order
  UNIQUE(participant1_id, participant2_id) -- Prevent duplicate chat rooms
);

-- ==========================================
-- 7. MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 8. SUBSCRIPTIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active', -- active, expired, cancelled
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 9. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- interest_received, interest_accepted, message_received, system
  content TEXT NOT NULL,
  reference_id UUID, -- Optional link to interest_id, message_id, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 10. VERIFICATION REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- passport, aadhaar, driving_license
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID, -- Admin user ID
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- LEGACY TABLES (From initial schema)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  location TEXT NOT NULL,
  marriage_date DATE NOT NULL,
  story TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.membership_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_in_tamil TEXT,
  price INTEGER NOT NULL,
  duration_months INTEGER NOT NULL,
  color_theme TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  not_included TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.why_choose_us (
  id SERIAL PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- INDEXES FOR SCALABILITY & PERFORMANCE
-- ==========================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_marital_status ON public.profiles(marital_status);
CREATE INDEX IF NOT EXISTS idx_profiles_religion ON public.profiles(religion);
CREATE INDEX IF NOT EXISTS idx_profiles_caste ON public.profiles(caste);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON public.profiles(is_premium);

-- Galleries
CREATE INDEX IF NOT EXISTS idx_galleries_profile_id ON public.galleries(profile_id);

-- Interests
CREATE INDEX IF NOT EXISTS idx_interests_sender_id ON public.interests(sender_id);
CREATE INDEX IF NOT EXISTS idx_interests_receiver_id ON public.interests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON public.interests(status);

-- Shortlists
CREATE INDEX IF NOT EXISTS idx_shortlists_user_id ON public.shortlists(user_id);

-- Chats
CREATE INDEX IF NOT EXISTS idx_chats_participant1_id ON public.chats(participant1_id);
CREATE INDEX IF NOT EXISTS idx_chats_participant2_id ON public.chats(participant2_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_profile_id ON public.subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Verification Requests
CREATE INDEX IF NOT EXISTS idx_verification_requests_profile_id ON public.verification_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.why_choose_us ENABLE ROW LEVEL SECURITY;

-- Basic Policies for Public Tables
CREATE POLICY "Public read access for success_stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Public read access for membership_plans" ON public.membership_plans FOR SELECT USING (true);
CREATE POLICY "Public read access for why_choose_us" ON public.why_choose_us FOR SELECT USING (true);

-- Authenticated Users Policies
CREATE POLICY "Authenticated users can view active profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated' AND status = 'active');
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own preferences" ON public.partner_preferences FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view approved galleries" ON public.galleries FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can manage own galleries" ON public.galleries FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own interests" ON public.interests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send interests" ON public.interests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update received interests" ON public.interests FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can manage own shortlists" ON public.shortlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can view messages of own chats" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE id = messages.chat_id 
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages to own chats" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own verification requests" ON public.verification_requests FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create own verification requests" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = profile_id);
