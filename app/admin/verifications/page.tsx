import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { moderateVerification } from '../actions'

export const dynamic = 'force-dynamic'

async function getPendingVerifications() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: verifications, error } = await supabase
    .from('verification_requests')
    .select(`
      id, profile_id, document_type, document_url, created_at, notes,
      profile:profiles!profile_id(first_name, last_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) console.error(error)
  return verifications || []
}

export default async function AdminVerificationsPage() {
  const verifications = await getPendingVerifications()

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Verification Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve user ID verification documents.
          </p>
        </div>
      </div>
      
      {verifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No pending verification requests.</p>
        </div>
      ) : (
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verifications.map((item: any) => (
            <li key={item.id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm border border-gray-200">
              <div className="flex flex-1 flex-col p-8">
                <div className="mx-auto h-40 w-full flex-shrink-0 rounded-md bg-gray-100 overflow-hidden relative group">
                  <a href={item.document_url} target="_blank" rel="noopener noreferrer">
                    <img className="h-full w-full object-cover group-hover:opacity-75 transition-opacity" src={item.document_url} alt="ID Document" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <span className="text-white text-sm font-semibold shadow-sm">View Full Document</span>
                    </div>
                  </a>
                </div>
                <h3 className="mt-6 text-sm font-medium text-gray-900">{item.profile?.first_name} {item.profile?.last_name}</h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Type</dt>
                  <dd className="text-sm text-gray-500 capitalize">{item.document_type.replace('_', ' ')}</dd>
                  <dt className="sr-only">Date Submitted</dt>
                  <dd className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <form action={moderateVerification.bind(null, item.id, item.profile_id, 'approved', undefined)} className="flex-1 flex">
                      <button type="submit" className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-green-600 hover:bg-green-50">
                        Approve
                      </button>
                    </form>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <form action={moderateVerification.bind(null, item.id, item.profile_id, 'rejected', undefined)} className="flex-1 flex">
                      <button type="submit" className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
