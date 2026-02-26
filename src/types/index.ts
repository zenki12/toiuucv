export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro";
  pro_expires_at: string | null;
  daily_count: number;
  daily_reset_at: string;
  total_analyses: number;
  created_at: string;
}

// ── Metric (1 trong 10 chỉ số) ───────────────────────────────────────
export interface Metric {
  score: number;       // 0–100
  label: string;       // tên ngắn gọn
  weight: number;      // trọng số (%)
  note: string;        // nhận xét chi tiết
}

// ── Rewrite example (Before / After) ────────────────────────────────
export interface RewriteExample {
  original: string;
  improved: string;
  explanation: string;
}

// ── Improvement item ─────────────────────────────────────────────────
export interface Improvement {
  category: string;
  currentScore: number;
  priority: "high" | "medium" | "low";
  issue: string;
  strategicAdvice: string;
  actionSteps: string[];
  rewrites?: RewriteExample[];
}

// ── Full analysis result (matches ZIP structure) ─────────────────────
export interface Analysis {
  id: string;
  user_id: string;
  cv_filename: string;
  cv_text: string;
  jd_text: string;
  job_title: string | null;
  company_name: string | null;
  created_at: string;

  // Scores
  overall_score: number;
  verdict: string;
  summary: string;

  // Application recommendation
  app_recommendation: {
    status: "Khuyến khích" | "Cần cân nhắc" | "Rất tiềm năng" | "Chưa phù hợp";
    reasoning: string;
  };

  // Layout analysis
  layout_analysis: {
    score: number;
    feedback: string;
    tips: string[];
  };

  // 10 metrics
  metrics: {
    jobRelevance: Metric;
    summaryEffectiveness: Metric;
    experienceDepth: Metric;
    achievementImpact: Metric;
    technicalSkills: Metric;
    softSkills: Metric;
    additionalSkills: Metric;
    languageQuality: Metric;
    brandingPersonality: Metric;
    structureProfessionalism: Metric;
  };

  // Strategic recommendation
  recommendation: {
    strategicMove: string;
    interviewTip: string;
    optimizationPriority: string;
  };

  // Lists
  strengths: string[];
  weaknesses: string[];
  matched_skills: string[];
  missing_skills: string[];
  improvements: Improvement[];
}

export interface Payment {
  id: string;
  user_id: string;
  order_code: number;
  payos_payment_link_id: string | null;
  amount: number;
  status: "pending" | "paid" | "cancelled" | "expired";
  plan: string;
  plan_duration_days: number;
  paid_at: string | null;
  created_at: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysisId?: string;
  error?: string;
  limitReached?: boolean;
  remainingToday?: number;
}

export interface PaymentCreateResponse {
  success: boolean;
  checkoutUrl?: string;
  orderCode?: number;
  error?: string;
}

export type PlanInfo = {
  name: string;
  price: number;
  priceDisplay: string;
  dailyLimit: number | "unlimited";
  features: string[];
};
