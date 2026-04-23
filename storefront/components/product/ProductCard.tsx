'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, getEffectivePrice } from '@/lib/config'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (productId: string) => void
  isWishlisted?: boolean
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 3D tilt values
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsFlipped(false)
  }

  const effectivePrice = getEffectivePrice(product)
  const isOnSale = effectivePrice < product.originalPrice
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Floating animation
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {/* Card */}
      <div
        className="bg-white border overflow-hidden relative group"
        style={{ borderColor: 'var(--color-border)', borderRadius: '2px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      >
        {/* Image area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'var(--color-bg-secondary)' }}>
          {/* Main image */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: isFlipped ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {primaryImage && !imageError ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Placeholder
              <div className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: 'var(--color-bg-secondary)' }}>
                <div style={{ width: 60, height: 80, background: 'var(--color-border)', borderRadius: 2 }} />
                <span className="text-xs text-center px-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {product.name}
                </span>
              </div>
            )}
          </motion.div>

          {/* Flip side — product details */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-4"
            style={{ background: 'var(--color-text-primary)' }}
            animate={{ opacity: isFlipped ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-white space-y-2">
              <p className="text-xs tracking-widest uppercase opacity-70">{product.fabric}</p>
              <p className="text-sm font-light leading-relaxed">{product.description?.slice(0, 100)}...</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {product.occasion?.slice(0, 3).map(occ => (
                  <span key={occ} className="text-xs px-2 py-1 border border-white/30 opacity-80">{occ}</span>
                ))}
              </div>
              {product.blouseIncluded && (
                <p className="text-xs opacity-70">✓ Blouse piece included</p>
              )}
            </div>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNew && <span className="badge-new">New</span>}
            {isOnSale && <span className="badge-sale">{product.discountPercent}% Off</span>}
            {product.isOutOfStock && <span className="badge-out-of-stock">Sold Out</span>}
          </div>

          {/* Action buttons (appear on hover) */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
            {/* Wishlist */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1 }}
              className="w-8 h-8 bg-white flex items-center justify-center border transition-colors duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={e => { e.preventDefault(); onToggleWishlist?.(product.id) }}
              aria-label="Add to wishlist"
            >
              <Heart size={14}
                fill={isWishlisted ? '#C0392B' : 'none'}
                stroke={isWishlisted ? '#C0392B' : 'currentColor'}
                style={{ color: isWishlisted ? '#C0392B' : 'var(--color-text-primary)' }}
              />
            </motion.button>

            {/* Quick view / flip */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1 }}
              className="w-8 h-8 bg-white flex items-center justify-center border transition-colors duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={e => { e.preventDefault(); setIsFlipped(!isFlipped) }}
              aria-label="Quick view"
            >
              <Eye size={14} style={{ color: 'var(--color-text-primary)' }} />
            </motion.button>
          </div>

          {/* Add to cart (appears on hover) */}
          {!product.isOutOfStock && (
            <motion.button
              className="absolute bottom-0 left-0 right-0 py-3 text-xs font-medium tracking-widest uppercase text-white"
              style={{ background: 'var(--color-text-primary)' }}
              initial={{ y: '100%' }}
              whileHover={{ background: 'var(--color-accent)' }}
              onClick={e => { e.preventDefault(); onAddToCart?.(product) }}
              aria-label="Add to cart"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag size={14} /> Add to Cart
              </span>
            </motion.button>
          )}
        </div>

        {/* Info */}
        <Link href={`/product/${product.slug}`}>
          <div className="p-3">
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              {product.fabric}
            </p>
            <p className="text-sm font-light leading-snug mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
              {product.name}
            </p>
            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xs"
                      style={{ color: i < Math.round(product.averageRating) ? '#C9956C' : '#E8DDD4' }}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  ({product.reviewCount})
                </span>
              </div>
            )}
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {formatPrice(effectivePrice)}
              </span>
              {isOnSale && (
                <span className="text-xs line-through" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
