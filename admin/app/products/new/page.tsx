'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Upload, X, Plus, Trash2 } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import TopBar from '@/components/layout/TopBar'
import { createClient } from '@supabase/supabase-js'

const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Pricing' },
  { id: 3, label: 'Stock' },
  { id: 4, label: 'Images' },
  { id: 5, label: 'SEO' },
]

const STATIC_CATEGORIES = [
  { id: 'silk-sarees', label: 'Silk Sarees' },
  { id: 'cotton-sarees', label: 'Cotton Sarees' },
  { id: 'designer-sarees', label: 'Designer Sarees' },
  { id: 'bridal-sarees', label: 'Bridal Sarees' },
  { id: 'casual-sarees', label: 'Casual Sarees' },
]

const OCCASIONS = ['Wedding', 'Festive', 'Casual', 'Office', 'Party', 'Religious', 'Traditional']
const FABRICS = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Organza', 'Net', 'Crepe', 'Brocade']
const COLOURS = ['Royal Blue', 'Crimson Red', 'Emerald Green', 'Deep Purple', 'Ivory White', 'Rose Pink', 'Midnight Black', 'Golden Yellow', 'Coral Orange', 'Navy Blue']
const COLOUR_HEX: Record<string, string> = {
  'Royal Blue': '#1A3A6B', 'Crimson Red': '#8B1A1A', 'Emerald Green': '#1B4332',
  'Deep Purple': '#4A1F6B', 'Ivory White': '#F5F0E8', 'Rose Pink': '#E8A0B4',
  'Midnight Black': '#1A1A1A', 'Golden Yellow': '#C9A84C', 'Coral Orange': '#E8754A', 'Navy Blue': '#1A2A6B',
}

const inputClass = "w-full border rounded-lg px-3 py-2.5 text-sm bg-white text-gray-800 transition-colors focus:outline-none focus:border-orange-400"
const labelClass = "text-xs font-medium text-gray-500 mb-1 block"

