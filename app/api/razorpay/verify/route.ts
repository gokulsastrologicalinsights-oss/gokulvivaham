import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { getPlanByName } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 1. Get payment details first to determine duration
    const { data: paymentInfo, error: fetchError } = await supabase
      .from('payments')
      .select('plan_name')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (fetchError || !paymentInfo) {
      return NextResponse.json({ error: 'Payment order not found' }, { status: 404 });
    }

    const plan = getPlanByName(paymentInfo.plan_name);
    const durationDays = plan?.durationDays || 30;

    // 2. Call secure RPC to capture payment, update profile, and add subscription
    const { data: rpcResult, error: rpcError } = await supabase.rpc('capture_payment', {
      p_order_id: razorpay_order_id,
      p_payment_id: razorpay_payment_id,
      p_signature: razorpay_signature,
      p_duration_days: durationDays
    });

    if (rpcError) {
      console.error('Error in capture_payment RPC:', rpcError);
      return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
