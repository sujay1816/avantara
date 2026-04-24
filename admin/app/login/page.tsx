'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile || !['superadmin', 'manager', 'staff'].includes(profile.role)) {
      await supabase.auth.signOut()
      setError('You do not have admin access.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#F8F9FA' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-widest mb-1" style={{ fontFamily: 'Georgia, serif', color: '#1A1714' }}>
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'Avantara'}
          </h1>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>Admin Panel</p>
        </div>

        <div className="bg-white rounded-xl border p-8 shadow-sm" style={{ borderColor: '#F3F4F6' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-500">Email Address</label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full h-11 border rounded-lg px-3 text-sm text-gray-800 bg-gray-50 transition-colors"
                style={{ borderColor: '#E5E7EB' }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-500">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 border rounded-lg px-3 pr-10 text-sm text-gray-800 bg-gray-50"
                  style={{ borderColor: '#E5E7EB' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <motion.button type="submit"
              className="w-full h-11 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#C9956C' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onMouseEnter={e => (e.currentTarget.style.background = '#A6774E')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C9956C')}>
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={14} />}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}
