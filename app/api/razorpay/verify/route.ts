import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

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

    // 1. Update payment status
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (updateError || !payment) {
      console.error('Error updating payment:', updateError);
      return NextResponse.json({ error: 'Failed to update payment record' }, { status: 500 });
    }

    // 2. Make user premium in profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile to premium:', profileError);
    }

    // 3. Create or update subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        profile_id: user.id,
        plan_name: payment.plan_name,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days for now
        status: 'active',
        payment_reference: razorpay_payment_id,
      });

    if (subError) {
      console.error('Error inserting subscription:', subError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
