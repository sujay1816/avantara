'use client'

export const dynamic = 'force-dynamic'
import AdminLayout from '@/components/layout/AdminLayout'
import TopBar from '@/components/layout/TopBar'

export default function OrdersPage() {
  return (
    <AdminLayout>
      <TopBar title="Orders" />
      <div className="p-6">
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center" style={{ borderColor: '#F3F4F6' }}>
          <p className="text-gray-400 text-sm">Orders management — coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
