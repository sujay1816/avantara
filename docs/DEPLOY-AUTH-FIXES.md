# Deploy the auth fixes — step-by-step

You need to do work in **three places** for the fixes to take effect:
Supabase dashboard, Vercel, and the code (already done).

---

## 1. Fix the signup trigger (Supabase SQL Editor)

1. Go to https://supabase.com/dashboard/project/brzpbzojbiaatkiyzthy/sql/new
2. Open `docs/fix-signup-trigger.sql` in this repo, copy the whole file
3. Paste into the SQL Editor, click **Run**
4. Expected: "Success. No rows returned."

Verify it worked:

```sql
SELECT COUNT(*) FROM public.profiles;
-- Should match or exceed the count of auth.users rows.
```

---

## 2. Fix Google OAuth redirect (Supabase Auth settings)

1. Go to https://supabase.com/dashboard/project/brzpbzojbiaatkiyzthy/auth/url-configuration
2. **Site URL** — set to exactly:
   ```
   https://avantara-storefront-v1.vercel.app
   ```
   (no trailing slash)
3. **Redirect URLs** — add all of these (one per line):
   ```
   https://avantara-storefront-v1.vercel.app/auth/callback
   https://avantara-storefront-v1.vercel.app/reset-password
   http://localhost:3000/auth/callback
   http://localhost:3000/reset-password
   ```
   The localhost entries let you still test locally.
4. Click **Save**.

---

## 3. Make sure `NEXT_PUBLIC_APP_URL` is set on Vercel

The code change I made prefers `NEXT_PUBLIC_APP_URL` over `window.location.origin`.
That env var already exists according to the handover, but double-check:

1. Go to https://vercel.com/dashboard → **avantara-storefront-v1** → **Settings → Environment Variables**
2. Confirm `NEXT_PUBLIC_APP_URL` = `https://avantara-storefront-v1.vercel.app`
   (no trailing slash)
3. If you change or add it, Vercel requires a redeploy for it to take effect — just run the deploy in step 4.

---

## 4. Deploy the code changes to Vercel

From the `avantara/storefront` folder:

```bash
git add app/login/page.tsx app/forgot-password/page.tsx docs/fix-signup-trigger.sql docs/DEPLOY-AUTH-FIXES.md
git commit -m "fix: use NEXT_PUBLIC_APP_URL for OAuth + password reset redirects"
git push origin feature/initial-project-setup-nextjs-supabase-config
```

If Vercel is connected to the GitHub branch, the push triggers an auto-deploy. Otherwise:

```bash
cd storefront
vercel --prod
```

---

## 5. Promote your account to superadmin

Once signup works (step 1 ran, plus you've created your account):

1. Sign up on https://avantara-storefront-v1.vercel.app/login with the email you want to use as admin
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles SET role = 'superadmin' WHERE email = 'your@email.com';
   ```
3. Log in to the admin panel: https://adminv2-ten.vercel.app/login

---

## 6. Smoke test

- [ ] Sign up a new account on the storefront — should succeed, no "Database error saving new user"
- [ ] Log out, click **Continue with Google** — should land back on `avantara-storefront-v1.vercel.app/`, logged in
- [ ] Click **Forgot password?**, enter your email — the reset link in the email should point at `avantara-storefront-v1.vercel.app/reset-password`, not localhost
- [ ] Log into admin panel with the superadmin account — dashboard should load
