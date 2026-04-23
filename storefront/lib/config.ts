import config from '@/config.json'
import type { SiteConfig } from '@/types'

// Load config from config.json — all white-label settings live here
export function getConfig(): SiteConfig {
  return config as SiteConfig
}

// Format currency using store config
export function formatPrice(amount: number): string {
  const { currencySymbol } = config.store
  return `${currencySymbol}${amount.toLocaleString('en-IN')}`
}

// Calculate discounted price
export function getEffectivePrice(product: { originalPrice: number; salePrice: number | null; saleStartDate: string | null; saleEndDate: string | null }): number {
  if (!product.salePrice) return product.originalPrice

  const now = new Date()
  const start = product.saleStartDate ? new Date(product.saleStartDate) : null
  const end = product.saleEndDate ? new Date(product.saleEndDate) : null

  if (start && now < start) return product.originalPrice
  if (end && now > end) return product.originalPrice

  return product.salePrice
}

// Calculate shipping charge
export function getShippingCharge(subtotal: number): number {
  if (subtotal >= config.shipping.freeShippingAbove) return 0
  return config.shipping.defaultShippingCharge
}

// Calculate GST amount
export function calculateGst(price: number, gstRate: number): number {
  return Math.round((price * gstRate) / 100)
}
