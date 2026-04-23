'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import config from '@/config.json'

interface NavbarProps {
  cartCount?: number
  wishlistCount?: number
}

export default function Navbar({ cartCount = 0, wishlistCount = 0 }: NavbarProps) {
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 60) { setVisible(true); return }
      setVisible(currentY < lastScrollY)
      setLastScrollY(currentY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Top announcement bar */}
      <div style={{ background: 'var(--color-text-primary)', color: 'var(--color-bg-primary)' }}
        className="text-center py-2 text-xs tracking-widest font-light">
        Free shipping on orders above ₹{config.shipping.freeShippingAbove.toLocaleString('en-IN')} &nbsp;·&nbsp; {config.brand.tagline}
      </div>

      {/* Main navbar */}
      <motion.header
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-50 bg-white border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Mobile: Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
                className="text-2xl font-semibold tracking-widest">
                {config.brand.name}
              </span>
            </Link>

            {/* Desktop: Category nav */}
            <nav className="hidden md:flex items-center gap-0 flex-1 justify-center">
              {config.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className="px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-200"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                className="relative flex items-center justify-center w-10 h-10 transition-colors duration-200"
                style={{ color: 'var(--color-text-primary)' }}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative flex items-center justify-center w-10 h-10">
                <Heart size={18} style={{ color: 'var(--color-text-primary)' }} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-xs font-semibold"
                    style={{ background: 'var(--color-accent)', fontSize: '9px' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative flex items-center justify-center w-10 h-10">
                <ShoppingBag size={18} style={{ color: 'var(--color-text-primary)' }} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-xs font-semibold"
                    style={{ background: 'var(--color-accent)', fontSize: '9px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link href="/profile" className="flex items-center justify-center w-10 h-10">
                <User size={18} style={{ color: 'var(--color-text-primary)' }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-primary)' }}
            >
              <div className="page-container py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-secondary)' }} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search sarees by name, fabric, occasion..."
                    className="input-base pl-10"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
                      }
                      if (e.key === 'Escape') setSearchOpen(false)
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 flex flex-col"
              style={{ background: 'var(--color-bg-primary)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: 'var(--color-border)' }}>
                <span style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold tracking-widest">
                  {config.brand.name}
                </span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={22} style={{ color: 'var(--color-text-primary)' }} />
                </button>
              </div>

              {/* Categories */}
              <nav className="flex-1 overflow-y-auto py-4">
                <p className="px-5 py-2 text-xs tracking-widest uppercase"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  Shop by Category
                </p>
                {config.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-5 py-4 border-b text-sm tracking-wide"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    {cat.label}
                    <ChevronDown size={14} className="-rotate-90" style={{ color: 'var(--color-text-secondary)' }} />
                  </Link>
                ))}

                <div className="mt-4 px-5 flex flex-col gap-2">
                  <Link href="/wishlist" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-sm"
                    style={{ color: 'var(--color-text-primary)' }}>
                    <Heart size={16} /> Wishlist
                  </Link>
                  <Link href="/orders" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-sm"
                    style={{ color: 'var(--color-text-primary)' }}>
                    <ShoppingBag size={16} /> My Orders
                  </Link>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-sm"
                    style={{ color: 'var(--color-text-primary)' }}>
                    <User size={16} /> My Account
                  </Link>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {config.footer.copyrightText}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
