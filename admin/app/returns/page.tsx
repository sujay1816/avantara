'use client'
import AdminLayout from '@/components/layout/AdminLayout'
import TopBar from '@/components/layout/TopBar'

export default function ReturnsPage() {
  return (
    <AdminLayout>
      <TopBar title="Returns" />
      <div className="p-6">
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center" style={{ borderColor: '#F3F4F6' }}>
          <p className="text-gray-400 text-sm">Returns management — coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
