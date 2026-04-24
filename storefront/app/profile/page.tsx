'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight, Camera } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { formatPrice } from '@/lib/config'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'orders' | 'addresses' | 'wishlist' | 'settings'

const TABS = [
  { id: 'orders' as Tab, label: 'My Orders', icon: Package },
  { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
  { id: 'wishlist' as Tab, label: 'Wishlist', icon: Heart },
  { id: 'settings' as Tab, label: 'Account Settings', icon: Settings },
]

const STATUS_COLORS: Record<string, string> = {
  placed: '#C9956C',
  confirmed: '#1A3A6B',
  shipped: '#1B7A3E',
  delivered: '#1B7A3E',
  cancelled: '#C0392B',
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [user, setUser] = useState<{ fullName: string; email: string; phone: string } | null>(null)
  const [form, setForm] = useState({ fullName: '', phone: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({
          fullName: profile.full_name || '',
          email: profile.email || authUser.email || '',
          phone: profile.phone || '',
        })
        setForm({
          fullName: profile.full_name || '',
          phone: profile.phone || '',
        })
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleSave = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return
    await supabase.from('profiles').update({
      full_name: form.fullName,
      phone: form.phone,
    }).eq('id', authUser.id)
    setUser(prev => prev ? { ...prev, fullName: form.fullName, phone: form.phone } : null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container py-20 text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="p-5 border mb-4 text-center" style={{ borderColor: 'var(--color-border)' }}>
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium"
                  style={{ background: 'var(--color-accent)' }}>
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
              <p className="font-medium text-sm">{user?.fullName || 'My Account'}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
            </div>

            <div className="border" style={{ borderColor: 'var(--color-border)' }}>
              {TABS.map((tab, i) => {
                const Icon = tab.icon
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      borderBottom: i < TABS.length - 1 ? `1px solid var(--color-border)` : 'none',
                      background: activeTab === tab.id ? 'var(--color-bg-secondary)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}>
                    <Icon size={15} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight size={13} className="ml-auto" />}
                  </button>
                )
              })}
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-t"
                style={{ borderColor: 'var(--color-border)', color: '#C0392B' }}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>My Orders</h2>
                  <div className="text-center py-12 border" style={{ borderColor: 'var(--color-border)' }}>
                    <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      No orders yet. Start shopping!
                    </p>
                    <Link href="/shop" className="btn-primary inline-flex">Shop Now</Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Saved Addresses</h2>
                  <div className="text-center py-12 border" style={{ borderColor: 'var(--color-border)' }}>
                    <MapPin size={48} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>No addresses saved yet.</p>
                    <button className="btn-primary">+ Add New Address</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Saved Items</h2>
                  <div className="text-center py-12 border" style={{ borderColor: 'var(--color-border)' }}>
                    <Heart size={48} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Your wishlist is empty.</p>
                    <Link href="/shop" className="btn-primary inline-flex">Browse Sarees</Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Account Settings</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                      <input type="text" value={form.fullName}
                        onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                        className="input-base" />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Email Address</label>
                      <input type="email" value={user?.email || ''} disabled
                        className="input-base opacity-60 cursor-not-allowed" />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                      <input type="tel" value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="input-base" />
                    </div>
                    {saved && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs" style={{ color: '#1B7A3E' }}>
                        ✓ Changes saved successfully!
                      </motion.p>
                    )}
                    <button className="btn-primary" onClick={handleSave}>Save Changes</button>
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
