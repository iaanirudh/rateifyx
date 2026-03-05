# RateifyX

AI-powered freight quote normalization SaaS.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + IBM Plex type system
- **Supabase** — auth (magic link) + database
- **Anthropic Claude API** — quote extraction engine
- **DodoPayments** — billing (Step 3)

---

## Setup

```bash
npm install
cp .env.local .env.local.bak   # already filled, just add your keys
npm run dev
```

### Environment Variables

| Key | Where to get it |
|-----|----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |

### Supabase Setup (magic link auth)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication → URL Configuration**
3. Set **Site URL** to `http://localhost:3000` (dev) or your domain
4. Add **Redirect URL**: `http://localhost:3000/auth/callback`
5. Go to **Authentication → Email Templates** → customize the magic link email if desired
6. Paste your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into `.env.local`

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/pricing` | Pricing page (monthly/yearly toggle) |
| `/login` | Magic link login |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/dashboard/overview` | Main dashboard (protected) |
| `/dashboard/quotes` | Quote extractor (protected) |
| `/dashboard/upload` | File upload (protected) |
| `/dashboard/history` | Quote history (protected) |
| `/dashboard/settings` | Account settings (protected) |
| `/api/extract` | POST — extract single quote |
| `/api/upload` | POST — batch file upload |
| `/api/webhook/email` | POST — SendGrid inbound parse |
| `/auth/callback` | Supabase magic link callback |

---

## Step 3: DodoPayments

Wire up billing after Supabase is working:
1. Create products in DodoPayments dashboard
2. Add `DODO_API_KEY` and `DODO_WEBHOOK_SECRET` to `.env.local`
3. Add checkout redirect in `/pricing` page
4. Add webhook handler at `/api/webhook/payment`
5. Store subscription status in Supabase `profiles` table
6. Gate dashboard access by plan in middleware
