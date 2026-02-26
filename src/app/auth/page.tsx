"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import Link from "next/link";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createSupabaseBrowser();

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
              style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>F</div>
            <span className="font-display text-2xl" style={{ fontWeight: 500, color: "#E8E0D5" }}>FitYourCV</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "#C9A96E" }}>Đăng nhập</span>
            <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
          </div>
          <h1 className="font-display text-3xl mb-3" style={{ fontWeight: 300, color: "#E8E0D5" }}>
            Chào Mừng Trở Lại
          </h1>
          <p className="text-sm" style={{ color: "rgba(232,224,213,0.4)" }}>
            Đăng nhập để lưu lịch sử và truy cập đầy đủ tính năng
          </p>
        </div>

        {/* Card */}
        <div className="p-8 lg:p-10" style={{ border: "1px solid rgba(201,169,110,0.15)", background: "#111111" }}>
          {error && (
            <div className="mb-6 px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}>
              {error}
            </div>
          )}

          <button onClick={signInWithGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 transition-all duration-300"
            style={{
              border: "1px solid rgba(201,169,110,0.2)", background: "transparent",
              color: "#E8E0D5", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => !loading && ((e.currentTarget as any).style.borderColor = "#C9A96E")}
            onMouseLeave={e => ((e.currentTarget as any).style.borderColor = "rgba(201,169,110,0.2)")}>
            {loading ? (
              <div className="w-5 h-5 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="text-sm tracking-wider">
              {loading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
            </span>
          </button>

          <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}>
            <p className="text-xs text-center leading-relaxed" style={{ color: "rgba(232,224,213,0.3)" }}>
              Bằng cách đăng nhập, bạn đồng ý với{" "}
              <Link href="#" className="underline" style={{ color: "rgba(201,169,110,0.5)" }}>Điều khoản sử dụng</Link>{" "}
              và{" "}
              <Link href="#" className="underline" style={{ color: "rgba(201,169,110,0.5)" }}>Chính sách bảo mật</Link>.
            </p>
          </div>
        </div>

        {/* Free tier note */}
        <div className="mt-6 p-4 text-center" style={{ border: "1px solid rgba(201,169,110,0.08)", background: "rgba(201,169,110,0.03)" }}>
          <p className="text-xs" style={{ color: "rgba(232,224,213,0.3)" }}>
            ✦ Miễn phí 5 lượt phân tích mỗi ngày sau khi đăng nhập
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ color: "rgba(232,224,213,0.3)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.3)")}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
