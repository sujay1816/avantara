'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md">
        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl font-light mb-2">
          Reset Password
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" className="input-base pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Confirm Password</label>
            <input type="password" required value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password" className="input-base" />
          </div>
          {error && <p className="text-xs" style={{ color: '#C0392B' }}>{error}</p>}
          <motion.button type="submit" className="btn-primary w-full justify-center"
            whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'} {!loading && <ArrowRight size={14} />}
          </motion.button>
        </form>
      </div>
    </div>
  )
}
