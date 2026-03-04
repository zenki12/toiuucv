# TỐI ƯU CV — Tài liệu Kiến trúc Tổng thể

## B3 — ERD + Prisma Schema

### Entity Relationship Diagram

```
users
  id (uuid PK)
  email (unique)
  name
  avatar_url
  role: 'user' | 'admin'
  created_at

uploads
  id (uuid PK)
  user_id → users.id
  type: 'cv' | 'jd'
  filename
  mime_type
  storage_path
  text_hash (sha256)
  created_at
  expires_at (= created_at + 90 days)

reports
  id (uuid PK)
  user_id → users.id
  cv_upload_id → uploads.id
  jd_upload_id → uploads.id
  combined_hash (sha256 of cv_hash+jd_hash)
  overall_score (0-100)
  recommendation: 'apply' | 'consider' | 'not_fit'
  strategy_json (JSONB)
  created_at

report_metrics
  id (uuid PK)
  report_id → reports.id
  metric_key (e.g. 'relevance', 'summary')
  score (0-100)
  weight (int)
  findings_json (JSONB)
  advice_json (JSONB)

report_gap_map
  id (uuid PK)
  report_id → reports.id
  group_key: 'must_have' | 'responsibilities' | 'tools'
  requirement_text
  priority: 'high' | 'med' | 'low'
  status: 'FOUND' | 'PARTIAL' | 'MISSING'
  evidence_snippet (max 300 chars, PII masked)
  gap_reason
  suggested_section
  rewrite_templates_json (JSONB)

report_checklist
  id (uuid PK)
  report_id → reports.id
  item_key
  label_vi
  label_en
  is_done (boolean)
  created_at
  updated_at

usage_limits
  user_id → users.id (PK)
  month_yyyymm (e.g. '202501')
  used_count (int)
  limit_count (int default 10)

admin_faq
  id (uuid PK)
  q_vi, a_vi, q_en, a_en
  display_order
  created_at

admin_testimonials
  id (uuid PK)
  name, title_vi, title_en
  quote_vi, quote_en
  avatar_url
  display_order
  created_at
```

---

## B4 — API Spec

### Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: File, type: 'cv' | 'jd' }
Auth: required

Response 200:
{
  upload_id: string,
  filename: string,
  type: 'cv' | 'jd',
  text_hash: string,
  expires_at: string
}

Errors:
  401 - Not authenticated
  413 - File too large (>100MB)
  422 - Unsupported file type
  429 - Usage limit exceeded
```

### Create Report
```
POST /api/report/create
Body: { cv_upload_id: string, jd_upload_id: string }
Auth: required

Response 200:
{
  report_id: string,
  cached: boolean,
  overall_score: number,
  recommendation: 'apply' | 'consider' | 'not_fit'
}

Errors:
  401 - Not authenticated
  404 - Upload not found
  429 - Monthly limit exceeded (10/month)
```

### Get Report
```
GET /api/report/:id
Auth: required (owner only)

Response 200:
{
  id: string,
  overall_score: number,
  recommendation: string,
  radar: RadarItem[],
  strategy: Strategy,
  gap_map: GapMapItem[],
  metrics_detail: MetricDetail[],
  ats_keywords: ATSKeywords,
  checklist: ChecklistItem[]
}
```

### List Reports
```
GET /api/reports?page=1&limit=10
Auth: required

Response 200:
{
  reports: ReportSummary[],
  total: number,
  page: number
}
```

### Toggle Checklist
```
POST /api/checklist/toggle
Body: { item_id: string, is_done: boolean }
Auth: required

Response 200: { success: true }
```

### Admin - Stats
```
GET /api/admin/stats
Auth: admin only

