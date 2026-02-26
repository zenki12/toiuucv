"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ScoreRing from "@/components/ui/ScoreRing";
import { createSupabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import type { Analysis, Profile, Metric, Improvement } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// ── Colour helpers ────────────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return "#4ADE80";
  if (s >= 60) return "#C9A96E";
  if (s >= 40) return "#FBBF24";
  return "#F87171";
}
function recoBadge(status: string) {
  const map: Record<string, { bg: string; color: string; icon: string }> = {
    "Khuyến khích":  { bg: "rgba(74,222,128,0.1)",   color: "#4ADE80", icon: "✦" },
    "Rất tiềm năng": { bg: "rgba(201,169,110,0.1)",  color: "#C9A96E", icon: "◆" },
    "Cần cân nhắc":  { bg: "rgba(251,191,36,0.1)",   color: "#FBBF24", icon: "⚠" },
    "Chưa phù hợp":  { bg: "rgba(248,113,113,0.1)",  color: "#F87171", icon: "✕" },
  };
  return map[status] ?? map["Cần cân nhắc"];
}
function priorityColor(p: string) {
  return p === "high" ? "#F87171" : p === "medium" ? "#FBBF24" : "#86EFAC";
}
function priorityLabel(p: string) {
  return p === "high" ? "Quan trọng" : p === "medium" ? "Trung bình" : "Nhỏ";
}

