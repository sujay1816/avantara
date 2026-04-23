'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Youtube } from 'lucide-react'
import config from '../../../../config.json'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: integrate with newsletter service
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="border-t mt-16" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
      {/* Newsletter */}
      {config.footer.showNewsletter && (
        <div className="border-b py-12" style={{ borderColor: 'var(--color-border)' }}>
          <div className="page-container text-center">
            <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl font-light mb-2">
              {config.footer.newsletterHeading}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {config.footer.newsletterSubtext}
            </p>
            {subscribed ? (
              <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-base flex-1"
                  style={{ borderRight: 'none' }}
                  required
                />
                <button type="submit" className="btn-primary flex-shrink-0" style={{ borderRadius: '0' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              className="text-2xl font-semibold tracking-widest block mb-3">
              {config.brand.name}
            </span>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {config.brand.tagline}
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {config.social.instagram && (
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border transition-colors duration-200"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                  <Instagram size={14} />
                </a>
              )}
              {config.social.facebook && (
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border transition-colors duration-200"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                  <Facebook size={14} />
                </a>
              )}
              {config.social.youtube && (
                <a href={config.social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border transition-colors duration-200"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                  <Youtube size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {config.footer.links.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-text-primary)' }}>
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.url}
                      className="text-xs transition-colors duration-200"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {config.footer.copyrightText}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
