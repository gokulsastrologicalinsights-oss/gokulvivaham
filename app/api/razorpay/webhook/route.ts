import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

import { getPlanByName } from '@/lib/plans';

// Note: Using standard client with anon key since we now rely on Security Definer RPC
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

      // 1. Get payment record for duration logic
      const { data: payment, error: fetchError } = await supabaseAdmin
        .from('payments')
        .select('plan_name, status')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (fetchError || !payment) {
        console.error('Payment record not found for webhook:', fetchError);
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }

      if (payment.status !== 'captured') {
        const plan = getPlanByName(payment.plan_name);
        const durationDays = plan?.durationDays || 30;

        // 2. Call secure RPC
        const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('capture_payment', {
          p_order_id: razorpay_order_id,
          p_payment_id: razorpay_payment_id,
          p_signature: signature,
          p_duration_days: durationDays
        });

        if (rpcError) {
          console.error('Error in capture_payment RPC in webhook:', rpcError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
