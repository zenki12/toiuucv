# FitYourCV — Full-Stack AI CV Optimizer SaaS

A complete SaaS application for AI-powered CV optimization with Google login, usage limits, PayOS payments, and analysis history.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database & Auth | Supabase (PostgreSQL + Google OAuth) |
| AI Engine | Claude Sonnet (Anthropic API) |
| Payments | PayOS (QR / Chuyển khoản) |
| Styling | Tailwind CSS + Custom CSS |
| Hosting | Vercel |

## Features

- ✅ Google OAuth login (Supabase)
- ✅ Upload CV: PDF & DOCX (text extraction)
- ✅ AI Analysis vs Job Description (Claude AI)
- ✅ Scores: Overall, ATS, Keyword, Structure, Experience
- ✅ Suggestions: Strengths, Weaknesses, Keywords, Rewrites
- ✅ Free tier: 5 analyses/day with daily reset
- ✅ Pro tier: Unlimited — 20,000 VND / 30 days
- ✅ PayOS checkout + webhook for auto-activation
- ✅ Analysis history saved per user
- ✅ Admin stats endpoint
- ✅ Bilingual UI (Vietnamese + English)

## Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo>
cd fityourcv
npm install
cp .env.example .env.local
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. In SQL Editor, run `supabase/migrations/001_schema.sql`
3. Go to Authentication → Providers → Enable Google
4. Add Google OAuth credentials (from Google Cloud Console)
5. Set Redirect URL: `https://your-domain.com/api/auth/callback`
6. Copy: Project URL + anon key + service role key → `.env.local`

### 3. Anthropic API

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key → add to `.env.local` as `ANTHROPIC_API_KEY`

### 4. PayOS Setup

1. Register at [payos.vn](https://payos.vn)
2. Create project → get Client ID, API Key, Checksum Key
3. Add to `.env.local`
4. Set webhook URL in PayOS dashboard: `https://your-domain.com/api/payment/webhook`

### 5. Environment Variables

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ANTHROPIC_API_KEY=sk-ant-...

PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...

NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=FitYourCV

PRO_PRICE_VND=20000
FREE_DAILY_LIMIT=5

# Optional: comma-separated admin emails
ADMIN_EMAILS=admin@example.com
```

### 6. Deploy to Vercel

```bash
# Option A: GitHub → Vercel (recommended)
# 1. Push to GitHub
# 2. vercel.com/new → Import repo
# 3. Add all env vars in Vercel dashboard
# 4. Deploy

# Option B: CLI
npm i -g vercel
vercel --prod
```

### 7. Post-deploy

- Update Supabase Auth redirect URLs with your Vercel domain
- Update PayOS webhook URL
- Test full flow: signup → analyze → payment

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # Google login
│   ├── analyze/page.tsx      # CV upload + JD form
│   ├── dashboard/page.tsx    # History + analysis results
│   ├── pricing/page.tsx      # Plans + PayOS checkout
│   └── api/
│       ├── analyze/          # POST: AI analysis
│       ├── history/          # GET/DELETE: user history
│       ├── auth/callback/    # OAuth callback
│       ├── payment/
│       │   ├── checkout/     # POST: create PayOS payment
│       │   └── webhook/      # POST: PayOS webhook
│       └── admin/stats/      # GET: admin stats
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── landing/Sections.tsx
│   └── ui/ScoreRing.tsx
└── lib/
    ├── supabase.ts           # Browser + server + admin clients
    ├── ai.ts                 # Claude analysis engine
    ├── extract.ts            # PDF + DOCX text extraction
    ├── payos.ts              # PayOS API + webhook verify
    └── auth.ts               # Rate limit + pro activation
```

## Business Logic

### Free Tier
- 5 analyses per day (resets at midnight)
- Daily count tracked in `profiles.daily_count`
- Auto-reset via `reset_daily_count_if_needed()` SQL function

### Pro Activation Flow
1. User clicks "Nâng cấp Pro"
2. `/api/payment/checkout` creates PayOS payment link
3. User pays via QR/bank transfer
4. PayOS sends webhook to `/api/payment/webhook`
5. Webhook verifies signature, updates `payments` table, sets `profiles.plan = 'pro'`
6. User redirected to `/dashboard?status=success`

## Admin

Access stats at `/api/admin/stats` (requires email in `ADMIN_EMAILS`)
Returns: total users, pro users, total analyses, today's analyses, revenue
