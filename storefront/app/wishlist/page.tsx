'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, Heart } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { formatPrice } from '@/lib/config'

const INITIAL_WISHLIST = [
  { id: 'w1', productId: 'p1', productName: 'Kanjivaram Pure Silk Saree', productImage: '', colour: 'Royal Blue', colourHex: '#1A3A6B', price: 14999, originalPrice: 18999, isOnSale: true, isOutOfStock: false, fabric: 'Pure Silk', slug: 'kanjivaram-pure-silk-saree' },
  { id: 'w2', productId: 'p3', productName: 'Chanderi Cotton Saree', productImage: '', colour: 'Ivory White', colourHex: '#F5F0E8', price: 3499, originalPrice: 3499, isOnSale: false, isOutOfStock: false, fabric: 'Cotton', slug: 'chanderi-cotton-saree' },
  { id: 'w3', productId: 'p5', productName: 'Mysore Silk Saree', productImage: '', colour: 'Forest Green', colourHex: '#1B4332', price: 9999, originalPrice: 9999, isOnSale: false, isOutOfStock: true, fabric: 'Silk', slug: 'mysore-silk-saree' },
]

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL_WISHLIST)

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const moveToCart = (id: string) => {
    // TODO: add to cart context
    removeItem(id)
  }

  return (
    <>
      <Navbar wishlistCount={items.length} />
      <div className="page-container py-8">
        <h1 className="section-heading mb-2">My Wishlist</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <Heart size={64} className="mx-auto mb-6" style={{ color: 'var(--color-border)' }} />
            <h2 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Your wishlist is empty
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Save sarees you love to your wishlist.
            </p>
            <Link href="/shop" className="btn-primary">Browse Sarees</Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 p-4 border"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {/* Image */}
                  <Link href={`/product/${item.slug}`}>
                    <div className="w-20 h-28 flex-shrink-0 flex items-center justify-center border"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                      <div className="w-8 h-12 rounded-sm" style={{ background: item.colourHex, opacity: 0.7 }} />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`}>
                      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.fabric}
                      </p>
                      <h3 className="text-base font-light hover:underline mb-1"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      Colour: {item.colour}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm">{formatPrice(item.price)}</span>
                        {item.isOnSale && (
                          <span className="text-xs line-through" style={{ color: 'var(--color-text-secondary)' }}>
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                        {item.isOutOfStock && (
                          <span className="badge-out-of-stock ml-2">Out of Stock</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!item.isOutOfStock && (
                          <button onClick={() => moveToCart(item.id)} className="btn-primary"
                            style={{ padding: '8px 14px', fontSize: 11 }}>
                            <ShoppingBag size={12} /> Move to Cart
                          </button>
                        )}
                        <button onClick={() => removeItem(item.id)}
                          className="p-2 border transition-colors"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