// ── Mini progress bar ─────────────────────────────────────────────────
function ProgressBar({ score, label, weight, note }: Metric) {
  const color = scoreColor(score);
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "rgba(232,224,213,0.55)" }}>{label}</span>
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "rgba(232,224,213,0.3)" }}>· {weight}%</span>
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }} />
      </div>
      {note && (
        <p className="mt-1 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "rgba(232,224,213,0.35)" }}>
          {note}
        </p>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",      label: "Tổng quan" },
  { id: "metrics",       label: "10 Chỉ số" },
  { id: "skills",        label: "Kỹ năng" },
  { id: "improvements",  label: "Cải thiện" },
  { id: "layout",        label: "Bố cục" },
  { id: "strategy",      label: "Chiến lược" },
];

// ── Analysis detail component ─────────────────────────────────────────
function AnalysisDetail({ analysis }: { analysis: Analysis }) {
  const [tab, setTab] = useState("overview");
  const reco = recoBadge(analysis.app_recommendation?.status ?? "");

  return (
    <div className="animate-fade-in">

      {/* ── HERO CARD ── */}
      <div className="p-6 lg:p-8 mb-4" style={{ border: "1px solid rgba(201,169,110,0.18)", background: "#111111" }}>
        <div className="flex flex-wrap items-start gap-6">

          {/* Score ring */}
          <ScoreRing score={analysis.overall_score} size={120} label="Điểm tổng" />

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <div className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(201,169,110,0.5)" }}>
              {analysis.company_name || "Công ty"}
            </div>
            <h2 className="font-display text-2xl lg:text-3xl mb-2" style={{ fontWeight: 400, color: "#E8E0D5" }}>
              {analysis.job_title || "Phân tích CV"}
            </h2>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(232,224,213,0.5)", maxWidth: "480px" }}>
              {analysis.verdict}
            </p>

            {/* App recommendation badge */}
            {analysis.app_recommendation?.status && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
                style={{ background: reco.bg, border: `1px solid ${reco.color}33`, color: reco.color }}>
                <span>{reco.icon}</span>
                <span>{analysis.app_recommendation.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {analysis.summary && (
          <p className="mt-5 pt-5 text-sm leading-relaxed"
            style={{ borderTop: "1px solid rgba(201,169,110,0.08)", color: "rgba(232,224,213,0.45)" }}>
            {analysis.summary}
          </p>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-0 mb-4 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-3 text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200"
            style={{
              color: tab === t.id ? "#C9A96E" : "rgba(232,224,213,0.3)",
              borderBottom: tab === t.id ? "2px solid #C9A96E" : "2px solid transparent",
              marginBottom: "-1px",
              flexShrink: 0,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6" style={{ border: "1px solid rgba(74,222,128,0.15)", background: "rgba(74,222,128,0.02)" }}>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#4ADE80" }}>✓ Điểm mạnh</div>
            <ul className="space-y-3">
              {(analysis.strengths ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(232,224,213,0.65)" }}>
                  <span className="shrink-0 mt-0.5" style={{ color: "#4ADE80" }}>◆</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6" style={{ border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.02)" }}>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#F87171" }}>⚠ Cần cải thiện</div>
            <ul className="space-y-3">
              {(analysis.weaknesses ?? []).map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(232,224,213,0.65)" }}>
                  <span className="shrink-0 mt-0.5" style={{ color: "#F87171" }}>◆</span>{w}
                </li>
              ))}
            </ul>
          </div>

          {/* App recommendation reasoning */}
          {analysis.app_recommendation?.reasoning && (
            <div className="md:col-span-2 p-5"
              style={{ border: `1px solid ${reco.color}22`, background: `${reco.bg}` }}>
              <div className="text-xs tracking-widest uppercase mb-2" style={{ color: reco.color }}>
                {reco.icon} Đánh giá ứng tuyển — {analysis.app_recommendation.status}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.6)" }}>
                {analysis.app_recommendation.reasoning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: 10 METRICS ── */}
      {tab === "metrics" && (
        <div className="grid md:grid-cols-2 gap-3">
          {analysis.metrics && Object.values(analysis.metrics).map((m: any, i) => (
            <div key={i} className="p-5"
              style={{ border: "1px solid rgba(201,169,110,0.1)", background: "#111111" }}>
              <ProgressBar {...m} />
              {m.note && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(232,224,213,0.35)" }}>
                  {m.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: SKILLS ── */}
      {tab === "skills" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6" style={{ border: "1px solid rgba(201,169,110,0.12)", background: "#111111" }}>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#4ADE80" }}>
              ✓ Kỹ năng khớp JD ({(analysis.matched_skills ?? []).length})
            </div>
            <div className="flex flex-wrap gap-2">
              {(analysis.matched_skills ?? []).map(k => (
                <span key={k} className="px-3 py-1 text-xs"
                  style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80" }}>
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="p-6" style={{ border: "1px solid rgba(201,169,110,0.12)", background: "#111111" }}>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#F87171" }}>
              ✕ Kỹ năng còn thiếu ({(analysis.missing_skills ?? []).length})
            </div>
            <div className="flex flex-wrap gap-2">
              {(analysis.missing_skills ?? []).map(k => (
                <span key={k} className="px-3 py-1 text-xs"
                  style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: IMPROVEMENTS ── */}
      {tab === "improvements" && (
        <div className="space-y-4">
          {(analysis.improvements ?? []).map((imp: Improvement, i) => {
            const pColor = priorityColor(imp.priority);
            return (
              <div key={i} className="p-5 lg:p-6"
                style={{ border: "1px solid rgba(201,169,110,0.1)", background: "#111111" }}>

                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs px-2 py-0.5"
                    style={{ border: `1px solid ${pColor}44`, color: pColor, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.65rem" }}>
                    {priorityLabel(imp.priority)}
                  </span>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
                    {imp.category}
                  </span>
                  <span className="ml-auto text-xs tabular-nums" style={{ color: scoreColor(imp.currentScore) }}>
                    Hiện tại: {imp.currentScore}/100
                  </span>
                </div>

                {/* Issue */}
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "rgba(232,224,213,0.65)" }}>
                  <strong style={{ color: "#E8E0D5" }}>Vấn đề: </strong>{imp.issue}
                </p>

                {/* Strategic advice */}
                <div className="px-4 py-3 mb-4 text-sm leading-relaxed"
                  style={{ background: "rgba(201,169,110,0.04)", borderLeft: "2px solid rgba(201,169,110,0.3)", color: "rgba(232,224,213,0.55)" }}>
                  💡 {imp.strategicAdvice}
                </div>

                {/* Action steps */}
                {imp.actionSteps?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(201,169,110,0.4)" }}>
                      Các bước thực hiện
                    </div>
                    <ul className="space-y-1.5">
                      {imp.actionSteps.map((step, si) => (
                        <li key={si} className="flex items-start gap-2 text-sm" style={{ color: "rgba(232,224,213,0.5)" }}>
                          <span className="shrink-0 mt-0.5 text-xs" style={{ color: "rgba(201,169,110,0.4)" }}>{si + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rewrites */}
                {imp.rewrites?.length > 0 && (
                  <div>
                    <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(201,169,110,0.4)" }}>
                      Before / After
                    </div>
                    <div className="space-y-3">
                      {imp.rewrites.map((rw, ri) => (
                        <div key={ri}>
                          <div className="grid md:grid-cols-2 gap-2 mb-1.5">
                            <div>
                              <div className="text-xs mb-1" style={{ color: "rgba(248,113,113,0.5)", letterSpacing: "0.1em" }}>TRƯỚC</div>
                              <div className="p-3 text-sm leading-relaxed"
                                style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.12)", color: "rgba(232,224,213,0.45)" }}>
                                {rw.original}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs mb-1" style={{ color: "rgba(74,222,128,0.5)", letterSpacing: "0.1em" }}>SAU</div>
                              <div className="p-3 text-sm leading-relaxed"
                                style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", color: "rgba(232,224,213,0.7)" }}>
                                {rw.improved}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs" style={{ color: "rgba(232,224,213,0.3)" }}>
                            💡 {rw.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: LAYOUT ── */}
      {tab === "layout" && analysis.layout_analysis && (
        <div className="space-y-4">
          <div className="p-6" style={{ border: "1px solid rgba(201,169,110,0.12)", background: "#111111" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs tracking-widest uppercase" style={{ color: "#C9A96E" }}>Điểm bố cục</div>
              <span className="font-display text-3xl" style={{ fontWeight: 300, color: scoreColor(analysis.layout_analysis.score) }}>
                {analysis.layout_analysis.score}
              </span>
            </div>
            {/* Progress */}
            <div className="h-1 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${analysis.layout_analysis.score}%`, background: scoreColor(analysis.layout_analysis.score), transition: "width 0.7s" }} />
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(232,224,213,0.55)" }}>
              {analysis.layout_analysis.feedback}
            </p>
            {analysis.layout_analysis.tips?.length > 0 && (
              <>
                <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(201,169,110,0.4)" }}>
                  Gợi ý cải thiện bố cục
                </div>
                <ul className="space-y-2">
                  {analysis.layout_analysis.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(232,224,213,0.55)" }}>
                      <span className="shrink-0 mt-0.5" style={{ color: "#C9A96E" }}>→</span>{tip}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: STRATEGY ── */}
      {tab === "strategy" && analysis.recommendation && (
        <div className="space-y-4">
          {[
            {
              icon: "◎",
              label: "Bước đi chiến lược",
              color: "#C9A96E",
              value: analysis.recommendation.strategicMove,
            },
            {
              icon: "◆",
              label: "Tip phỏng vấn",
              color: "#86EFAC",
              value: analysis.recommendation.interviewTip,
            },
            {
              icon: "↑",
              label: "Ưu tiên tối ưu số 1",
              color: "#F87171",
              value: analysis.recommendation.optimizationPriority,
            },
          ].map(item => (
            <div key={item.label} className="p-6"
              style={{ border: `1px solid ${item.color}22`, background: "#111111" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl" style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs tracking-widest uppercase" style={{ color: item.color }}>
                  {item.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.65)" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main dashboard page ────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createSupabaseBrowser();
  const analysisId = searchParams.get("id");
  const status = searchParams.get("status");

  useEffect(() => { if (status === "success") setShowSuccess(true); }, [status]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth?next=/dashboard"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data as Profile);
    });
  }, []);

  const loadHistory = useCallback(async () => {
    const res = await fetch("/api/history");
    if (!res.ok) return;
    const data = await res.json();
    setAnalyses(data.analyses ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    if (!analysisId) return;
    setDetailLoading(true);
    fetch(`/api/history?id=${analysisId}`)
      .then(r => r.json())
      .then(d => { if (d.analysis) setSelected(d.analysis); })
      .finally(() => setDetailLoading(false));
  }, [analysisId]);

  const selectAnalysis = (id: string) => {
    router.push(`/dashboard?id=${id}`, { scroll: false });
    setDetailLoading(true);
    fetch(`/api/history?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.analysis) setSelected(d.analysis); })
      .finally(() => setDetailLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa kết quả phân tích này?")) return;
    await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    loadHistory();
  };

  const isPro = profile?.plan === "pro" && profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date();

  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16">

        {showSuccess && (
          <div className="mb-6 px-4 py-3 flex items-center gap-3 text-sm"
            style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.25)", color: "#C9A96E" }}>
            ✓ Thanh toán thành công! Tài khoản Pro đã được kích hoạt.
            <button onClick={() => setShowSuccess(false)} className="ml-auto opacity-50 text-xs">✕</button>
          </div>
        )}

        {/* Profile bar */}
        {profile && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6"
            style={{ borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
            <div>
              <h1 className="font-display text-2xl mb-1" style={{ fontWeight: 300, color: "#E8E0D5" }}>Dashboard</h1>
              <p className="text-sm" style={{ color: "rgba(232,224,213,0.4)" }}>
                {profile.email} ·{" "}
                {isPro
                  ? <span style={{ color: "#C9A96E" }}>✦ Pro — Không giới hạn</span>
                  : <span>Free — còn {Math.max(0, 5 - (profile.daily_count || 0))} lượt hôm nay</span>}
              </p>
            </div>
            <div className="flex gap-3">
              {!isPro && (
                <Link href="/pricing" className="btn-gold" style={{ padding: "0.55rem 1.2rem", fontSize: "0.75rem" }}>
                  <span>Nâng cấp Pro</span>
                </Link>
              )}
              <Link href="/analyze" className="btn-ghost" style={{ padding: "0.55rem 1.2rem", fontSize: "0.75rem" }}>
                + Phân tích mới
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* History sidebar */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#C9A96E" }}>
              Lịch sử ({analyses.length})
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}
              </div>
            ) : analyses.length === 0 ? (
              <div className="p-8 text-center" style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
                <p className="text-sm mb-4" style={{ color: "rgba(232,224,213,0.3)" }}>Chưa có phân tích nào</p>
                <Link href="/analyze" className="btn-gold" style={{ padding: "0.55rem 1.2rem", fontSize: "0.75rem" }}>
                  <span>Phân tích ngay</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {analyses.map((a: any) => {
                  const isActive = selected?.id === a.id;
                  return (
                    <div key={a.id} onClick={() => selectAnalysis(a.id)}
                      className="p-4 cursor-pointer transition-all duration-200 group relative"
                      style={{
                        background: isActive ? "#1A1A1A" : "#111111",
                        border: isActive ? "1px solid rgba(201,169,110,0.35)" : "1px solid rgba(201,169,110,0.07)",
                        borderLeft: isActive ? "2px solid #C9A96E" : "2px solid transparent",
                      }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate mb-0.5" style={{ color: "#E8E0D5" }}>
                            {a.job_title || a.cv_filename}
                          </div>
                          {a.company_name && (
                            <div className="text-xs truncate mb-1" style={{ color: "rgba(201,169,110,0.6)" }}>
                              {a.company_name}
                            </div>
                          )}
                          <div className="text-xs" style={{ color: "rgba(232,224,213,0.2)" }}>
                            {formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: vi })}
                          </div>
                        </div>
                        {/* Mini score */}
                        <div className="shrink-0 text-center">
                          <div className="font-display text-xl" style={{ fontWeight: 300, color: scoreColor(a.overall_score), lineHeight: 1 }}>
                            {a.overall_score}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(232,224,213,0.2)" }}>/100</div>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleDelete(a.id); }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1"
                        style={{ color: "rgba(248,113,113,0.5)" }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {detailLoading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="skeleton h-24" />)}
              </div>
            ) : selected ? (
              <AnalysisDetail analysis={selected} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px]"
                style={{ border: "1px solid rgba(201,169,110,0.07)" }}>
                <div className="font-display text-6xl mb-4" style={{ color: "rgba(201,169,110,0.08)", lineHeight: 1 }}>◎</div>
                <p className="text-sm" style={{ color: "rgba(232,224,213,0.2)" }}>
                  Chọn một phân tích từ danh sách bên trái
                </p>
                <Link href="/analyze" className="mt-6 btn-ghost" style={{ padding: "0.6rem 1.4rem", fontSize: "0.75rem" }}>
                  + Tạo phân tích mới
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
