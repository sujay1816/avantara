'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, RotateCcw, Image, UserCog, BarChart2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/coupons', label: 'Coupons', icon: Tag },
  { href: '/returns', label: 'Returns', icon: RotateCcw },
  { href: '/banners', label: 'Banners', icon: Image },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/staff', label: 'Staff', icon: UserCog },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r transition-all duration-300"
      style={{ width: collapsed ? 64 : 240, background: '#1A1714', borderColor: '#2A2420' }}>
      <div className="flex items-center justify-between px-4 h-16 border-b" style={{ borderColor: '#2A2420' }}>
        {!collapsed && (
          <span className="text-white font-semibold tracking-widest text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'Store'}
          </span>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg ml-auto transition-colors"
          style={{ color: '#B0A898' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2A2420')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 transition-colors duration-150"
              style={{ background: active ? '#C9956C20' : 'transparent', color: active ? '#C9956C' : '#B0A898' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#2A2420' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              title={collapsed ? item.label : ''}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: '#2A2420' }}>
        <button onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: '#B0A898' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2A2420')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
