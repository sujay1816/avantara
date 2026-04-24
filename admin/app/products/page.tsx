'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import TopBar from '@/components/layout/TopBar'
import { Plus, Search, Edit2, Trash2, Copy } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(label), product_variants(stock)')
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const getTotalStock = (product: any) => {
    return product.product_variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <AdminLayout>
      <TopBar title="Products" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-lg px-3 h-9 w-64 bg-white" style={{ borderColor: '#E5E7EB' }}>
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="text-sm text-gray-600 w-full bg-transparent outline-none" />
            </div>
          </div>
          <Link href="/products/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#C9956C' }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#F3F4F6' }}>
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">No products yet.</p>
              <Link href="/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#C9956C' }}>
                <Plus size={14} /> Add Your First Product
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const totalStock = getTotalStock(product)
                  return (
                    <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded flex items-center justify-center flex-shrink-0"
                            style={{ background: '#F5EDE3' }}>
                            <span className="text-lg">🥻</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                            {product.is_new && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1A1714', color: 'white' }}>New</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{product.categories?.label || '—'}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">₹{product.original_price?.toLocaleString('en-IN')}</p>
                        {product.sale_price && (
                          <p className="text-xs text-gray-400 line-through">₹{product.sale_price?.toLocaleString('en-IN')}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium"
                          style={{ color: totalStock === 0 ? '#C0392B' : totalStock <= 3 ? '#C9956C' : '#1B7A3E' }}>
                          {totalStock === 0 ? 'Out of stock' : `${totalStock} units`}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: product.is_active ? '#E8F5EE' : '#F3F4F6', color: product.is_active ? '#1B7A3E' : '#6B7280' }}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/products/${product.id}/edit`}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                            <Edit2 size={14} className="text-gray-500" />
                          </Link>
                          <button onClick={() => deleteProduct(product.id)}
                            className="p-1.5 rounded hover:bg-red-50 transition-colors">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
