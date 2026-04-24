'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import ProductCard from '@/components/product/ProductCard'
import config from '@/config.json'

const COLOURS = ['Royal Blue', 'Crimson Red', 'Emerald Green', 'Deep Purple', 'Ivory White', 'Rose Pink', 'Midnight Black', 'Golden Yellow']
const OCCASIONS = ['Wedding', 'Festive', 'Casual', 'Office', 'Party', 'Religious']
const FABRICS = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Organza', 'Net', 'Crepe']

const ALL_PRODUCTS = Array.from({ length: 16 }, (_, i) => ({
  id: `p${i + 1}`,
  name: ['Kanjivaram Silk', 'Banarasi Brocade', 'Chanderi Cotton', 'Pure Georgette', 'Mysore Silk', 'Linen Handloom', 'Organza Delight', 'Bandhani Print', 'Patola Silk', 'Tussar Silk', 'Ikat Cotton', 'Jamdani Muslin', 'Kalamkari', 'Pochampally', 'Sambalpuri', 'Paithani'][i],
  slug: `product-${i + 1}`,
  brand: config.brand.name,
  description: 'A beautiful saree crafted with care.',
  fabric: FABRICS[i % FABRICS.length],
  occasion: [OCCASIONS[i % OCCASIONS.length]],
  careInstructions: 'Dry clean only',
  blouseIncluded: i % 2 === 0,
  length: 5.5,
  category: config.categories[i % config.categories.length].id,
  categorySlug: config.categories[i % config.categories.length].slug,
  originalPrice: [8999, 12499, 3499, 5999, 9999, 2999, 7499, 4299, 15999, 6499, 3999, 8499, 4999, 5499, 6999, 11999][i],
  salePrice: i % 4 === 0 ? Math.round([8999, 12499, 3499, 5999, 9999, 2999, 7499, 4299, 15999, 6499, 3999, 8499, 4999, 5499, 6999, 11999][i] * 0.8) : null,
  discountPercent: i % 4 === 0 ? 20 : null,
  saleStartDate: null, saleEndDate: null,
  gstRate: 5, images: [],
  variants: [{ id: `v${i}`, colour: COLOURS[i % COLOURS.length], colourHex: '#C9956C', stock: i === 5 ? 0 : 3, sku: `SKU-${i}` }],
  totalStock: i === 5 ? 0 : 5,
  isOutOfStock: i === 5,
  isNew: i < 4, isFeatured: i < 6, isBestseller: i >= 8,
  customFields: {},
  averageRating: 3.5 + (i % 3) * 0.5,
  reviewCount: i * 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

export default function ShopContent() {
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedColours, setSelectedColours] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [onlyNew, setOnlyNew] = useState(false)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [wishlist, setWishlist] = useState<string[]>([])

  const toggleWishlist = (id: string) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    if (selectedColours.length && !p.variants.some(v => selectedColours.includes(v.colour))) return false
    if (selectedOccasions.length && !p.occasion.some(o => selectedOccasions.includes(o))) return false
    if (selectedFabrics.length && !selectedFabrics.includes(p.fabric)) return false
    if (priceRange.min && p.originalPrice < Number(priceRange.min)) return false
    if (priceRange.max && p.originalPrice > Number(priceRange.max)) return false
    if (onlyNew && !p.isNew) return false
    if (onlyInStock && p.isOutOfStock) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.originalPrice - b.originalPrice
    if (sortBy === 'price_desc') return b.originalPrice - a.originalPrice
    if (sortBy === 'rating') return b.averageRating - a.averageRating
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0)
    return 0
  })

  const clearFilters = () => {
    setSelectedColours([]); setSelectedOccasions([]); setSelectedFabrics([])
    setPriceRange({ min: '', max: '' }); setOnlyNew(false); setOnlyInStock(false)
  }

  const activeFilterCount = selectedColours.length + selectedOccasions.length + selectedFabrics.length +
    (priceRange.min || priceRange.max ? 1 : 0) + (onlyNew ? 1 : 0) + (onlyInStock ? 1 : 0)

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="pb-5 mb-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <h4 className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
        {title}
      </h4>
      {children}
    </div>
  )

  const FiltersContent = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-text-primary)' }}>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs" style={{ color: 'var(--color-accent)' }}>Clear All</button>
        )}
      </div>
      <FilterSection title="Colour">
        <div className="flex flex-wrap gap-2">
          {COLOURS.map(colour => (
            <button key={colour}
              onClick={() => setSelectedColours(prev => prev.includes(colour) ? prev.filter(c => c !== colour) : [...prev, colour])}
              className="px-3 py-1.5 text-xs border transition-colors duration-150"
              style={{
                borderColor: selectedColours.includes(colour) ? 'var(--color-text-primary)' : 'var(--color-border)',
                background: selectedColours.includes(colour) ? 'var(--color-text-primary)' : 'transparent',
                color: selectedColours.includes(colour) ? 'white' : 'var(--color-text-secondary)',
              }}>
              {colour}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Fabric">
        {FABRICS.map(fabric => (
          <label key={fabric} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="checkbox" checked={selectedFabrics.includes(fabric)}
              onChange={() => setSelectedFabrics(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric])}
              style={{ accentColor: 'var(--color-accent)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{fabric}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Occasion">
        {OCCASIONS.map(occ => (
          <label key={occ} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="checkbox" checked={selectedOccasions.includes(occ)}
              onChange={() => setSelectedOccasions(prev => prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ])}
              style={{ accentColor: 'var(--color-accent)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{occ}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min ₹" value={priceRange.min}
            onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
            className="input-base" style={{ height: 36, fontSize: 12 }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>—</span>
          <input type="number" placeholder="Max ₹" value={priceRange.max}
            onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
            className="input-base" style={{ height: 36, fontSize: 12 }} />
        </div>
      </FilterSection>
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 mb-2 cursor-pointer">
          <input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} style={{ accentColor: 'var(--color-accent)' }} />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>New Arrivals Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} style={{ accentColor: 'var(--color-accent)' }} />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="page-container py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="section-heading">All Sarees</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{filteredProducts.length} styles</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border text-xs uppercase tracking-widest md:hidden"
              style={{ borderColor: 'var(--color-border)' }} onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={14} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="border px-3 py-2 text-xs bg-white outline-none cursor-pointer"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-8">
          <aside className="hidden md:block w-52 flex-shrink-0"><FiltersContent /></aside>
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <div className="text-5xl mb-4">🥻</div>
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>No sarees found</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
              </motion.div>
            ) : (
              <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                {filteredProducts.map(product => (
                  <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <ProductCard product={product as any} isWishlisted={wishlist.includes(product.id)} onToggleWishlist={toggleWishlist} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)} />
            <motion.div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-6 overflow-y-auto"
              style={{ background: 'var(--color-bg-primary)', maxHeight: '85vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}>
              <div className="flex justify-between items-center mb-5">
                <span className="font-medium">Filters</span>
                <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              </div>
              <FiltersContent />
              <button className="btn-primary w-full justify-center" onClick={() => setFiltersOpen(false)}>
                Show {filteredProducts.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
