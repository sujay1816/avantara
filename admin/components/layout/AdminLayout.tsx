'use client'

import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F8F9FA' }}>
      <Sidebar />
      <main className="flex-1 transition-all duration-300 overflow-auto" style={{ marginLeft: 240, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
