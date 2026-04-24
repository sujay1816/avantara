'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import config from '@/config.json'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl font-light mb-2">
          Forgot Password?
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 text-center border" style={{ borderColor: 'var(--color-accent)', background: 'var(--color-bg-secondary)' }}>
            <p className="text-2xl mb-2">📩</p>
            <p className="text-sm font-medium mb-1">Check your inbox!</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link href="/login" className="btn-primary mt-4 inline-flex">
              Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                Email Address
              </label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base" />
            </div>
            {error && <p className="text-xs" style={{ color: '#C0392B' }}>{error}</p>}
            <motion.button type="submit" className="btn-primary w-full justify-center"
              whileTap={{ scale: 0.98 }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'} {!loading && <ArrowRight size={14} />}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  )
}