export default function AddProductPage() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const [form, setForm] = useState({
    name: '', description: '', fabric: '', occasion: [] as string[],
    careInstructions: '', blouseIncluded: false, length: '5.5', categoryId: '',
    originalPrice: '', salePrice: '', discountPercent: '', hasSale: false, gstRate: '5',
    isNew: true, isFeatured: false, isBestseller: false,
    variants: [{ colour: '', colourHex: '', stock: 0, sku: '' }],
    images: [] as File[], imagePreview: [] as string[],
    metaTitle: '', metaDescription: '',
    customFields: [] as { key: string; value: string }[],
  })

  const [categories, setCategories] = useState<{id: string, label: string, slug: string}[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('id, slug, label').order('order_index')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const toggleOccasion = (occ: string) => {
    setForm(prev => ({
      ...prev,
      occasion: prev.occasion.includes(occ) ? prev.occasion.filter(o => o !== occ) : [...prev.occasion, occ]
    }))
  }

  const updateVariant = (index: number, key: string, value: any) => {
    setForm(prev => {
      const variants = [...prev.variants]
      variants[index] = { ...variants[index], [key]: value }
      if (key === 'colour') variants[index].colourHex = COLOUR_HEX[value] || '#C9956C'
      return { ...prev, variants }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map(f => URL.createObjectURL(f))
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 6),
      imagePreview: [...prev.imagePreview, ...previews].slice(0, 6),
    }))
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = 'Product name is required'
      if (!form.categoryId) newErrors.categoryId = 'Category is required'
      if (!form.fabric) newErrors.fabric = 'Fabric is required'
      if (form.occasion.length === 0) newErrors.occasion = 'Select at least one occasion'
    }
    if (step === 2) {
      if (!form.originalPrice) newErrors.originalPrice = 'Original price is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateStep()) return
    setSaving(true)
    try {
      const categoryData = categories.find(c => c.id === form.categoryId)
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

      const { data: product, error } = await supabase.from('products').insert({
        name: form.name, slug, description: form.description,
        fabric: form.fabric, occasion: form.occasion,
        care_instructions: form.careInstructions, blouse_included: form.blouseIncluded,
        length: parseFloat(form.length), category_id: categoryData?.id,
        original_price: parseInt(form.originalPrice),
        sale_price: form.hasSale && form.salePrice ? parseInt(form.salePrice) : null,
        discount_percent: form.hasSale && form.discountPercent ? parseInt(form.discountPercent) : null,
        gst_rate: parseInt(form.gstRate), is_new: form.isNew,
        is_featured: form.isFeatured, is_bestseller: form.isBestseller,
        custom_fields: Object.fromEntries(form.customFields.map(f => [f.key, f.value])),
      }).select().single()

      if (error) throw error

      if (form.variants.length > 0) {
        await supabase.from('product_variants').insert(
          form.variants.filter(v => v.colour).map(v => ({
            product_id: product.id, colour: v.colour,
            colour_hex: v.colourHex, stock: v.stock, sku: v.sku,
          }))
        )
      }

      for (let i = 0; i < form.images.length; i++) {
        const file = form.images[i]
        const fileName = `${product.id}/${Date.now()}-${file.name}`
        const { data: uploadData } = await supabase.storage.from('product-images').upload(fileName, file)
        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
          await supabase.from('product_images').insert({
            product_id: product.id, url: publicUrl,
            alt_text: form.name, is_primary: i === 0, order_index: i,
          })
        }
      }

      setSaved(true)
      setTimeout(() => router.push('/products'), 1500)
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to save product. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E8F5EE' }}>
              <Check size={40} style={{ color: '#1B7A3E' }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Product Saved!</h2>
            <p className="text-sm text-gray-500">Redirecting to products list...</p>
          </motion.div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <TopBar title="Add New Product" />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: step >= s.id ? '#C9956C' : '#F3F4F6', color: step >= s.id ? 'white' : '#9CA3AF' }}>
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: step >= s.id ? '#C9956C' : '#9CA3AF' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px mx-3 w-8 sm:w-12" style={{ background: step > s.id ? '#C9956C' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: '#F3F4F6' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Product Name *</label>
                    <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)}
                      placeholder="e.g. Kanjivaram Pure Silk Saree" className={inputClass}
                      style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea value={form.description} onChange={e => updateForm('description', e.target.value)}
                      placeholder="Describe the saree in detail..." rows={4}
                      className={inputClass} style={{ borderColor: '#E5E7EB', resize: 'none' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Category *</label>
                      <select value={form.categoryId} onChange={e => updateForm('categoryId', e.target.value)}
                        className={inputClass} style={{ borderColor: errors.categoryId ? '#EF4444' : '#E5E7EB' }}>
                        <option value="">Select category</option>
                        {categories.length > 0 ? categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>) : STATIC_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Fabric *</label>
                      <select value={form.fabric} onChange={e => updateForm('fabric', e.target.value)}
                        className={inputClass} style={{ borderColor: errors.fabric ? '#EF4444' : '#E5E7EB' }}>
                        <option value="">Select fabric</option>
                        {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Occasion * (select all that apply)</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {OCCASIONS.map(occ => (
                        <button key={occ} type="button" onClick={() => toggleOccasion(occ)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                          style={{
                            background: form.occasion.includes(occ) ? '#C9956C' : 'white',
                            color: form.occasion.includes(occ) ? 'white' : '#6B7280',
                            borderColor: form.occasion.includes(occ) ? '#C9956C' : '#E5E7EB',
                          }}>{occ}</button>
                      ))}
                    </div>
                    {errors.occasion && <p className="text-xs text-red-500 mt-1">{errors.occasion}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Length (meters)</label>
                      <input type="number" step="0.1" value={form.length} onChange={e => updateForm('length', e.target.value)}
                        className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                    </div>
                    <div>
                      <label className={labelClass}>Care Instructions</label>
                      <input type="text" value={form.careInstructions} onChange={e => updateForm('careInstructions', e.target.value)}
                        placeholder="e.g. Dry clean only" className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    {[['blouseIncluded', 'Blouse piece included'], ['isNew', 'Mark as New'], ['isFeatured', 'Featured'], ['isBestseller', 'Bestseller']].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={(form as any)[key]} onChange={e => updateForm(key, e.target.checked)} style={{ accentColor: '#C9956C' }} />
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Pricing & Tax</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Original Price (₹) *</label>
                      <input type="number" value={form.originalPrice} onChange={e => updateForm('originalPrice', e.target.value)}
                        placeholder="e.g. 9999" className={inputClass} style={{ borderColor: errors.originalPrice ? '#EF4444' : '#E5E7EB' }} />
                      {errors.originalPrice && <p className="text-xs text-red-500 mt-1">{errors.originalPrice}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>GST Rate (%)</label>
                      <select value={form.gstRate} onChange={e => updateForm('gstRate', e.target.value)}
                        className={inputClass} style={{ borderColor: '#E5E7EB' }}>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.hasSale} onChange={e => updateForm('hasSale', e.target.checked)} style={{ accentColor: '#C9956C' }} />
                    <span className="text-sm font-medium text-gray-700">This product is on sale</span>
                  </label>
                  {form.hasSale && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Sale Price (₹)</label>
                        <input type="number" value={form.salePrice} onChange={e => updateForm('salePrice', e.target.value)}
                          placeholder="e.g. 7999" className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                      </div>
                      <div>
                        <label className={labelClass}>Discount %</label>
                        <input type="number" value={form.discountPercent} onChange={e => updateForm('discountPercent', e.target.value)}
                          placeholder="e.g. 20" className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                      </div>
                    </div>
                  )}
                  {form.originalPrice && (
                    <div className="p-4 rounded-lg" style={{ background: '#F9FAFB' }}>
                      <p className="text-sm font-medium text-gray-700 mb-2">Price Preview</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-semibold text-gray-800">
                          ₹{(form.hasSale && form.salePrice ? parseInt(form.salePrice) : parseInt(form.originalPrice)).toLocaleString('en-IN')}
                        </span>
                        {form.hasSale && form.salePrice && (
                          <span className="text-base line-through text-gray-400">₹{parseInt(form.originalPrice).toLocaleString('en-IN')}</span>
                        )}
                        {form.hasSale && form.discountPercent && (
                          <span className="text-sm font-medium text-red-500">{form.discountPercent}% off</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Stock & Colour Variants</h2>
                <div className="space-y-4">
                  {form.variants.map((variant, i) => (
                    <div key={i} className="p-4 border rounded-lg" style={{ borderColor: '#E5E7EB' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Variant {i + 1}</span>
                        {form.variants.length > 1 && (
                          <button onClick={() => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))}
                            className="text-red-400"><Trash2 size={14} /></button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelClass}>Colour *</label>
                          <select value={variant.colour} onChange={e => updateVariant(i, 'colour', e.target.value)}
                            className={inputClass} style={{ borderColor: '#E5E7EB' }}>
                            <option value="">Select colour</option>
                            {COLOURS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Stock</label>
                          <input type="number" value={variant.stock} min="0"
                            onChange={e => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                            className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                        </div>
                        <div>
                          <label className={labelClass}>SKU *</label>
                          <input type="text" value={variant.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}
                            placeholder="e.g. KSS-BL-001" className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                        </div>
                      </div>
                      {variant.colour && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: COLOUR_HEX[variant.colour] || '#ccc' }} />
                          <span className="text-xs text-gray-500">{variant.colour}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setForm(prev => ({ ...prev, variants: [...prev.variants, { colour: '', colourHex: '', stock: 0, sku: '' }] }))}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border"
                    style={{ borderColor: '#C9956C', color: '#C9956C' }}>
                    <Plus size={14} /> Add Another Colour
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Product Images</h2>
                <p className="text-sm text-gray-500 mb-6">Upload up to 6 images. First image will be the primary image.</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {form.imagePreview.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border"
                      style={{ borderColor: i === 0 ? '#C9956C' : '#E5E7EB' }}>
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded text-white" style={{ background: '#C9956C' }}>Primary</div>}
                      <button onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i), imagePreview: prev.imagePreview.filter((_, idx) => idx !== i) }))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.imagePreview.length < 6 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer"
                      style={{ borderColor: '#E5E7EB' }}>
                      <Upload size={20} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Add Image</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">SEO & Review</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Meta Title</label>
                    <input type="text" value={form.metaTitle} onChange={e => updateForm('metaTitle', e.target.value)}
                      placeholder={form.name || "Product meta title"} className={inputClass} style={{ borderColor: '#E5E7EB' }} />
                  </div>
                  <div>
                    <label className={labelClass}>Meta Description</label>
                    <textarea value={form.metaDescription} onChange={e => updateForm('metaDescription', e.target.value)}
                      placeholder={form.description || "Product meta description"} rows={3}
                      className={inputClass} style={{ borderColor: '#E5E7EB', resize: 'none' }} />
                  </div>
                  {errors.general && <p className="text-sm text-red-500 p-3 rounded-lg bg-red-50">{errors.general}</p>}
                  <div className="p-4 rounded-lg border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Product Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>Name:</span><span className="font-medium">{form.name || '—'}</span>
                      <span>Category:</span><span className="font-medium">{CATEGORIES.find(c => c.id === form.categoryId)?.label || '—'}</span>
                      <span>Fabric:</span><span className="font-medium">{form.fabric || '—'}</span>
                      <span>Price:</span><span className="font-medium">{form.originalPrice ? `₹${parseInt(form.originalPrice).toLocaleString('en-IN')}` : '—'}</span>
                      <span>Variants:</span><span className="font-medium">{form.variants.filter(v => v.colour).length} colours</span>
                      <span>Images:</span><span className="font-medium">{form.images.length} uploaded</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: '#F3F4F6' }}>
            <button onClick={() => step === 1 ? router.push('/products') : setStep(s => s - 1)}
              className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 rounded-lg border hover:bg-gray-50"
              style={{ borderColor: '#E5E7EB' }}>
              <ArrowLeft size={14} />{step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < 5 ? (
              <button onClick={() => { if (validateStep()) setStep(s => s + 1) }}
                className="flex items-center gap-2 text-sm text-white px-6 py-2 rounded-lg"
                style={{ background: '#C9956C' }}>
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 text-sm text-white px-6 py-2 rounded-lg disabled:opacity-50"
                style={{ background: '#1B7A3E' }}>
                {saving ? 'Saving...' : <><Check size={14} /> Save Product</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