Response 200:
{
  total_users: number,
  total_reports: number,
  avg_score: number,
  reports_this_month: number,
  top_recommendations: { apply: n, consider: n, not_fit: n }
}
```

### Admin - FAQ CRUD
```
GET    /api/admin/faq
POST   /api/admin/faq          Body: { q_vi, a_vi, q_en, a_en, display_order }
PUT    /api/admin/faq/:id
DELETE /api/admin/faq/:id
```

### Admin - Testimonials CRUD
```
GET    /api/admin/testimonials
POST   /api/admin/testimonials
PUT    /api/admin/testimonials/:id
DELETE /api/admin/testimonials/:id
```

---

## B5 — UI Routes & Components Map

```
app/
├── (public)/
│   └── page.tsx                  → Landing page
│       Components:
│       - HeroSection (score animation, CTA)
│       - CountersSection (total reports, users, avg score)
│       - HowItWorksSection (3 steps)
│       - TestimonialsSection
│       - FAQSection
│       - Footer
│
├── (auth)/
│   └── login/page.tsx            → Login with Google button
│
├── (app)/
│   ├── dashboard/page.tsx        → Report history list
│   │   Components:
│   │   - ReportCard (score badge, date, recommendation)
│   │   - UsageMeter (X/10 used this month)
│   │
│   ├── analyze/page.tsx          → Upload form
│   │   Components:
│   │   - CVUploader (drag-drop PDF/DOCX)
│   │   - JDInput (textarea + file upload)
│   │   - AnalyzeButton
│   │   - ProgressIndicator
│   │
│   └── report/[id]/page.tsx      → Full report view
│       Components:
│       - ReportHeader (recommendation badge)
│       - ScoreHero (circular progress + strategy)
│       - RadarChart (recharts)
│       - MetricsGrid (10 criteria cards)
│       - GapMapSection (table + filters)
│       - OptimizationLab (coach cards + rewrite boxes)
│       - ATSKeywords (tags)
│       - ChecklistSection (auto-save)
│
├── admin/
│   ├── page.tsx                  → Stats dashboard
│   ├── faq/page.tsx              → FAQ CRUD
│   └── testimonials/page.tsx    → Testimonials CRUD
│
└── api/
    ├── upload/route.ts
    ├── report/
    │   ├── create/route.ts
    │   └── [id]/route.ts
    ├── reports/route.ts
    ├── checklist/toggle/route.ts
    └── admin/
        ├── stats/route.ts
        ├── faq/route.ts
        └── testimonials/route.ts
