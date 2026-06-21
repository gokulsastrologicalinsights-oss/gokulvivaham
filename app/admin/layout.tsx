import Sidebar from '@/components/admin/Sidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'

export const metadata = {
  title: 'Admin Panel | Gokul Vivaham',
  description: 'Admin dashboard and management tools',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Static sidebar for desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        
        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
