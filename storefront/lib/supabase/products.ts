import { createClient } from '@supabase/supabase-js'
import type { Product, ProductImage, ProductVariant } from '@/types'
 
const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
 
function mapImage(row: any): ProductImage {
  return {
    id: row.id,
    url: row.url,
    altText: row.alt_text || '',
    isPrimary: row.is_primary,
    order: row.order_index,
  }
}
 
function mapVariant(row: any): ProductVariant {
  return {
    id: row.id,
    colour: row.colour,
    colourHex: row.colour_hex,
    stock: row.stock,
    sku: row.sku,
  }
}
 
function mapProduct(row: any): Product {
  const variants: ProductVariant[] = (row.product_variants || []).map(mapVariant)
  const images: ProductImage[] = (row.product_images || [])
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map(mapImage)
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
 
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand || '',
    description: row.description || '',
    fabric: row.fabric || '',
    occasion: row.occasion || [],
    careInstructions: row.care_instructions || '',
    blouseIncluded: row.blouse_included || false,
    length: row.length || 5.5,
    category: row.categories?.slug?.replace('-sarees', '') || '',
    categorySlug: row.categories?.slug || '',
    originalPrice: row.original_price,
    salePrice: row.sale_price || null,
    discountPercent: row.discount_percent || null,
    saleStartDate: row.sale_start_date || null,
    saleEndDate: row.sale_end_date || null,
    gstRate: row.gst_rate || 5,
    images,
    variants,
    totalStock,
    isOutOfStock: totalStock === 0,
    isNew: row.is_new || false,
    isFeatured: row.is_featured || false,
    isBestseller: row.is_bestseller || false,
    customFields: row.custom_fields || {},
    averageRating: row.average_rating || 0,
    reviewCount: row.review_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
 
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase()
 
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories ( slug, label ),
      product_images ( id, url, alt_text, is_primary, order_index ),
      product_variants ( id, colour, colour_hex, stock, sku )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
 
  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }
 
  return (data || []).map(mapProduct)
}
 
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabase()
 
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories ( slug, label ),
      product_images ( id, url, alt_text, is_primary, order_index ),
      product_variants ( id, colour, colour_hex, stock, sku )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
 
  if (error || !data) {
    console.error('Error fetching product by slug:', error?.message)
    return null
  }
 
  return mapProduct(data)
}
 
export async function getRelatedProducts(categorySlug: string, excludeSlug: string): Promise<Product[]> {
  const supabase = getSupabase()
 
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()
 
  if (!category) return []
 
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories ( slug, label ),
      product_images ( id, url, alt_text, is_primary, order_index ),
      product_variants ( id, colour, colour_hex, stock, sku )
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .neq('slug', excludeSlug)
    .limit(4)
 
  if (error) {
    console.error('Error fetching related products:', error.message)
    return []
  }
 
  return (data || []).map(mapProduct)
}
 
export async function getProductReviews(productId: string) {
  const supabase = getSupabase()
 
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, is_verified_purchase, created_at,
      profiles ( full_name, avatar_url )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
 
  if (error) {
    console.error('Error fetching reviews:', error.message)
    return []
  }
 
  return (data || []).map((r: any) => ({
    id: r.id,
    productId: productId,
    userId: '',
    userFullName: r.profiles?.full_name || 'Anonymous',
    userAvatarUrl: r.profiles?.avatar_url || null,
    rating: r.rating,
    comment: r.comment || '',
    isVerifiedPurchase: r.is_verified_purchase,
    createdAt: r.created_at,
  }))
}
 
