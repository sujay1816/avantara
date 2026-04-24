# Rebrand: Avantara → Satika

This rebrand used **only `config.json` + env vars** — no brand name was
hardcoded into any component. The same process works for future resellers
(change the config, change one env var, redeploy).

---

## What I changed in the repo

### Both `config.json` files (root + `storefront/config.json`)
| Field | Before | After |
|---|---|---|
| `brand.name` | Avantara | Satika |
| `brand.logoText` | Avantara | Satika |
| `contact.whatsappMessage` | "…order on Avantara." | "…order on Satika." |
| `footer.newsletterHeading` | Join the Avantara Circle | Join the Satika Circle |
| `footer.copyrightText` | © 2025 Avantara… | © 2025 Satika… |
| `seo.defaultTitle` | Avantara — Draped in Elegance | Satika — Draped in Elegance |
| `gst.businessName` | Avantara Fashion Pvt Ltd | Satika Fashion Pvt Ltd |

### Admin panel — removed brand-specific fallbacks
Three spots used `process.env.NEXT_PUBLIC_BRAND_NAME || 'Avantara'`. I changed
the fallback to the generic `'Store'` so the next reseller isn't stuck with
"Avantara" if they forget to set the env var:
- `admin/components/layout/Sidebar.tsx`
- `admin/app/login/page.tsx`
- `admin/app/layout.tsx`

---

## What you must still do

### 1. Update the Vercel env var (BOTH projects)

The admin panel reads the brand name from `NEXT_PUBLIC_BRAND_NAME`. You need
to change it in two places:

**Storefront project** (`avantara-storefront-v1`)
Settings → Environment Variables → `NEXT_PUBLIC_BRAND_NAME` → set to `Satika`

**Admin project** (`adminv2`)
Settings → Environment Variables → `NEXT_PUBLIC_BRAND_NAME` → set to `Satika`

Changing an env var requires a redeploy — the push in step 3 takes care of it.

### 2. Decide what to do with account-specific fields

These still say "avantara" and I did **not** auto-change them because they
reference real accounts you may or may not own under the Satika name:

| `config.json` field | Current value | Action required |
|---|---|---|
| `contact.supportEmail` | `support@avantara.in` | Tell me the Satika email (or leave until you register it) |
| `contact.businessEmail` | `hello@avantara.in` | Same |
| `social.instagram` | `…/avantara` | Change once the Satika handle exists |
| `social.facebook` | `…/avantara` | Same |
| `social.pinterest` | `…/avantara` | Same |
| `seo.twitterHandle` | `@avantara` | Same |

If you already have Satika accounts, tell me the handles and I'll update
all six in one pass.

### 3. Commit + push

```bash
cd C:\Users\Flexiple\Downloads\avantara-project\avantara
git add config.json storefront/config.json \
        admin/components/layout/Sidebar.tsx \
        admin/app/login/page.tsx \
        admin/app/layout.tsx \
        docs/REBRAND-TO-SATIKA.md
git commit -m "rebrand: Avantara -> Satika (config + generic admin fallbacks)"
git push origin feature/initial-project-setup-nextjs-supabase-config
```

Vercel auto-deploys on push. If not, from each app folder run `vercel --prod`.

### 4. Smoke test
- [ ] Storefront navbar shows **Satika**
- [ ] Storefront footer shows **Join the Satika Circle** and **© 2025 Satika**
- [ ] Browser tab shows **Satika — Draped in Elegance**
- [ ] Admin sidebar + login page + tab title show **Satika**

---

## Things I deliberately did NOT change

- `package.json` name fields (`avantara-storefront`, `avantara-admin`).
  These are internal npm package identifiers, never shown to customers, and
  changing them would force a `package-lock.json` regeneration for zero
  user-visible benefit. If you want them renamed for repo-hygiene reasons
  say so and I'll do it in a separate commit.
- `CLAUDE-HANDOVER.md`, `README.md`, `SUPABASE-SCHEMA.sql` — documentation
  describing the project history as Avantara. Those are historical notes,
  not live code. Happy to update if you want them to reflect Satika.
- `admin/.env.example` — contains example Vercel URLs (`avantara-admin.vercel.app`).
  These are just example placeholders; your real values live in
  `.env.local` / Vercel env vars, which you control.

---

## Future rebrands — the playbook

Any future reseller only needs to:
1. Edit `brand.name`, `brand.logoText`, and the Avantara-containing display
   strings in both `config.json` files.
2. Set `NEXT_PUBLIC_BRAND_NAME` on both Vercel projects.
3. Replace the six account-specific fields (emails, social, twitter).
4. Swap `storefront/public/images/logo.png` and `favicon.ico`.
5. Redeploy.

No code files should need to change.
