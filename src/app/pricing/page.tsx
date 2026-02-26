"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase";

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const cancelled = searchParams.get("status") === "cancelled";
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data } = await supabase.from("profiles").select("plan, pro_expires_at").eq("id", user.id).single();
        setProfile(data);
      }
    });
  }, []);

  const handleUpgrade = async () => {
    if (!user) { window.location.href = "/auth?next=/pricing"; return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/payment/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message || "Không thể tạo thanh toán. Thử lại sau.");
      setLoading(false);
    }
  };

  const isPro = profile?.plan === "pro" && profile?.pro_expires_at && new Date(profile.pro_expires_at) > new Date();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0đ",
      period: "mãi mãi",
      description: "Bắt đầu tối ưu CV ngay hôm nay",
      features: [
        "5 lượt phân tích mỗi ngày",
        "Điểm ATS & Keyword Match",
        "Gợi ý cải thiện cơ bản",
        "Lưu lịch sử 30 ngày",
      ],
      cta: "Bắt đầu miễn phí",
      href: "/analyze",
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "20.000đ",
      period: "30 ngày",
      description: "Không giới hạn phân tích, đầy đủ tính năng",
      features: [
        "Phân tích không giới hạn",
        "Điểm ATS chi tiết",
        "Keyword Match đầy đủ",
        "Gợi ý viết lại từng câu",
        "Lưu lịch sử vĩnh viễn",
        "Ưu tiên xử lý nhanh",
      ],
      cta: isPro ? "Đang dùng Pro ✓" : "Nâng cấp Pro",
      highlight: true,
    },
  ];

  return (
    <main style={{ background: "#0A0A0A" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        {cancelled && (
          <div className="mb-8 px-4 py-3 text-sm" style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", color: "rgba(201,169,110,0.7)" }}>
            Thanh toán đã bị hủy. Bạn có thể thử lại bất kỳ lúc nào.
          </div>
        )}

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Bảng giá</span>
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
          </div>
          <h1 className="font-display mb-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 300, color: "#E8E0D5", lineHeight: 1.1 }}>
            Đơn Giản &{" "}
            <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Minh Bạch</em>
          </h1>
          <p style={{ color: "rgba(232,224,213,0.45)" }}>Không ẩn phí. Không tự gia hạn. Thanh toán 1 lần.</p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}>
            ⚠ {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map(plan => (
            <div key={plan.id} className="relative p-8 lg:p-10 flex flex-col"
              style={{
                border: plan.highlight ? "1px solid rgba(201,169,110,0.4)" : "1px solid rgba(201,169,110,0.1)",
                background: plan.highlight ? "#111111" : "#0D0D0D",
              }}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs tracking-widest uppercase"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>
                  Phổ biến nhất
                </div>
              )}

              <div className="mb-8">
                <div className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: plan.highlight ? "#C9A96E" : "rgba(232,224,213,0.35)" }}>
                  {plan.name}
                </div>
                <div className="font-display flex items-baseline gap-2 mb-2">
                  <span style={{ fontSize: "3rem", fontWeight: 300, color: "#E8E0D5", lineHeight: 1 }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: "rgba(232,224,213,0.3)" }}>/ {plan.period}</span>
                </div>
                <p className="text-sm" style={{ color: "rgba(232,224,213,0.4)" }}>{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(232,224,213,0.6)" }}>
                    <span style={{ color: plan.highlight ? "#C9A96E" : "rgba(232,224,213,0.3)" }}>◆</span> {f}
                  </li>
                ))}
              </ul>

              {plan.id === "pro" ? (
                <button onClick={handleUpgrade} disabled={loading || isPro}
                  className="btn-gold w-full" style={{ padding: "0.9rem" }}>
                  <span>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#0A0A0A", borderTopColor: "transparent" }} />
                        Đang xử lý...
                      </span>
                    ) : plan.cta}
                  </span>
                </button>
              ) : (
                <Link href={plan.href} className="btn-ghost w-full" style={{ padding: "0.9rem" }}>
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Payment method info */}
        <div className="mt-12 p-6 max-w-3xl mx-auto text-center"
          style={{ border: "1px solid rgba(201,169,110,0.08)", background: "rgba(201,169,110,0.02)" }}>
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(201,169,110,0.4)" }}>Phương thức thanh toán</div>
          <p className="text-sm mb-2" style={{ color: "rgba(232,224,213,0.4)" }}>
            Thanh toán qua <strong style={{ color: "#E8E0D5" }}>PayOS</strong> — Hỗ trợ chuyển khoản QR, VNPAY, MoMo, ZaloPay và thẻ ATM nội địa.
          </p>
          <p className="text-xs" style={{ color: "rgba(232,224,213,0.25)" }}>
            Không lưu thông tin thẻ. Không tự gia hạn. Kích hoạt ngay sau khi thanh toán thành công.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="font-display text-xl text-center mb-8" style={{ fontWeight: 300, color: "#E8E0D5" }}>
            Câu hỏi thường gặp
          </h3>
          {[
            ["Tại sao chỉ 20.000đ?", "Chúng tôi muốn mọi ứng viên Việt Nam đều có thể tiếp cận công cụ AI chất lượng cao với chi phí thấp nhất."],
            ["Sau 30 ngày thì sao?", "Tài khoản tự động trở về Free (5 lượt/ngày). Bạn không bị tính phí thêm."],
            ["Có thể hoàn tiền không?", "Chúng tôi không hỗ trợ hoàn tiền sau khi kích hoạt Pro. Hãy dùng thử Free trước."],
            ["Dữ liệu CV có an toàn?", "CV chỉ được dùng để phân tích. Chúng tôi không lưu file gốc, chỉ lưu text và kết quả phân tích."],
          ].map(([q, a]) => (
            <div key={q} className="py-5" style={{ borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <h4 className="font-display mb-2" style={{ fontWeight: 400, color: "#E8E0D5", fontSize: "1.05rem" }}>{q}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.4)" }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
