"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Image as ImageIcon, 
  CreditCard, 
  ShieldCheck, 
  Heart,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: Flag },
  { name: 'Gallery Moderation', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
  { name: 'Success Stories', href: '/admin/success-stories', icon: Heart },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center px-6">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">
          Admin Panel
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Exit Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
