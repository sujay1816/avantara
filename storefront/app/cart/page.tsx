'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { formatPrice } from '@/lib/config'
import config from '@/config.json'

const INITIAL_CART = [
  { productId: 'p1', productName: 'Kanjivaram Pure Silk Saree', productImage: '', colour: 'Royal Blue', colourHex: '#1A3A6B', originalPrice: 18999, salePrice: 14999, quantity: 1, stock: 3 },
  { productId: 'p2', productName: 'Banarasi Brocade Saree', productImage: '', colour: 'Crimson Red', colourHex: '#8B1A1A', originalPrice: 12499, salePrice: null, quantity: 1, stock: 2 },
]

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_CART)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discount: number; type: string }>(null)
  const [couponError, setCouponError] = useState('')

  const updateQty = (productId: string, colour: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.productId === productId && item.colour === colour
        ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)) }
        : item
    ))
  }

  const removeItem = (productId: string, colour: string) => {
    setItems(prev => prev.filter(item => !(item.productId === productId && item.colour === colour)))
  }

  const applyCoupon = () => {
    setCouponError('')
    if (coupon.toUpperCase() === 'AVANTARA10') {
      setAppliedCoupon({ code: 'AVANTARA10', discount: 10, type: 'percentage' })
    } else if (coupon.toUpperCase() === 'FLAT500') {
      setAppliedCoupon({ code: 'FLAT500', discount: 500, type: 'flat' })
    } else {
      setCouponError('Invalid or expired coupon code')
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.originalPrice) * item.quantity, 0)
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage' ? Math.round(subtotal * appliedCoupon.discount / 100) : appliedCoupon.discount
    : 0
  const shipping = subtotal >= config.shipping.freeShippingAbove ? 0 : config.shipping.defaultShippingCharge
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal - couponDiscount + shipping + gst

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="page-container py-20 text-center">
          <ShoppingBag size={64} className="mx-auto mb-6" style={{ color: 'var(--color-border)' }} />
          <h2 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Looks like you haven't added any sarees yet.
          </p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </motion.div>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  return (
    <>
      <Navbar cartCount={items.reduce((s, i) => s + i.quantity, 0)} />
      <div className="page-container py-8">
        <h1 className="section-heading mb-8">Shopping Cart
          <span className="text-base font-normal ml-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1">
            <AnimatePresence>
              {items.map(item => {
                const price = item.salePrice || item.originalPrice
                const isOnSale = !!item.salePrice
                return (
                  <motion.div
                    key={`${item.productId}-${item.colour}`}
                    layout
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="flex gap-4 py-5 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {/* Image */}
                    <div className="w-24 h-32 flex-shrink-0 flex items-center justify-center border"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                      <div className="w-10 h-14 rounded" style={{ background: item.colourHex, opacity: 0.6 }} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="text-base font-light mb-1 hover:underline"
                          style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</h3>
                      </Link>
                      <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        Colour: <span style={{ color: 'var(--color-text-primary)' }}>{item.colour}</span>
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border" style={{ borderColor: 'var(--color-border)' }}>
                          <button onClick={() => updateQty(item.productId, item.colour, -1)}
                            className="w-8 h-8 flex items-center justify-center transition-colors"
                            style={{ color: 'var(--color-text-primary)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, item.colour, 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-30"
                            style={{ color: 'var(--color-text-primary)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(price * item.quantity)}</p>
                            {isOnSale && (
                              <p className="text-xs line-through" style={{ color: 'var(--color-text-secondary)' }}>
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                          <button onClick={() => removeItem(item.productId, item.colour)}
                            className="p-1 transition-colors"
                            style={{ color: 'var(--color-text-secondary)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="border p-6 sticky top-24" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                <p className="text-xs font-medium tracking-wide uppercase mb-2"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  Coupon Code
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 border"
                    style={{ borderColor: 'var(--color-accent)', background: 'var(--color-bg-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Tag size={14} style={{ color: 'var(--color-accent)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)}
                      className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                      placeholder="Enter code" className="input-base flex-1" style={{ height: 36, fontSize: 13 }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                    <button onClick={applyCoupon} className="btn-outline flex-shrink-0"
                      style={{ height: 36, padding: '0 12px', fontSize: 11 }}>
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{couponError}</p>}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-5 pb-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#1B7A3E' }}>Coupon Discount</span>
                    <span style={{ color: '#1B7A3E' }}>−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#1B7A3E' : 'var(--color-text-primary)' }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-secondary)' }}>GST (5%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
              </div>

              <div className="flex justify-between font-medium mb-6">
                <span>Total</span>
                <span className="text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{formatPrice(total)}</span>
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center block text-center">
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              <Link href="/shop"
                className="block text-center text-xs mt-3 transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
