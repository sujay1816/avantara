'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, MapPin, CreditCard, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatPrice } from '@/lib/config'
import config from '@/config.json'

type Step = 'address' | 'coupon' | 'payment' | 'confirmation'

const STEPS: { id: Step; label: string }[] = [
  { id: 'address', label: 'Address' },
  { id: 'coupon', label: 'Offers' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Done' },
]

const ORDER_SUMMARY = {
  items: [
    { name: 'Kanjivaram Pure Silk Saree', colour: 'Royal Blue', price: 14999, qty: 1 },
    { name: 'Banarasi Brocade Saree', colour: 'Crimson Red', price: 12499, qty: 1 },
  ],
  subtotal: 27498,
  shipping: 0,
  gst: 1375,
  couponDiscount: 0,
  total: 28873,
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' })
  const [savedAddresses] = useState([
    { id: 'a1', fullName: 'Priya Sharma', phone: '9876543210', addressLine1: '42, Rose Garden', addressLine2: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', isDefault: true },
  ])
  const [selectedAddress, setSelectedAddress] = useState('a1')
  const [addingNew, setAddingNew] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | string>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi')
  const [upiId, setUpiId] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber] = useState(`${config.brand.name.slice(0,3).toUpperCase()}${Date.now().toString().slice(-6)}`)
  const [placingOrder, setPlacingOrder] = useState(false)

  const currentStepIndex = STEPS.findIndex(s => s.id === step)

  const placeOrder = async () => {
    setPlacingOrder(true)
    await new Promise(r => setTimeout(r, 1500))
    setPlacingOrder(false)
    setOrderPlaced(true)
    setStep('confirmation')
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <>
      <Navbar />
      <div className="page-container py-8">
        <h1 className="section-heading mb-8">Checkout</h1>

        {/* Step indicator */}
        {step !== 'confirmation' && (
          <div className="flex items-center mb-10">
            {STEPS.filter(s => s.id !== 'confirmation').map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200"
                    style={{
                      background: STEPS.findIndex(st => st.id === step) >= i ? 'var(--color-text-primary)' : 'var(--color-border)',
                      color: STEPS.findIndex(st => st.id === step) >= i ? 'white' : 'var(--color-text-secondary)',
                    }}>
                    {STEPS.findIndex(st => st.id === step) > i ? <Check size={12} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block"
                    style={{ color: STEPS.findIndex(st => st.id === step) >= i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-px mx-3 min-w-6"
                    style={{ background: STEPS.findIndex(st => st.id === step) > i ? 'var(--color-text-primary)' : 'var(--color-border)' }} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Steps content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* ── ADDRESS ── */}
              {step === 'address' && (
                <motion.div key="address" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-xl font-light mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
                    Delivery Address
                  </h2>

                  {/* Saved addresses */}
                  {savedAddresses.map(addr => (
                    <label key={addr.id}
                      className="flex gap-3 p-4 border mb-3 cursor-pointer transition-colors"
                      style={{ borderColor: selectedAddress === addr.id && !addingNew ? 'var(--color-text-primary)' : 'var(--color-border)' }}>
                      <input type="radio" name="address" value={addr.id}
                        checked={selectedAddress === addr.id && !addingNew}
                        onChange={() => { setSelectedAddress(addr.id); setAddingNew(false) }}
                        style={{ accentColor: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <p className="text-sm font-medium">{addr.fullName}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>+91 {addr.phone}</p>
                        {addr.isDefault && <span className="text-xs" style={{ color: 'var(--color-accent)' }}>Default</span>}
                      </div>
                    </label>
                  ))}

                  {/* Add new address */}
                  <button onClick={() => setAddingNew(!addingNew)}
                    className="text-sm mb-4 flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
                    + Add New Address
                  </button>

                  <AnimatePresence>
                    {addingNew && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          {[
                            { key: 'fullName', label: 'Full Name', span: false },
                            { key: 'phone', label: 'Phone Number', span: false },
                            { key: 'addressLine1', label: 'Address Line 1', span: true },
                            { key: 'addressLine2', label: 'Address Line 2 (Optional)', span: true },
                            { key: 'city', label: 'City', span: false },
                            { key: 'state', label: 'State', span: false },
                            { key: 'pincode', label: 'Pincode', span: false },
                          ].map(field => (
                            <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
                              <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{field.label}</label>
                              <input type="text"
                                value={address[field.key as keyof typeof address]}
                                onChange={e => setAddress(prev => ({ ...prev, [field.key]: e.target.value }))}
                                className="input-base" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button className="btn-primary" onClick={() => setStep('coupon')}>
                    Continue to Offers <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}

              {/* ── COUPON ── */}
              {step === 'coupon' && (
                <motion.div key="coupon" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-xl font-light mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Apply Coupon</h2>

                  <div className="flex gap-2 mb-4">
                    <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)}
                      placeholder="Enter coupon code (try AVANTARA10)"
                      className="input-base flex-1" />
                    <button onClick={() => { if (coupon.trim()) setAppliedCoupon(coupon.toUpperCase()) }}
                      className="btn-primary flex-shrink-0">
                      Apply
                    </button>
                  </div>

                  {appliedCoupon && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 mb-4 flex items-center justify-between"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-accent)' }}>
                      <p className="text-sm" style={{ color: '#1B7A3E' }}>✓ Coupon {appliedCoupon} applied!</p>
                      <button onClick={() => setAppliedCoupon(null)} className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}>Remove</button>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <button className="btn-outline" onClick={() => setStep('address')}>Back</button>
                    <button className="btn-primary" onClick={() => setStep('payment')}>
                      Continue to Payment <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── PAYMENT ── */}
              {step === 'payment' && (
                <motion.div key="payment" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-xl font-light mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Payment Method</h2>

                  <div className="space-y-3 mb-6">
                    {/* UPI */}
                    <label className="flex gap-3 p-4 border cursor-pointer transition-colors"
                      style={{ borderColor: paymentMethod === 'upi' ? 'var(--color-text-primary)' : 'var(--color-border)' }}>
                      <input type="radio" name="payment" value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        style={{ accentColor: 'var(--color-accent)', marginTop: 2 }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">UPI Payment</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Pay using any UPI app (GPay, PhonePe, Paytm)
                        </p>
                        <AnimatePresence>
                          {paymentMethod === 'upi' && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                                placeholder="Enter your UPI ID (e.g. name@upi)"
                                className="input-base mt-3" style={{ height: 38, fontSize: 13 }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </label>

                    {/* COD */}
                    <label className="flex gap-3 p-4 border cursor-pointer transition-colors"
                      style={{ borderColor: paymentMethod === 'cod' ? 'var(--color-text-primary)' : 'var(--color-border)' }}>
                      <input type="radio" name="payment" value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        style={{ accentColor: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <p className="text-sm font-medium">Cash on Delivery</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Pay when your order arrives at your doorstep
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button className="btn-outline" onClick={() => setStep('coupon')}>Back</button>
                    <motion.button className="btn-primary" onClick={placeOrder}
                      disabled={placingOrder}
                      whileTap={{ scale: 0.98 }}>
                      {placingOrder ? 'Placing Order...' : `Place Order · ${formatPrice(ORDER_SUMMARY.total)}`}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── CONFIRMATION ── */}
              {step === 'confirmation' && (
                <motion.div key="confirmation" variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                  className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-accent)' }}
                  >
                    <Check size={36} style={{ color: 'var(--color-accent)' }} />
                  </motion.div>

                  <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Order Placed!
                  </h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Thank you for shopping with {config.brand.name}.
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Your order <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>#{orderNumber}</span> has been confirmed.
                  </p>
                  <p className="text-xs mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                    You'll receive an email & SMS confirmation shortly.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/orders" className="btn-primary">Track Order</a>
                    <a href="/shop" className="btn-outline">Continue Shopping</a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {step !== 'confirmation' && (
            <div className="lg:w-72 flex-shrink-0">
              <div className="border p-5 sticky top-24" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-base font-light mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Order Summary
                </h3>
                {ORDER_SUMMARY.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <div>
                      <p className="text-xs">{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.colour} × {item.qty}</p>
                    </div>
                    <p className="text-xs font-medium">{formatPrice(item.price)}</p>
                  </div>
                ))}
                <div className="border-t mt-4 pt-4 space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Subtotal</span><span>{formatPrice(ORDER_SUMMARY.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: '#1B7A3E' }}>
                    <span>Shipping</span><span>FREE</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>GST (5%)</span><span>{formatPrice(ORDER_SUMMARY.gst)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <span>Total</span>
                    <span style={{ fontFamily: 'var(--font-heading)' }}>{formatPrice(ORDER_SUMMARY.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
