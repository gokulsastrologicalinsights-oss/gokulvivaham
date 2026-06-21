import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { moderateGalleryImage } from '../actions'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

async function getPendingGalleries() {
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

  const { data: galleries, error } = await supabase
    .from('galleries')
    .select(`
      id, image_url, created_at,
      profile:profiles!profile_id(first_name, last_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) console.error(error)
  return galleries || []
}

export default async function AdminGalleryPage() {
  const galleries = await getPendingGalleries()

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Gallery Moderation</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve or reject uploaded profile photos.
          </p>
        </div>
      </div>
      
      {galleries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No pending photos for moderation.</p>
        </div>
      ) : (
        <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {galleries.map((item: any) => (
            <li key={item.id} className="relative">
              <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                <img src={item.image_url} alt="" className="object-cover pointer-events-none group-hover:opacity-75" />
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                {item.profile?.first_name} {item.profile?.last_name}
              </p>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <form action={moderateGalleryImage.bind(null, item.id, 'approved')} className="flex-1">
                  <button type="submit" className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Approve
                  </button>
                </form>
                <form action={moderateGalleryImage.bind(null, item.id, 'rejected')} className="flex-1">
                  <button type="submit" className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                    Reject
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
