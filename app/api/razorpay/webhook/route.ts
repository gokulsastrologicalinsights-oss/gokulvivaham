import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // fallback to anon if service role isn't set, though RLS might block it
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const razorpay_order_id = paymentEntity.order_id;
      const razorpay_payment_id = paymentEntity.id;

      // 1. Get payment record
      const { data: payment, error: fetchError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (fetchError || !payment) {
        console.error('Payment record not found for webhook:', fetchError);
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }

      if (payment.status !== 'captured') {
        // Update payment status
        const { error: updateError } = await supabaseAdmin
          .from('payments')
          .update({
            razorpay_payment_id,
            status: 'captured',
          })
          .eq('id', payment.id);

        if (updateError) {
          console.error('Error updating payment in webhook:', updateError);
        }

        // Make user premium in profiles
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', payment.profile_id);

        if (profileError) {
          console.error('Error updating profile to premium in webhook:', profileError);
        }

        // Create or update subscription
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .insert({
            profile_id: payment.profile_id,
            plan_name: payment.plan_name,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            payment_reference: razorpay_payment_id,
          });

        if (subError) {
          console.error('Error inserting subscription in webhook:', subError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
