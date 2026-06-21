-- supabase/migrations/20260621180000_admin_rbac_and_reports.sql

-- 1. Add Role to Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'profile', 'gallery', 'message'
  target_id UUID, -- id of gallery or message if applicable
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_profile_id ON public.reports(reported_profile_id);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 3. Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. Add Admin Policies
-- Note: Policies with 'ALL' will allow CRUD.
-- We only add policies that are not already covered or to bypass restriction.

-- Profiles: Admins can do anything
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete all profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Galleries
CREATE POLICY "Admins can manage galleries" ON public.galleries FOR ALL USING (public.is_admin());

-- Subscriptions
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL USING (public.is_admin());

-- Verification Requests
CREATE POLICY "Admins can manage verifications" ON public.verification_requests FOR ALL USING (public.is_admin());

-- Success Stories
CREATE POLICY "Admins can manage success_stories" ON public.success_stories FOR ALL USING (public.is_admin());

-- Reports
CREATE POLICY "Admins can manage reports" ON public.reports FOR ALL USING (public.is_admin());
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
