"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { createSupabaseBrowser } from "@/lib/supabase";
import Link from "next/link";

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("daily_count, plan, pro_expires_at").eq("id", user.id).single();
      if (data) {
        const proActive = data.plan === "pro" && data.pro_expires_at && new Date(data.pro_expires_at) > new Date();
        setIsPro(proActive);
        if (!proActive) setRemainingToday(Math.max(0, 5 - (data.daily_count || 0)));
      }
    });
  }, []);

  const handleFile = (f: File) => {
    const ext = f.name.toLowerCase().split(".").pop();
    if (!["pdf", "docx", "doc"].includes(ext ?? "")) {
      setError("Chỉ hỗ trợ file PDF và DOCX."); return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File không được vượt quá 5MB."); return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async () => {
    if (!file || jd.trim().length < 50) {
      setError("Vui lòng chọn CV và nhập Job Description (tối thiểu 50 ký tự)."); return;
    }
    setState("uploading"); setError(""); setProgress(10);

    try {
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("jd", jd);

      setProgress(30); setState("analyzing");

      // Animate progress
      const interval = setInterval(() => {
        setProgress(p => p < 85 ? p + (Math.random() * 8) : p);
      }, 800);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      if (!res.ok) {
        if (data.authRequired) { router.push("/auth?next=/analyze"); return; }
        setError(data.error ?? "Đã xảy ra lỗi."); setState("error"); return;
      }

      setState("done");
      if (data.remainingToday !== null) setRemainingToday(data.remainingToday);

      setTimeout(() => router.push(`/dashboard?id=${data.analysisId}`), 800);
    } catch (err) {
      setError("Không thể kết nối. Vui lòng thử lại."); setState("error");
    }
  };

  const isLoading = state === "uploading" || state === "analyzing";

  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Phân tích CV</span>
            <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
          </div>
          <h1 className="font-display mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#E8E0D5" }}>
            Upload CV & Job Description
          </h1>
          <p style={{ color: "rgba(232,224,213,0.4)", fontSize: "0.9rem" }}>
            AI sẽ phân tích và trả về kết quả chi tiết trong ~30 giây
          </p>

          {/* Usage indicator */}
          {remainingToday !== null && !isPro && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2"
              style={{ border: "1px solid rgba(201,169,110,0.15)", background: "rgba(201,169,110,0.04)" }}>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{ background: i < (5 - remainingToday) ? "rgba(201,169,110,0.2)" : "#C9A96E" }} />
                ))}
              </div>
              <span className="text-xs" style={{ color: "rgba(232,224,213,0.4)" }}>
                {remainingToday === 0 ? "Hết lượt hôm nay" : `Còn ${remainingToday} lượt miễn phí hôm nay`}
              </span>
              {remainingToday === 0 && (
                <Link href="/pricing" className="text-xs underline" style={{ color: "#C9A96E" }}>→ Nâng cấp</Link>
              )}
            </div>
          )}
          {isPro && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2"
              style={{ border: "1px solid rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>
              <span className="text-xs" style={{ color: "#C9A96E" }}>✦ Pro — Phân tích không giới hạn</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CV Upload */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#C9A96E" }}>
              01 — CV của bạn
            </label>
            <div
              className={`upload-zone p-8 text-center min-h-[200px] flex flex-col items-center justify-center ${dragOver ? "drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {file ? (
                <>
                  <div className="mb-3 text-3xl">📄</div>
                  <div className="font-medium mb-1" style={{ color: "#E8E0D5", fontSize: "0.9rem" }}>{file.name}</div>
                  <div className="text-xs mb-4" style={{ color: "rgba(232,224,213,0.3)" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <button className="text-xs tracking-wider uppercase px-4 py-1.5 transition-colors duration-300"
                    style={{ border: "1px solid rgba(201,169,110,0.2)", color: "rgba(201,169,110,0.6)" }}
                    onClick={e => { e.stopPropagation(); setFile(null); }}>
                    Đổi file
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 text-4xl" style={{ opacity: 0.3 }}>↑</div>
                  <div className="mb-2" style={{ color: "rgba(232,224,213,0.5)", fontSize: "0.9rem" }}>
                    Kéo thả hoặc click để chọn
                  </div>
                  <div className="text-xs" style={{ color: "rgba(232,224,213,0.25)" }}>PDF · DOCX · Tối đa 5MB</div>
                </>
              )}
            </div>
          </div>

          {/* JD Input */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#C9A96E" }}>
              02 — Job Description
            </label>
            <textarea
              className="input-dark min-h-[200px]"
              placeholder="Dán toàn bộ Job Description từ LinkedIn, TopCV, ITviec...&#10;&#10;Bao gồm: vị trí, yêu cầu, trách nhiệm, kỹ năng cần có..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              disabled={isLoading}
            />
            <div className="mt-2 flex justify-between text-xs" style={{ color: "rgba(232,224,213,0.25)" }}>
              <span>Tối thiểu 50 ký tự</span>
              <span>{jd.length} ký tự</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 px-4 py-3 text-sm flex items-center gap-3"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Progress */}
        {isLoading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs tracking-wider" style={{ color: "rgba(232,224,213,0.4)" }}>
                {state === "uploading" ? "Đang xử lý file..." : "AI đang phân tích..."}
              </span>
              <span className="text-xs" style={{ color: "#C9A96E" }}>{Math.round(progress)}%</span>
            </div>
            <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(to right, #C9A96E, #E8C98A)" }} />
            </div>
            <div className="mt-3 text-xs text-center" style={{ color: "rgba(232,224,213,0.3)" }}>
              {state === "analyzing" && "Claude AI đang đọc CV và JD, tính toán độ phù hợp..."}
            </div>
          </div>
        )}

        {state === "done" && (
          <div className="mt-6 px-4 py-3 text-sm text-center"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80" }}>
            ✓ Phân tích hoàn thành! Đang chuyển đến kết quả...
          </div>
        )}

        {/* Submit */}
        {remainingToday === 0 && !isPro ? (
          <div className="mt-8 text-center">
            <p className="text-sm mb-4" style={{ color: "rgba(232,224,213,0.4)" }}>Bạn đã hết lượt miễn phí hôm nay.</p>
            <Link href="/pricing" className="btn-gold">
              <span>Nâng cấp Pro — 20.000đ/tháng</span>
            </Link>
          </div>
        ) : (
          <button onClick={handleSubmit} disabled={isLoading || !file || jd.trim().length < 50}
            className="btn-gold mt-8 w-full" style={{ padding: "1.1rem", fontSize: "0.85rem" }}>
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#0A0A0A", borderTopColor: "transparent" }} />
                  {state === "uploading" ? "Đang xử lý..." : "AI đang phân tích..."}
                </span>
              ) : "✦ Phân Tích CV Ngay"}
            </span>
          </button>
        )}

        <p className="mt-4 text-center text-xs" style={{ color: "rgba(232,224,213,0.2)" }}>
          File của bạn được xử lý an toàn và không chia sẻ với bên thứ ba
        </p>
      </div>
    </main>
  );
}
