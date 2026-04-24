'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import ProductCard from '@/components/product/ProductCard'
import config from '@/config.json'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const PLACEHOLDER_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: `p${i + 1}`,
  name: ['Kanjivaram Silk Saree', 'Banarasi Brocade', 'Chanderi Cotton', 'Pure Georgette', 'Mysore Silk', 'Linen Saree', 'Organza Delight', 'Bandhani Print'][i],
  slug: `product-${i + 1}`,
  brand: config.brand.name,
  description: 'A timeless saree crafted with exceptional attention to detail.',
  fabric: ['Silk', 'Brocade', 'Cotton', 'Georgette', 'Silk', 'Linen', 'Organza', 'Cotton'][i],
  occasion: ['Wedding', 'Festive'],
  careInstructions: 'Dry clean only',
  blouseIncluded: i % 2 === 0,
  length: 5.5,
  category: config.categories[i % config.categories.length].id,
  categorySlug: config.categories[i % config.categories.length].slug,
  originalPrice: [8999, 12499, 3499, 5999, 9999, 2999, 7499, 4299][i],
  salePrice: i % 3 === 0 ? [6999, null, 2799, null, 7999, null, null, 3499][i] : null,
  discountPercent: i % 3 === 0 ? 20 : null,
  saleStartDate: null, saleEndDate: null,
  gstRate: 5,
  images: [],
  variants: [{ id: `v${i}`, colour: 'Royal Blue', colourHex: '#1A3A6B', stock: i === 3 ? 0 : 4, sku: `SKU-${i}` }],
  totalStock: i === 3 ? 0 : 4,
  isOutOfStock: i === 3,
  isNew: i < 3,
  isFeatured: i < 4,
  isBestseller: i >= 4,
  customFields: {},
  averageRating: 4 + (i % 2) * 0.5,
  reviewCount: [12, 8, 24, 0, 31, 15, 7, 19][i],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const sections = [...config.homepage.sections]
    .sort((a, b) => a.order - b.order)
    .filter(s => s.visible)

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ height: '90vh', minHeight: 600 }}>
        <div className="absolute inset-0 w-full h-full">
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={config.homepage.heroBannerFallbackImage}>
            <source src={config.homepage.heroBannerVideoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.3) 60%, transparent 100%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex items-center">
          <div className="page-container">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
              <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
                New Collection 2025
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl font-light text-white mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {config.homepage.heroHeading}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base font-light mb-8"
                style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
                {config.homepage.heroSubheading}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href={config.homepage.heroCTAUrl} className="btn-primary"
                  style={{ background: 'var(--color-accent)' }}>
                  {config.homepage.heroCTALabel} <ArrowRight size={14} />
                </Link>
                <Link href="/shop" className="btn-outline"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  Explore Collections
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <span className="text-xs tracking-widest uppercase text-white/50">Scroll</span>
          <div className="w-px h-8 bg-white/30" />
        </motion.div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-b" style={{ borderColor: 'var(--color-border)', background: 'white' }}>
        <div className="page-container">
          <div className="flex overflow-x-auto gap-0">
            {config.categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link href={`/shop/${cat.slug}`}
                  className="flex flex-col items-center gap-3 px-6 md:px-8 py-5 border-b-2 border-transparent flex-shrink-0 transition-colors duration-200"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-bg-secondary)' }}>
                    <span className="text-xl">🥻</span>
                  </div>
                  <span className="text-xs font-medium tracking-wide whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SECTIONS */}
      {sections.map((section) => {
        const products = section.id === 'newArrivals'
          ? PLACEHOLDER_PRODUCTS.filter(p => p.isNew)
          : section.id === 'bestsellers'
          ? PLACEHOLDER_PRODUCTS.filter(p => p.isBestseller)
          : PLACEHOLDER_PRODUCTS.filter(p => p.isFeatured)
        return (
          <section key={section.id} className="py-16">
            <div className="page-container">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp} className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2"
                    style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
                    {section.id === 'newArrivals' ? 'Just In' : section.id === 'bestsellers' ? 'Most Loved' : 'Curated'}
                  </p>
                  <h2 className="section-heading">{section.heading}</h2>
                </div>
                <Link href={`/shop?filter=${section.id}`}
                  className="hidden md:flex items-center gap-2 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                  View All <ArrowRight size={14} />
                </Link>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
                variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.slice(0, 4).map(product => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <ProductCard product={product as any} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )
      })}

      {/* BRAND BANNER */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp} className="py-20 text-center"
        style={{ background: 'var(--color-text-primary)' }}>
        <div className="page-container">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
            {config.brand.name} Promise
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Every saree tells a story.<br />
            <em style={{ color: '#D4A96A' }}>Yours starts here.</em>
          </h2>
          <Link href="/shop" className="btn-primary" style={{ background: 'var(--color-accent)' }}>
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </motion.section>

      <Footer />
      <WhatsAppButton />
    </>
  )
}
