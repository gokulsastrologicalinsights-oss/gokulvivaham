import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';
import { getPlanByName } from '@/lib/plans';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planName } = await req.json();

    if (!planName) {
      return NextResponse.json({ error: 'Missing planName' }, { status: 400 });
    }

    const plan = getPlanByName(planName);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan name' }, { status: 400 });
    }

    const amount = plan.price;

    // Amount should be in paise
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_${user.id}_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);

    // Insert pending payment into DB
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        profile_id: user.id,
        plan_name: planName,
        amount: amount,
        currency: 'INR',
        razorpay_order_id: order.id,
        status: 'created',
      });

    if (insertError) {
      console.error('Error inserting payment:', insertError);
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
