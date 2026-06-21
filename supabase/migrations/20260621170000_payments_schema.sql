-- supabase/migrations/20260621170000_payments_schema.sql

-- ==========================================
-- 1. PAYMENTS TABLE (Razorpay Integration)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'created', -- created, authorized, captured, failed, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster lookups during webhooks/verification
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_profile_id ON public.payments(profile_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = profile_id);
-- Updates to payments typically happen via secure backend API (service role bypasses RLS).
