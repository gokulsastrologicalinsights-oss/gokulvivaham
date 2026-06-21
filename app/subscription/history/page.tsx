import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function SubscriptionHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current active subscription
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch all payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  const activeSubscription = subscriptions?.find(s => s.status === 'active' && new Date(s.end_date) > new Date());

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscription History</h1>
        <Link href="/subscription" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Upgrade Plan
        </Link>
      </div>

      {/* Current Plan Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Current Plan</h2>
          {activeSubscription ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Free Plan
            </span>
          )}
        </div>
        <div className="p-6">
          {activeSubscription ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Plan Name</p>
                <p className="font-semibold text-lg">{activeSubscription.plan_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-lg capitalize">{activeSubscription.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Started On</p>
                <p className="font-medium">{format(new Date(activeSubscription.start_date), 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="font-medium">{format(new Date(activeSubscription.end_date), 'PPP')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">You are currently on the Free plan.</p>
              <Link href="/subscription" className="text-indigo-600 font-medium hover:text-indigo-800">
                View Premium Plans &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Payment History Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
      
      {payments && payments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.plan_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.currency} {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'captured' ? (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Success
                        </span>
                      ) : payment.status === 'failed' ? (
                        <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-md">
                          <XCircle className="w-4 h-4 mr-1" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md capitalize">
                          <Clock className="w-4 h-4 mr-1" />
                          {payment.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                      {payment.razorpay_order_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      )}
    </div>
  );
}
