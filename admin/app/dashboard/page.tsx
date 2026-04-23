'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Users, TrendingUp, RotateCcw, Package, AlertTriangle, Bell } from 'lucide-react'

const STATS = [
  { label: 'Total Revenue', value: '₹4,28,750', change: '+12.5%', positive: true, icon: TrendingUp },
  { label: 'Total Orders', value: '284', change: '+8.2%', positive: true, icon: ShoppingBag },
  { label: 'Total Customers', value: '1,247', change: '+15.3%', positive: true, icon: Users },
  { label: 'Return Requests', value: '12', change: '-3.1%', positive: true, icon: RotateCcw },
]

const RECENT_ORDERS = [
  { id: 'AVT123456', customer: 'Priya Sharma', amount: '₹28,873', status: 'delivered', date: '15 Mar 2025' },
  { id: 'AVT789012', customer: 'Ananya Krishnan', amount: '₹14,999', status: 'shipped', date: '14 Mar 2025' },
  { id: 'AVT345678', customer: 'Meera Iyer', amount: '₹9,999', status: 'placed', date: '13 Mar 2025' },
  { id: 'AVT901234', customer: 'Sunita Reddy', amount: '₹22,499', status: 'confirmed', date: '12 Mar 2025' },
]

const LOW_STOCK = [
  { name: 'Kanjivaram Pure Silk — Crimson Red', stock: 1 },
  { name: 'Banarasi Brocade — Royal Blue', stock: 2 },
  { name: 'Mysore Silk — Forest Green', stock: 0 },
]

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  placed: { bg: '#FFF3E8', color: '#C9956C' },
  confirmed: { bg: '#E8EDF8', color: '#1A3A6B' },
  shipped: { bg: '#E8F5EE', color: '#1B7A3E' },
  delivered: { bg: '#E8F5EE', color: '#1B7A3E' },
  cancelled: { bg: '#FCECEA', color: '#C0392B' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }),
}

export default function DashboardPage() {
  const [notifications] = useState([
    { id: 1, type: 'new_order', message: 'New order #AVT567890 received', time: '2 min ago' },
    { id: 2, type: 'return_request', message: 'Return request for #AVT123456', time: '15 min ago' },
    { id: 3, type: 'low_stock', message: 'Mysore Silk — Forest Green is out of stock', time: '1 hr ago' },
  ])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, Admin</p>
        </div>
        <div className="relative">
          <Bell size={22} className="text-gray-500 cursor-pointer" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50">
                  <Icon size={15} style={{ color: '#C9956C' }} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-xs" style={{ color: stat.positive ? '#1B7A3E' : '#C0392B' }}>
                {stat.change} from last month
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Recent Orders</h2>
            <a href="/orders" className="text-xs" style={{ color: '#C9956C' }}>View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order, i) => (
                  <motion.tr key={order.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">#{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded capitalize font-medium"
                        style={{ background: STATUS_STYLES[order.status]?.bg, color: STATUS_STYLES[order.status]?.color }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Low stock alerts */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              <AlertTriangle size={15} style={{ color: '#C9956C' }} />
              <h2 className="font-medium text-gray-800 text-sm">Low Stock Alerts</h2>
            </div>
            <div className="p-3 space-y-2">
              {LOW_STOCK.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-orange-50">
                  <p className="text-xs text-gray-700 flex-1 mr-2">{item.name}</p>
                  <span className="text-xs font-semibold flex-shrink-0"
                    style={{ color: item.stock === 0 ? '#C0392B' : '#C9956C' }}>
                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              <Bell size={15} style={{ color: '#C9956C' }} />
              <h2 className="font-medium text-gray-800 text-sm">Notifications</h2>
            </div>
            <div className="p-3 space-y-2">
              {notifications.map(n => (
                <div key={n.id} className="p-2 rounded-md bg-gray-50">
                  <p className="text-xs text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
