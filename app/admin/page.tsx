import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Users, Star, ShieldCheck, ImageIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getAdminStats() {
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

  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: pendingVerifications },
    { count: pendingGallery },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('galleries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    totalUsers: totalUsers || 0,
    premiumUsers: premiumUsers || 0,
    pendingVerifications: pendingVerifications || 0,
    pendingGallery: pendingGallery || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const statCards = [
    { name: 'Total Users', stat: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Premium Members', stat: stats.premiumUsers, icon: Star, color: 'bg-yellow-500' },
    { name: 'Pending Verifications', stat: stats.pendingVerifications, icon: ShieldCheck, color: 'bg-emerald-500' },
    { name: 'Pending Gallery Photos', stat: stats.pendingGallery, icon: ImageIcon, color: 'bg-rose-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-xl bg-white px-4 pt-5 pb-12 shadow-sm border border-gray-100 sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md ${item.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.stat}
                </p>
              </dd>
            </div>
          )
        })}
      </div>

      {/* Placeholder for future charts or recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Signups</h2>
          <div className="mt-4 flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <span className="text-gray-400">Activity table coming soon</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900">Platform Analytics</h2>
          <div className="mt-4 flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <span className="text-gray-400">Charts coming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
