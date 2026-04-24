import { Suspense } from 'react'
import ShopContent from './ShopContent'
import { getProducts } from '@/lib/supabase/products'

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <Suspense fallback={
      <div className="page-container py-20 text-center">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    }>
      <ShopContent products={products} />
    </Suspense>
  )
}
