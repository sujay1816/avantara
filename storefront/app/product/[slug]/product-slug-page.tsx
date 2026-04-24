'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronDown, ChevronUp, MapPin, RotateCcw, Shield, Truck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import ProductCard from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/config'
import { getProductBySlug, getProductReviews, getRelatedProducts } from '@/lib/supabase/products'
import type { Product, ProductVariant, Review } from '@/types'

interface ProductDetailPageProps {
  params: { slug: string }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, reviews, relatedProducts] = await Promise.all([
    getProductBySlug(params.slug),
    (async () => {
      const p = await getProductBySlug(params.slug)
      return p ? getProductReviews(p.id) : []
    })(),
    (async () => {
      const p = await getProductBySlug(params.slug)
      return p ? getRelatedProducts(p.categorySlug, params.slug) : []
    })(),
  ])

  if (!product) notFound()

  return <ProductDetailClient product={product} reviews={reviews} relatedProducts={relatedProducts} />
}

// ── Client component for all interactive UI ───────────────────────────────────

function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
}: {
  product: Product
  reviews: Review[]
  relatedProducts: Product[]
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [pincode, setPincode] = useState('')
  const [pincodeResult, setPincodeResult] = useState<null | 'available' | 'unavailable'>(null)
  const [checkingPincode, setCheckingPincode] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('details')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  const effectivePrice = product.salePrice || product.originalPrice
  const isOnSale = !!product.salePrice
  const gstAmount = Math.round((effectivePrice * product.gstRate) / 100)

  const checkPincode = async () => {
    if (pincode.length !== 6) return
    setCheckingPincode(true)
    await new Promise(r => setTimeout(r, 800))
    setPincodeResult(parseInt(pincode) % 2 === 0 ? 'available' : 'unavailable')
    setCheckingPincode(false)
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    // TODO: wire to cart context
  }

  const AccordionSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
      <button className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpenSection(openSection === id ? null : id)}>
        <span className="text-sm font-medium tracking-wide" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
          {title}
        </span>
        {openSection === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {openSection === id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="page-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:underline">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.categorySlug}`} className="hover:underline capitalize">{product.category} Sarees</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <motion.div className="relative w-full overflow-hidden mb-3"
              style={{ aspectRatio: '3/4', background: 'var(--color-bg-secondary)' }}
              whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              {product.images[activeImage]?.url ? (
                <Image src={product.images[activeImage].url}
                  alt={product.images[activeImage].altText || product.name}
                  fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4"
                  style={{ background: 'var(--color-bg-secondary)' }}>
                  <div style={{ width: 120, height: 160, background: 'var(--color-border)', borderRadius: 2 }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{product.name}</p>
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isNew && <span className="badge-new">New</span>}
                {isOnSale && <span className="badge-sale">{product.discountPercent}% Off</span>}
              </div>
            </motion.div>

            {product.images.length > 0 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveImage(i)}
                    className="relative flex-1 border-2 overflow-hidden transition-colors duration-150"
                    style={{
                      aspectRatio: '1', borderRadius: 2,
                      borderColor: activeImage === i ? 'var(--color-text-primary)' : 'var(--color-border)',
                      background: 'var(--color-bg-secondary)',
                    }}>
                    {img.url ? (
                      <Image src={img.url} alt={img.altText} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div style={{ width: 20, height: 28, background: 'var(--color-border)' }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-accent)' }}>
              {product.fabric} · {product.categorySlug.replace('-', ' ')}
            </p>
            <h1 className="text-3xl md:text-4xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14}
                      fill={i < Math.round(product.averageRating) ? 'var(--color-accent)' : 'none'}
                      stroke="var(--color-accent)" />
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {product.averageRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatPrice(effectivePrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-lg line-through" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#C0392B' }}>
                    {product.discountPercent}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Inclusive of GST ({product.gstRate}% = {formatPrice(gstAmount)})
            </p>

            {/* Colour variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium tracking-wide uppercase mb-3"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                  Colour: <span style={{ color: 'var(--color-accent)' }}>{selectedVariant?.colour}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map(variant => (
                    <button key={variant.id}
                      onClick={() => variant.stock > 0 && setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      title={variant.stock === 0 ? 'Out of stock' : variant.colour}
                      className="relative w-8 h-8 rounded-full border-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: variant.colourHex,
                        borderColor: selectedVariant?.id === variant.id ? 'var(--color-text-primary)' : 'transparent',
                        boxShadow: selectedVariant?.id === variant.id ? '0 0 0 1px var(--color-text-primary)' : 'none',
                      }}>
                      {variant.stock === 0 && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-white/60 rotate-45" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant?.stock <= 3 && selectedVariant?.stock > 0 && (
                  <p className="text-xs mt-2" style={{ color: '#C0392B' }}>
                    Only {selectedVariant.stock} left in stock!
                  </p>
                )}
                {selectedVariant?.stock === 0 && (
                  <p className="text-xs mt-2" style={{ color: '#C0392B' }}>This colour is out of stock</p>
                )}
              </div>
            )}

            {/* Pincode check */}
            <div className="mb-6 p-4 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
                <span className="text-xs font-medium tracking-wide uppercase"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                  Check Delivery
                </span>
              </div>
              <div className="flex gap-2">
                <input type="text" maxLength={6} value={pincode}
                  onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeResult(null) }}
                  placeholder="Enter pincode" className="input-base flex-1" style={{ height: 36, fontSize: 13 }} />
                <button onClick={checkPincode} disabled={pincode.length !== 6 || checkingPincode}
                  className="btn-primary px-4 disabled:opacity-50" style={{ height: 36, padding: '0 16px', fontSize: 11 }}>
                  {checkingPincode ? '...' : 'Check'}
                </button>
              </div>
              <AnimatePresence>
                {pincodeResult && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs mt-2"
                    style={{ color: pincodeResult === 'available' ? '#1B7A3E' : '#C0392B' }}>
                    {pincodeResult === 'available'
                      ? `✔ Delivery available! Estimated ${new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                      : '✘ Delivery not available to this pincode'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-6">
              <motion.button className="btn-primary flex-1 justify-center" whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                style={{ opacity: !selectedVariant || selectedVariant.stock === 0 ? 0.5 : 1 }}>
                {!selectedVariant || selectedVariant.stock === 0 ? 'Out of Stock' : addedToCart ? '✔ Added!' : (
                  <><ShoppingBag size={14} /> Add to Cart</>
                )}
              </motion.button>
              <motion.button className="btn-outline px-4" whileTap={{ scale: 0.98 }}
                onClick={() => setWishlisted(!wishlisted)}>
                <Heart size={16}
                  fill={wishlisted ? 'var(--color-accent)' : 'none'}
                  stroke={wishlisted ? 'var(--color-accent)' : 'currentColor'} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <Truck size={16} />, text: 'Free Shipping above ₹1,999' },
                { icon: <RotateCcw size={16} />, text: 'Easy Returns' },
                { icon: <Shield size={16} />, text: '100% Authentic' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-3 text-center border"
                  style={{ borderColor: 'var(--color-border)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>{badge.icon}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div>
              <AccordionSection id="details" title="Product Details">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Fabric</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{product.fabric}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Length</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{product.length} meters</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Blouse Piece</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{product.blouseIncluded ? 'Included' : 'Not Included'}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Occasion</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{product.occasion.join(', ')}</span>
                  {Object.entries(product.customFields).map(([key, val]) => (
                    <>
                      <span key={`k-${key}`} style={{ color: 'var(--color-text-secondary)' }}>{key}</span>
                      <span key={`v-${key}`} style={{ color: 'var(--color-text-primary)' }}>{val}</span>
                    </>
                  ))}
                </div>
              </AccordionSection>
              <AccordionSection id="description" title="Description">
                <p>{product.description}</p>
              </AccordionSection>
              <AccordionSection id="care" title="Care Instructions">
                <p>{product.careInstructions}</p>
              </AccordionSection>
              <AccordionSection id="shipping" title="Shipping & Returns">
                <p>Free shipping on orders above ₹1,999. Standard delivery in 5–7 business days. Easy returns within 7 days of delivery — simply raise a return request with a photo of the item.</p>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="section-heading mb-8">Customer Reviews</h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-64 flex-shrink-0">
              <div className="text-center p-6 border" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-5xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {product.averageRating || '—'}
                </p>
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16}
                      fill={i < Math.round(product.averageRating) ? 'var(--color-accent)' : 'none'}
                      stroke="var(--color-accent)" />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-sm py-6" style={{ color: 'var(--color-text-secondary)' }}>
                  No reviews yet. Be the first to review this product.
                </p>
              ) : (
                reviews.map(review => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} className="pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ background: 'var(--color-accent)' }}>
                          {review.userFullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.userFullName}</p>
                          {review.isVerifiedPurchase && (
                            <p className="text-xs" style={{ color: '#1B7A3E' }}>✔ Verified Purchase</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12}
                          fill={i < review.rating ? 'var(--color-accent)' : 'none'}
                          stroke="var(--color-accent)" />
                      ))}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>
                  </motion.div>
                ))
              )}

              {/* Write a review */}
              {!reviewSubmitted ? (
                <div className="pt-2">
                  <h3 className="text-lg font-light mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Write a Review</h3>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onClick={() => setReviewRating(i + 1)}>
                        <Star size={20}
                          fill={i < reviewRating ? 'var(--color-accent)' : 'none'}
                          stroke="var(--color-accent)" />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="Share your experience with this saree..."
                    className="input-base w-full mb-3" style={{ height: 100, padding: '12px 14px', resize: 'none' }} />
                  <button className="btn-primary"
                    onClick={() => { if (reviewText.trim()) setReviewSubmitted(true) }}>
                    Submit Review
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 text-center" style={{ background: 'var(--color-bg-secondary)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>✔ Thank you for your review!</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="section-heading mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </>
  )
}
