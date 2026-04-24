'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, RotateCcw, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { formatPrice } from '@/lib/config'

const ORDERS = [
  { id: 'o1', orderNumber: 'AVT123456', date: '2025-03-15', status: 'delivered', total: 28873, items: [{ name: 'Kanjivaram Pure Silk Saree', colour: 'Royal Blue', price: 14999, qty: 1 }, { name: 'Banarasi Brocade Saree', colour: 'Crimson Red', price: 12499, qty: 1 }], trackingId: 'SRKT1234567890', courier: 'Shiprocket' },
  { id: 'o2', orderNumber: 'AVT789012', date: '2025-02-28', status: 'shipped', total: 14999, items: [{ name: 'Mysore Silk Saree', colour: 'Forest Green', price: 14999, qty: 1 }], trackingId: 'SRKT0987654321', courier: 'Shiprocket' },
  { id: 'o3', orderNumber: 'AVT345678', date: '2025-01-10', status: 'placed', total: 9999, items: [{ name: 'Chanderi Cotton Saree', colour: 'Ivory White', price: 9999, qty: 1 }], trackingId: null, courier: null },
]

const STATUS_COLORS: Record<string, string> = {
  placed: '#C9956C',
  confirmed: '#1A3A6B',
  shipped: '#1B7A3E',
  delivered: '#1B7A3E',
  cancelled: '#C0392B',
  return_requested: '#C9956C',
  refunded: '#6B6B6B',
}

const TRACKING_STEPS = ['placed', 'shipped', 'delivered']

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [returnOrder, setReturnOrder] = useState<string | null>(null)
  const [returnReason, setReturnReason] = useState('')
  const [returnImage, setReturnImage] = useState<File | null>(null)
  const [returnSubmitted, setReturnSubmitted] = useState<string[]>([])

  const handleReturnSubmit = (orderId: string) => {
    if (!returnReason || !returnImage) return
    setReturnSubmitted(prev => [...prev, orderId])
    setReturnOrder(null)
    setReturnReason('')
    setReturnImage(null)
  }

  return (
    <>
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <h1 className="section-heading mb-2">My Orders</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          {ORDERS.length} orders placed
        </p>

        {ORDERS.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <Package size={64} className="mx-auto mb-6" style={{ color: 'var(--color-border)' }} />
            <h2 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              No orders yet
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Your orders will appear here once you place one.
            </p>
            <Link href="/shop" className="btn-primary">Shop Now</Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {ORDERS.map((order, i) => (
              <motion.div key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border" style={{ borderColor: 'var(--color-border)' }}>

                {/* Order header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 capitalize"
                      style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status] }}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Tracking bar */}
                  <div className="flex gap-0 mb-4">
                    {TRACKING_STEPS.map((step, idx) => {
                      const statusIdx = TRACKING_STEPS.indexOf(order.status) ?? 0
                      const isActive = idx <= statusIdx
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex items-center">
                            {idx > 0 && <div className="flex-1 h-0.5" style={{ background: isActive ? 'var(--color-accent)' : 'var(--color-border)' }} />}
                            <div className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ background: isActive ? 'var(--color-accent)' : 'var(--color-border)' }} />
                            {idx < 2 && <div className="flex-1 h-0.5" style={{ background: idx < statusIdx ? 'var(--color-accent)' : 'var(--color-border)' }} />}
                          </div>
                          <span className="text-xs capitalize"
                            style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tracking ID */}
                  {order.trackingId && (
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      Tracking ID: <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{order.trackingId}</span> via {order.courier}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                    <div className="flex gap-2">
                      {/* View details toggle */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="btn-outline flex items-center gap-1"
                        style={{ padding: '4px 10px', fontSize: 11 }}>
                        {expandedOrder === order.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {expandedOrder === order.id ? 'Hide' : 'View'} Details
                      </button>

                      {/* Return button — only for delivered orders */}
                      {order.status === 'delivered' && !returnSubmitted.includes(order.id) && (
                        <button
                          onClick={() => setReturnOrder(order.id)}
                          className="btn-outline flex items-center gap-1"
                          style={{ padding: '4px 10px', fontSize: 11, color: '#C0392B', borderColor: '#C0392B' }}>
                          <RotateCcw size={12} /> Return
                        </button>
                      )}
                      {returnSubmitted.includes(order.id) && (
                        <span className="text-xs px-2 py-1" style={{ color: '#1B7A3E', background: '#E8F5EE' }}>
                          ✓ Return Requested
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded order items */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t"
                      style={{ borderColor: 'var(--color-border)' }}>
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: 'var(--color-text-secondary)' }}>Order Items</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0"
                            style={{ borderColor: 'var(--color-border)' }}>
                            <div>
                              <p className="text-sm font-light" style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>{item.name}</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {item.colour} · Qty: {item.qty}
                              </p>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Return request form */}
                <AnimatePresence>
                  {returnOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t"
                      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                      <div className="p-4 space-y-3">
                        <p className="text-sm font-medium">Raise Return Request</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          Please upload a photo of the defective item and select a reason.
                        </p>

                        <div>
                          <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                            Return Reason
                          </label>
                          <select value={returnReason} onChange={e => setReturnReason(e.target.value)}
                            className="input-base" style={{ height: 38 }}>
                            <option value="">Select a reason</option>
                            <option value="defective">Defective / Damaged product</option>
                            <option value="wrong_item">Wrong item delivered</option>
                            <option value="not_as_described">Not as described</option>
                            <option value="quality">Quality not as expected</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                            Upload Photo of Item <span style={{ color: '#C0392B' }}>*</span>
                          </label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors"
                            style={{ borderColor: returnImage ? 'var(--color-accent)' : 'var(--color-border)', background: 'white' }}>
                            <Upload size={20} className="mb-2" style={{ color: 'var(--color-text-secondary)' }} />
                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              {returnImage ? returnImage.name : 'Click to upload photo'}
                            </span>
                            <input type="file" accept="image/*" className="hidden"
                              onChange={e => setReturnImage(e.target.files?.[0] || null)} />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReturnSubmit(order.id)}
                            disabled={!returnReason || !returnImage}
                            className="btn-primary disabled:opacity-50">
                            Submit Return Request
                          </button>
                          <button onClick={() => setReturnOrder(null)} className="btn-outline">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
