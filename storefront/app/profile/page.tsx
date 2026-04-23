'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight, Camera } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { formatPrice } from '@/lib/config'

type Tab = 'orders' | 'addresses' | 'wishlist' | 'settings'

const TABS = [
  { id: 'orders' as Tab, label: 'My Orders', icon: Package },
  { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
  { id: 'wishlist' as Tab, label: 'Wishlist', icon: Heart },
  { id: 'settings' as Tab, label: 'Account Settings', icon: Settings },
]

const ORDERS = [
  { id: 'o1', orderNumber: 'AVT123456', date: '2025-03-15', status: 'delivered', total: 28873, items: 2 },
  { id: 'o2', orderNumber: 'AVT789012', date: '2025-02-28', status: 'shipped', total: 14999, items: 1 },
  { id: 'o3', orderNumber: 'AVT345678', date: '2025-01-10', status: 'placed', total: 9999, items: 1 },
]

const STATUS_COLORS: Record<string, string> = {
  placed: '#C9956C',
  confirmed: '#1A3A6B',
  shipped: '#1B7A3E',
  delivered: '#1B7A3E',
  cancelled: '#C0392B',
  return_requested: '#C9956C',
}

const ADDRESSES = [
  { id: 'a1', fullName: 'Priya Sharma', phone: '9876543210', addressLine1: '42, Rose Garden', addressLine2: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', isDefault: true },
]

const WISHLIST = [
  { id: 'w1', name: 'Kanjivaram Pure Silk', price: 14999, slug: 'kanjivaram-pure-silk-saree', colourHex: '#1A3A6B' },
  { id: 'w2', name: 'Chanderi Cotton Saree', price: 3499, slug: 'chanderi-cotton-saree', colourHex: '#F5F0E8' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [user] = useState({ fullName: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210' })
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone })
  const [saved, setSaved] = useState(false)

  return (
    <>
      <Navbar />
      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User card */}
            <div className="p-5 border mb-4 text-center" style={{ borderColor: 'var(--color-border)' }}>
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium"
                  style={{ background: 'var(--color-accent)' }}>
                  {user.fullName.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ background: 'var(--color-text-primary)', color: 'white' }}>
                  <Camera size={10} />
                </button>
              </div>
              <p className="font-medium text-sm">{user.fullName}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{user.email}</p>
            </div>

            {/* Nav tabs */}
            <div className="border" style={{ borderColor: 'var(--color-border)' }}>
              {TABS.map((tab, i) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      borderBottom: i < TABS.length - 1 ? `1px solid var(--color-border)` : 'none',
                      background: activeTab === tab.id ? 'var(--color-bg-secondary)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)',
                    }}>
                    <Icon size={15} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight size={13} className="ml-auto" />}
                  </button>
                )
              })}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-t"
                style={{ borderColor: 'var(--color-border)', color: '#C0392B', fontFamily: 'var(--font-body)' }}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Orders */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>My Orders</h2>
                  {ORDERS.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No orders yet.</p>
                      <Link href="/shop" className="btn-primary mt-4 inline-flex">Shop Now</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ORDERS.map(order => (
                        <div key={order.id} className="border p-4" style={{ borderColor: 'var(--color-border)' }}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                                {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 capitalize"
                              style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status] }}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              {order.items} {order.items === 1 ? 'item' : 'items'} · {formatPrice(order.total)}
                            </p>
                            <div className="flex gap-2">
                              <Link href={`/orders/${order.id}`} className="text-xs btn-outline"
                                style={{ padding: '4px 10px' }}>
                                View Details
                              </Link>
                              {order.status === 'delivered' && (
                                <button className="text-xs btn-outline"
                                  style={{ padding: '4px 10px', color: '#C0392B', borderColor: '#C0392B' }}>
                                  Return
                                </button>
                              )}
                            </div>
                          </div>
                          {/* Basic tracking */}
                          {order.status !== 'cancelled' && (
                            <div className="mt-3 pt-3 border-t flex gap-0" style={{ borderColor: 'var(--color-border)' }}>
                              {['placed', 'shipped', 'delivered'].map((s, i) => {
                                const statusIndex = ['placed', 'shipped', 'delivered'].indexOf(order.status.replace('confirmed', 'placed'))
                                const isActive = i <= statusIndex
                                return (
                                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex items-center">
                                      {i > 0 && <div className="flex-1 h-0.5" style={{ background: isActive ? 'var(--color-accent)' : 'var(--color-border)' }} />}
                                      <div className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ background: isActive ? 'var(--color-accent)' : 'var(--color-border)' }} />
                                      {i < 2 && <div className="flex-1 h-0.5" style={{ background: i < statusIndex ? 'var(--color-accent)' : 'var(--color-border)' }} />}
                                    </div>
                                    <span className="text-xs capitalize" style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                                      {s}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Saved Addresses</h2>
                  <div className="space-y-3 mb-4">
                    {ADDRESSES.map(addr => (
                      <div key={addr.id} className="p-4 border" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex justify-between mb-2">
                          <p className="text-sm font-medium">{addr.fullName}</p>
                          {addr.isDefault && <span className="text-xs px-2 py-0.5" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-accent)' }}>Default</span>}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>+91 {addr.phone}</p>
                        <div className="flex gap-2">
                          <button className="btn-outline" style={{ padding: '4px 12px', fontSize: 11 }}>Edit</button>
                          <button className="btn-outline" style={{ padding: '4px 12px', fontSize: 11, color: '#C0392B', borderColor: '#C0392B' }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary">+ Add New Address</button>
                </motion.div>
              )}

              {/* Wishlist */}
              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Saved Items</h2>
                  <div className="space-y-3">
                    {WISHLIST.map(item => (
                      <div key={item.id} className="flex gap-3 p-4 border" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="w-14 h-20 flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'var(--color-bg-secondary)' }}>
                          <div className="w-6 h-8" style={{ background: item.colourHex, opacity: 0.7 }} />
                        </div>
                        <div className="flex-1">
                          <Link href={`/product/${item.slug}`}>
                            <p className="text-sm hover:underline" style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{item.name}</p>
                          </Link>
                          <p className="text-sm mt-1 font-medium">{formatPrice(item.price)}</p>
                          <Link href={`/product/${item.slug}`} className="btn-primary mt-2 inline-flex"
                            style={{ padding: '6px 14px', fontSize: 11 }}>
                            View Product
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Account Settings</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                      <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                        className="input-base" />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Email Address</label>
                      <input type="email" value={user.email} disabled className="input-base opacity-60 cursor-not-allowed" />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="input-base" />
                    </div>
                    {saved && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs" style={{ color: '#1B7A3E' }}>
                        ✓ Changes saved successfully!
                      </motion.p>
                    )}
                    <button className="btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}>
                      Save Changes
                    </button>

                    <div className="pt-6 border-t mt-6" style={{ borderColor: 'var(--color-border)' }}>
                      <h3 className="text-sm font-medium mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <input type="password" placeholder="Current password" className="input-base" />
                        <input type="password" placeholder="New password" className="input-base" />
                        <input type="password" placeholder="Confirm new password" className="input-base" />
                        <button className="btn-outline">Update Password</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
