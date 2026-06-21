"use client"

import { Bell } from 'lucide-react'

export default function AdminNavbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1">
          {/* Breadcrumbs or search could go here */}
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 hidden sm:block">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
