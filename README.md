# Avantara — White-Label Saree E-Commerce Platform

> **Draped in Elegance** · Built with Next.js, Supabase & Framer Motion

A production-ready, fully white-label e-commerce platform for saree sellers. Change one file (`config.json`) to rebrand the entire store for any new seller.

---

## 📦 Project Structure

```
avantara/
├── config.json              ← ✏️  Edit this to rebrand everything
├── storefront/              ← Customer-facing Next.js store
│   ├── app/
│   │   ├── page.tsx         ← Homepage
│   │   ├── shop/            ← Product listing + filters
│   │   ├── product/[slug]/  ← Product detail page
│   │   ├── cart/            ← Cart page
│   │   ├── checkout/        ← Checkout flow
│   │   ├── wishlist/        ← Wishlist page
│   │   ├── profile/         ← Customer profile
│   │   ├── orders/          ← Order history + tracking
│   │   ├── login/           ← Login + Signup
│   │   └── policy/          ← Return & refund policy
│   ├── components/
│   │   ├── layout/          ← Navbar, Footer, WhatsApp
│   │   ├── product/         ← ProductCard (3D effects)
│   │   ├── cart/            ← Cart components
│   │   └── ui/              ← Shared UI components
│   ├── lib/
│   │   ├── supabase/        ← Supabase client + server
│   │   └── config.ts        ← Config loader helpers
│   ├── types/index.ts       ← All TypeScript types
│   ├── .env.example         ← Copy to .env.local
│   └── package.json
├── admin/                   ← Admin panel (separate deployment)
│   ├── app/
│   │   ├── dashboard/       ← Analytics + overview
│   │   ├── products/        ← Manage products
│   │   ├── orders/          ← Manage orders
│   │   ├── customers/       ← Manage customers
│   │   ├── coupons/         ← Discount codes
│   │   ├── returns/         ← Return requests + image review
│   │   ├── banners/         ← Homepage banner management
│   │   └── staff/           ← Staff + role management
│   └── .env.example
└── docs/
    ├── SUPABASE-SCHEMA.sql  ← Run this to set up the DB
    ├── DEPLOYMENT-GUIDE.pdf ← Step-by-step deployment guide
    └── SELLER-SETUP.pdf     ← One-page guide for sellers
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion (3D effects) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Storage | Supabase Storage |
| Payments | Razorpay (UPI + COD) |
| Email | SendGrid |
| SMS | Fast2SMS |
| Shipping | Shiprocket |
| Deployment | Vercel (2 separate deployments) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ — [Download](https://nodejs.org)
- Git — [Download](https://git-scm.com)
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)

### 1. Clone the repository
```bash
git clone https://github.com/sujay1816/avantara.git
cd avantara
```

### 2. Set up the database
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project, go to **SQL Editor**
3. Copy the contents of `docs/SUPABASE-SCHEMA.sql`
4. Paste it into the SQL Editor and click **Run**
5. Your database is ready!

### 3. Configure the storefront
```bash
cd storefront
cp .env.example .env.local
```
Open `.env.local` and fill in your Supabase URL and keys.

### 4. Install and run the storefront
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Configure and run the admin panel
```bash
cd ../admin
cp .env.example .env.local
# Fill in .env.local with the same Supabase credentials
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001)

---

## ✏️ White-Label Configuration

**Everything visual and brand-related is controlled by `config.json`** in the root directory.

```json
{
  "brand": {
    "name": "Your Brand Name",
    "tagline": "Your Brand Tagline",
    "logoImageUrl": "/images/logo.png"
  },
  "theme": {
    "accentColor": "#C9956C",
    "fontHeading": "Cormorant Garamond"
  },
  "categories": [
    { "id": "silk", "label": "Silk Sarees", "slug": "silk-sarees" }
  ],
  "contact": {
    "whatsappNumber": "+919999999999"
  }
}
```

### What config.json controls:
| Section | Fields |
|---|---|
| `brand` | Name, tagline, logo (text + image) |
| `theme` | Colors, fonts |
| `store` | Currency, language, country |
| `categories` | Nav categories |
| `homepage` | Hero text, CTA, visible sections |
| `contact` | WhatsApp number, support email |
| `social` | Instagram, Facebook, Pinterest |
| `footer` | Links, newsletter toggle |
| `seo` | Meta tags, OG image |
| `shipping` | Free shipping threshold, charges |
| `gst` | Business name, GSTIN, GST rates |
| `payments` | Enable/disable payment methods |
| `features` | Toggle features on/off |

---

## 🎨 Design System

### Color Palette
The color scheme is driven by CSS variables set from `config.json`:
- `--color-accent`: Rose gold `#C9956C` — all CTAs and highlights
- `--color-bg-primary`: Off-white `#FDFAF7` — page background
- `--color-text-primary`: Near-black `#1A1A1A` — headings and body

### Typography
- **Headings**: Cormorant Garamond (elegant serif)
- **Body**: DM Sans (clean, readable)

### 3D Effects (Framer Motion)
- **Hero**: 3D rotating fabric texture orb
- **Product cards**: Tilt on hover + flip to reveal details + floating depth shadow
- **Scroll sections**: Fade + slide up on enter
- **Buttons**: Press-down depth on click

---

## 🎛 Admin Panel Roles

| Role | Access |
|---|---|
| `superadmin` | Full access to everything |
| `manager` | Products, Orders, Discounts, Banners |
| `staff` | Orders only |

Roles are stored in the `profiles` table. To set a user as superadmin:
```sql
UPDATE profiles SET role = 'superadmin' WHERE email = 'your@email.com';
```

---

## 📱 Mobile Responsiveness

- **Navbar**: Hamburger menu sliding from left on mobile
- **Product grid**: 2 columns on mobile, 4 on desktop
- **Filters**: Bottom drawer on mobile, sidebar on desktop
- **Checkout**: Full-page steps, optimized for thumb use
- All Framer Motion animations are performance-optimized

---

## 🔐 Authentication Flow

1. **Email/Password**: Supabase Auth handles sign up + sign in
2. **Google OAuth**: Configured via Supabase > Authentication > Providers
3. **Session**: Managed via `@supabase/ssr` (server + client)
4. **Protected routes**: Middleware checks auth status

---

## 🛒 Checkout Flow

```
Cart → Login/Signup → Pincode Check → Address → Coupon → Payment → Order Confirmation
```

Payment options:
- **UPI**: Via Razorpay (supports all UPI apps)
- **COD**: Managed via Razorpay COD or manual confirmation

---

## 📦 Order Tracking

```
Placed → Shipped → Delivered
```

Status updates trigger:
- Email notification via SendGrid
- SMS notification via Fast2SMS
- Real-time update in customer's order page

---

## 🚢 Deploying to Vercel

See `docs/DEPLOYMENT-GUIDE.pdf` for the complete step-by-step guide with screenshots.

**Quick version:**
```bash
# Deploy storefront
cd storefront
vercel --prod

# Deploy admin (separate project)
cd ../admin
vercel --prod
```

---

## 🏪 Selling to a New Seller

1. Fork/clone this repo
2. Edit `config.json` (brand name, colors, categories, WhatsApp, social links)
3. Create a new Supabase project and run `SUPABASE-SCHEMA.sql`
4. Create new Vercel projects for storefront + admin
5. Set environment variables in Vercel
6. Deploy — done!

Hand the seller `docs/SELLER-SETUP.pdf` for a simple one-page guide.

---

## 📄 License

This project is proprietary. All rights reserved. Do not distribute without permission.

---

*Built with ❤️ for Avantara — Draped in Elegance*