```

---

## B6 — Milestones

### Milestone 1 — Setup + Auth + Landing + i18n
**Mục tiêu**: App chạy được, login Google, landing page đẹp, toggle VI/EN
- [ ] Next.js 14 + TypeScript + Tailwind setup
- [ ] Supabase project config + env vars
- [ ] Prisma schema + migration
- [ ] NextAuth.js với Google provider + Supabase adapter
- [ ] Landing page (Hero, Counters, HowItWorks, FAQ, Testimonials)
- [ ] i18n context (VI/EN toggle)
- [ ] Layout + Navigation + Footer
- [ ] Middleware auth protection
**Nghiệm thu**: Deploy local, đăng nhập Google thành công, landing hiển thị đúng VI/EN

### Milestone 2 — Upload + Text Extraction
**Mục tiêu**: Upload CV/JD → extract text → hash → lưu DB
- [ ] Supabase Storage bucket setup (private)
- [ ] POST /api/upload (validate size, type, store)
- [ ] pdf-parse integration (PDF extraction)
- [ ] mammoth integration (DOCX extraction)
- [ ] PII masking (email, phone, address)
- [ ] sha256 hashing
- [ ] Upload UI (drag-drop, progress bar)
- [ ] JD textarea + file upload
**Nghiệm thu**: Upload PDF → text extracted → hash stored → file in Supabase Storage

### Milestone 3 — CV Analysis Engine (Core)
**Mục tiêu**: Build engine rule-based, output report JSON
- [ ] Section Detector (CV sections VI/EN)
- [ ] JD Parser (role, seniority, requirements, keywords)
- [ ] RAKE-light keyword extractor
- [ ] Scorer (10 criteria, weighted)
- [ ] Advice Generator (template-based)
- [ ] Cache layer (hash lookup)
- [ ] POST /api/report/create
**Nghiệm thu**: Input CV+JD text → output valid report JSON với score + recommendations

### Milestone 4 — Gap Map Engine + Report API
**Mục tiêu**: JD Fit Gap Map hoàn chỉnh, report saved to DB
- [ ] Gap Map engine (FOUND/PARTIAL/MISSING logic)
- [ ] Fuzzy match + synonym list (VI/EN)
- [ ] Rewrite template generator
- [ ] Save report + metrics + gap_map + checklist to DB
- [ ] GET /api/report/:id
- [ ] Usage limit enforcement (10/month)
**Nghiệm thu**: Report đầy đủ lưu DB, limit đếm đúng

### Milestone 5 — Report UI (Full)
**Mục tiêu**: Trang report đẹp, đầy đủ sections
- [ ] ScoreHero với circular progress animation
- [ ] RadarChart (recharts)
- [ ] MetricsGrid (10 cards expandable)
- [ ] GapMapSection (table + filter tabs + status chips)
- [ ] OptimizationLab (coach + rewrite boxes)
- [ ] ATSKeywords section
- [ ] ChecklistSection (autosave toggle)
- [ ] Dashboard (report history + usage meter)
**Nghiệm thu**: Report hiển thị đẹp, checklist autosave, radar đúng data

### Milestone 6 — Admin + Polish + Deploy
**Mục tiêu**: Admin panel, auto-delete, seed data, deploy production
- [ ] Admin middleware (whitelist email)
- [ ] Admin stats dashboard
- [ ] Admin FAQ CRUD UI
- [ ] Admin Testimonials CRUD UI
- [ ] Cron/Edge Function auto-delete files 90 ngày
- [ ] Landing counters live data
- [ ] Seed FAQ + Testimonials
- [ ] RLS policies Supabase
- [ ] Vercel deploy config
- [ ] ENV vars production
- [ ] Final QA
**Nghiệm thu**: Deploy production, admin login, FAQ/testimonials quản lý được

---

## Report JSON Schema

```typescript
interface Report {
  id: string;
  overall: {
    score: number;           // 0-100
    label: string;           // 'Rất phù hợp' | 'Khá phù hợp' | ...
    recommendation: 'apply' | 'consider' | 'not_fit';
    recommendation_label: { vi: string; en: string };
  };
  radar: Array<{
    key: string;
    label_vi: string;
    label_en: string;
    score: number;
    weight: number;
  }>;
  strategy: {
    insight_vi: string;
    insight_en: string;
    positioning_vi: string;
    positioning_en: string;
    key_moves: Array<{ vi: string; en: string }>;
  };
  gap_map: Array<{
    id: string;
    group: 'must_have' | 'responsibilities' | 'tools';
    requirement: string;
    priority: 'high' | 'med' | 'low';
    status: 'FOUND' | 'PARTIAL' | 'MISSING';
    evidence_snippet?: string;
    gap_reason?: string;
    suggested_section: string;
    rewrite_templates: Array<{ vi: string; en: string }>;
  }>;
  metrics_detail: Array<{
    key: string;
    label_vi: string;
    label_en: string;
    score: number;
    weight: number;
    findings: Array<{ vi: string; en: string }>;
    why_it_matters: { vi: string; en: string };
    advice: Array<{ vi: string; en: string }>;
    actions: Array<{ vi: string; en: string }>;
    rewrite_examples: Array<{
      old_snippet: string;
      new_vi: string;
      new_en: string;
    }>;
  }>;
  ats_keywords: {
    missing: string[];
    suggested_insertions: Array<{
      keyword: string;
      section: string;
      context_vi: string;
    }>;
  };
  checklist: Array<{
    id: string;
    item_key: string;
    label_vi: string;
    label_en: string;
    is_done: boolean;
  }>;
}
```
