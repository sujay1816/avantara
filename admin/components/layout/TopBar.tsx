'use client'

import { useState } from 'react'
import { Bell, Search } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, message: 'New order #AVT567890 received', time: '2 min ago', unread: true },
  { id: 2, message: 'Return request for #AVT123456', time: '15 min ago', unread: true },
  { id: 3, message: 'Mysore Silk — Forest Green out of stock', time: '1 hr ago', unread: false },
]

export default function TopBar({ title }: { title?: string }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <div className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-30"
      style={{ borderColor: '#E5E7EB' }}>
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 h-9 w-52"
          style={{ borderColor: '#E5E7EB', background: '#F9FAFB' }}>
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="Search..." className="text-sm text-gray-600 bg-transparent w-full" />
        </div>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border"
            style={{ borderColor: '#E5E7EB' }}>
            <Bell size={16} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ background: '#C9956C', fontSize: 9 }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ borderColor: '#E5E7EB' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
                <span className="font-medium text-sm">Notifications</span>
                <span className="text-xs" style={{ color: '#C9956C' }}>{unreadCount} new</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: '#F3F4F6', background: n.unread ? '#FDFAF7' : 'white' }}>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ background: '#C9956C' }}>A</div>
      </div>
    </div>
  )
}
