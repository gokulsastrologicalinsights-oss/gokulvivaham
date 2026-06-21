'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: 0,
    features: ['Basic search', 'Send interests', 'View 5 profiles/day'],
    notIncluded: ['Send messages', 'View contact details', 'Priority support'],
    color: 'bg-gray-100',
    buttonColor: 'bg-gray-800 hover:bg-gray-900',
  },
  {
    name: 'Silver',
    price: 499,
    features: ['Advanced search', 'Send interests', 'View 20 profiles/day', 'Send 5 messages/day'],
    notIncluded: ['View contact details', 'Priority support'],
    color: 'bg-slate-100',
    buttonColor: 'bg-slate-600 hover:bg-slate-700',
  },
  {
    name: 'Gold',
    price: 999,
    features: ['Advanced search', 'Unlimited interests', 'Unlimited profiles', 'Unlimited messages', 'View 10 contact details/day'],
    notIncluded: ['Priority support'],
    color: 'bg-amber-50 border-amber-200 border-2',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    popular: true,
  },
  {
    name: 'Platinum',
    price: 1499,
    features: ['All Gold features', 'View unlimited contact details', 'Priority customer support', 'Profile highlighting'],
    notIncluded: [],
    color: 'bg-purple-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      alert("You are already on the Free plan.");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      // 1. Create Order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName: plan.name, amount: plan.price }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Gokul Vivaham",
        description: `${plan.name} Membership`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // 2. Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              router.push('/subscription/history');
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upgrade your Matrimony Experience
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan to find your life partner faster.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`rounded-2xl shadow-xl overflow-hidden flex flex-col ${plan.color} relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="px-6 py-8 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 text-center">{plan.name}</h3>
                <div className="mt-4 flex justify-center items-baseline text-4xl font-extrabold text-gray-900">
                  ₹{plan.price}
                  <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-gray-300" />
                      </div>
                      <p className="ml-3 text-base text-gray-500 line-through">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-6 border-t border-gray-200/50 bg-white/50">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${plan.buttonColor} transition-colors disabled:opacity-50`}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : plan.price === 0 ? (
                    'Current Plan'
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
