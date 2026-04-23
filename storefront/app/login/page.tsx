'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import config from '@/config.json'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    // TODO: integrate with Supabase auth
    setLoading(false)
  }

  const handleGoogle = async () => {
    // TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Left — brand panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden"
        style={{ background: 'var(--color-text-primary)' }}>
        {/* Decorative 3D orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute opacity-10"
          style={{ width: 500, height: 500, borderRadius: '50%', border: '1px solid var(--color-accent)', top: '-20%', left: '-20%' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute opacity-5"
          style={{ width: 400, height: 400, borderRadius: '50%', border: '2px solid white', bottom: '-10%', right: '-10%' }}
        />

        <div className="relative z-10 text-center">
          <Link href="/">
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'white' }}
              className="text-5xl font-light tracking-widest mb-4">
              {config.brand.name}
            </h1>
          </Link>
          <p className="text-sm tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>
            {config.brand.tagline.toUpperCase()}
          </p>
          <div className="mt-12 p-6 border border-white/10">
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              "Every saree has a story.<br />Be part of ours."
            </p>
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8">
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            className="text-3xl font-light tracking-widest">
            {config.brand.name}
          </span>
        </Link>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex border-b mb-8" style={{ borderColor: 'var(--color-border)' }}>
            {(['login', 'signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-3 text-sm font-medium tracking-wide capitalize transition-colors duration-200 border-b-2 -mb-px"
                style={{
                  borderBottomColor: mode === m ? 'var(--color-text-primary)' : 'transparent',
                  color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                  <input type="text" required value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="input-base" />
                </div>
              )}

              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Email Address</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="input-base" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Password</label>
                  {mode === 'login' && (
                    <Link href="/forgot-password" className="text-xs transition-colors"
                      style={{ color: 'var(--color-accent)' }}>
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    className="input-base pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-secondary)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs" style={{ color: '#C0392B' }}>{error}</p>
              )}

              <motion.button type="submit" className="btn-primary w-full justify-center"
                whileTap={{ scale: 0.98 }} disabled={loading}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                {!loading && <ArrowRight size={14} />}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          {/* Google OAuth */}
          <motion.button
            onClick={handleGoogle}
            className="btn-outline w-full justify-center"
            whileTap={{ scale: 0.98 }}
          >
            {/* Google icon */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
