// ─── Product Types ───────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  colour: string
  colourHex: string
  stock: number
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  description: string
  fabric: string
  occasion: string[]
  careInstructions: string
  blouseIncluded: boolean
  length: number // in meters
  category: string
  categorySlug: string
  originalPrice: number
  salePrice: number | null
  discountPercent: number | null
  saleStartDate: string | null
  saleEndDate: string | null
  gstRate: number
  images: ProductImage[]
  variants: ProductVariant[]
  totalStock: number
  isOutOfStock: boolean
  isNew: boolean
  isFeatured: boolean
  isBestseller: boolean
  customFields: Record<string, string>
  averageRating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  isPrimary: boolean
  order: number
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'return_approved' | 'return_rejected' | 'refunded'

export type PaymentMethod = 'cod' | 'upi' | 'razorpay'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  colour: string
  quantity: number
  originalPrice: number
  salePrice: number
  gstRate: number
  gstAmount: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  address: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  couponCode: string | null
  couponDiscount: number
  subtotal: number
  shippingCharge: number
  totalGst: number
  totalAmount: number
  status: OrderStatus
  shiprocketOrderId: string | null
  trackingId: string | null
  courierName: string | null
  estimatedDelivery: string | null
  returnReason: string | null
  returnImageUrl: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

// ─── Address Types ────────────────────────────────────────────────────────────

export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'staff' | 'manager' | 'superadmin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  role: UserRole
  isBlocked: boolean
  createdAt: string
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  colour: string
  colourHex: string
  originalPrice: number
  salePrice: number | null
  quantity: number
  stock: number
}

// ─── Wishlist Types ───────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  addedAt: string
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string
  productId: string
  userId: string
  userFullName: string
  userAvatarUrl: string | null
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  createdAt: string
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'flat' | 'free_shipping'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderValue: number
  maxUsageCount: number
  usageCount: number
  perUserLimit: number
  expiryDate: string | null
  isActive: boolean
  createdAt: string
}

// ─── Banner Types ─────────────────────────────────────────────────────────────

export interface Banner {
  id: string
  imageUrl: string
  heading: string
  subheading: string | null
  ctaLabel: string
  ctaUrl: string
  isActive: boolean
  order: number
}

// ─── Config Types ─────────────────────────────────────────────────────────────

export interface SiteConfig {
  brand: {
    name: string
    tagline: string
    logoType: 'text' | 'image' | 'both'
    logoText: string
    logoImageUrl: string
    faviconUrl: string
  }
  theme: {
    primaryColor: string
    accentColor: string
    accentDark: string
    textPrimary: string
    textSecondary: string
    backgroundPrimary: string
    backgroundSecondary: string
    borderColor: string
    fontHeading: string
    fontBody: string
    fontHeadingUrl: string
    fontBodyUrl: string
  }
  store: {
    currency: string
    currencySymbol: string
    language: string
    country: string
    timezone: string
  }
  categories: Array<{
    id: string
    label: string
    slug: string
  }>
  homepage: {
    heroBannerVideoUrl: string
    heroBannerFallbackImage: string
    heroHeading: string
    heroSubheading: string
    heroCTALabel: string
    heroCTAUrl: string
    sections: Array<{
      id: string
      visible: boolean
      order: number
      heading: string
    }>
  }
  contact: {
    whatsappNumber: string
    whatsappMessage: string
    supportEmail: string
    businessEmail: string
  }
  social: {
    instagram: string
    facebook: string
    pinterest: string
    youtube: string
  }
  footer: {
    showNewsletter: boolean
    newsletterHeading: string
    newsletterSubtext: string
    links: Array<{
      heading: string
      items: Array<{ label: string; url: string }>
    }>
    copyrightText: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    defaultKeywords: string
    ogImageUrl: string
    twitterHandle: string
  }
  shipping: {
    freeShippingAbove: number
    defaultShippingCharge: number
    estimatedDeliveryDays: string
  }
  gst: {
    businessName: string
    gstin: string
    address: string
    defaultGstRate: number
  }
  payments: {
    razorpayEnabled: boolean
    codEnabled: boolean
    upiEnabled: boolean
  }
  reviews: {
    enabled: boolean
    autoPublish: boolean
    allowedAfterPurchase: boolean
  }
  features: {
    wishlist: boolean
    productReviews: boolean
    pincodeCheck: boolean
    relatedProducts: boolean
    newsletterSignup: boolean
    returnRequests: boolean
    lowStockThreshold: number
  }
}
