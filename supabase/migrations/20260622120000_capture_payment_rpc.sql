-- supabase/migrations/20260622120000_capture_payment_rpc.sql

-- RPC to securely capture a payment and grant premium access
-- This runs with SECURITY DEFINER to bypass RLS, allowing it to update payments, profiles, and subscriptions.

CREATE OR REPLACE FUNCTION public.capture_payment(
  p_order_id TEXT,
  p_payment_id TEXT,
  p_signature TEXT,
  p_duration_days INT DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  v_payment RECORD;
  v_profile_id UUID;
  v_plan_name TEXT;
  v_result JSON;
BEGIN
  -- 1. Atomic check and update of payment
  UPDATE public.payments
  SET 
    razorpay_payment_id = p_payment_id,
    razorpay_signature = p_signature,
    status = 'captured',
    updated_at = now()
  WHERE razorpay_order_id = p_order_id AND status = 'created'
  RETURNING id, profile_id, plan_name INTO v_payment;

  -- If no row was updated, it either doesn't exist or was already captured
  IF v_payment IS NULL THEN
    RETURN json_build_object('success', true, 'message', 'Payment already processed or not found');
  END IF;

  v_profile_id := v_payment.profile_id;
  v_plan_name := v_payment.plan_name;

  -- 2. Grant premium to the profile
  UPDATE public.profiles
  SET is_premium = true
  WHERE id = v_profile_id;

  -- 3. Insert subscription record
  INSERT INTO public.subscriptions (
    profile_id,
    plan_name,
    start_date,
    end_date,
    status,
    payment_reference
  ) VALUES (
    v_profile_id,
    v_plan_name,
    now(),
    now() + (p_duration_days || ' days')::INTERVAL,
    'active',
    p_payment_id
  );

  RETURN json_build_object('success', true, 'message', 'Payment captured successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
