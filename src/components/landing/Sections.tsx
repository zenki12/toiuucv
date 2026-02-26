"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Hero ─────────────────────────────────────────────────────────────
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    };
    el.addEventListener("mousemove", fn);
    return () => el.removeEventListener("mousemove", fn);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ "--mx": "50%", "--my": "50%", background: "#0A0A0A" } as any}>
      {/* Mouse glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 45% at var(--mx) var(--my), rgba(201,169,110,0.07) 0%, transparent 70%)", transition: "background 0.2s" }} />
      {/* Bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.025]">
        <span className="font-display whitespace-nowrap" style={{ fontSize: "18vw", color: "#C9A96E", lineHeight: 1 }}>FitYourCV</span>
      </div>
      {/* Lines */}
      <div className="absolute top-1/3 left-0 w-1/4 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25))" }} />
      <div className="absolute top-1/3 right-0 w-1/4 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.25))" }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-3 mb-10 animate-fade-up">
          <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Được tin dùng bởi 552+ ứng viên</span>
          <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
        </div>

        <h1 className="font-display mb-6 animate-fade-up delay-1"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", lineHeight: 1.05, fontWeight: 300, color: "#E8E0D5" }}>
          Tối Ưu CV Của Bạn<br />
          <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Bằng Trí Tuệ AI</em>
        </h1>

        <p className="max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-2"
          style={{ color: "rgba(232,224,213,0.5)", fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", fontWeight: 300 }}>
          Upload CV, dán Job Description — nhận phân tích chi tiết trong 30 giây.<br />
          Điểm ATS, keyword match, gợi ý viết lại cụ thể từng câu.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-3">
          <Link href="/analyze" className="btn-gold" style={{ minWidth: "220px", padding: "1rem 2.5rem", fontSize: "0.8rem" }}>
            <span>✦ Phân Tích Miễn Phí</span>
          </Link>
          <Link href="/pricing" className="btn-ghost" style={{ minWidth: "220px", padding: "1rem 2.5rem", fontSize: "0.8rem" }}>
            Xem Bảng Giá
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 flex items-center justify-center gap-12 flex-wrap animate-fade-up delay-4">
          {[["552+", "Người dùng"], ["858+", "Lượt phân tích"], ["94%", "Hài lòng"], ["30s", "Thời gian xử lý"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-display mb-1" style={{ fontSize: "2.2rem", fontWeight: 300, color: "#C9A96E" }}>{v}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(232,224,213,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)", animation: "pulse 2s ease-in-out infinite" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(201,169,110,0.3)" }}>Scroll</span>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────
export function HowItWorks() {
  const steps = [
    { n: "01", title: "Upload CV", desc: "Tải lên file PDF hoặc DOCX (tối đa 5MB).", icon: "↑" },
    { n: "02", title: "Dán Job Description", desc: "Copy JD từ LinkedIn, TopCV hoặc bất kỳ nguồn nào.", icon: "⌘" },
    { n: "03", title: "AI Phân Tích", desc: "Claude AI đọc và so khớp CV với JD trong vài giây.", icon: "◎" },
    { n: "04", title: "Nhận Kết Quả", desc: "Điểm số chi tiết, gợi ý cụ thể, lưu vào history.", icon: "✓" },
  ];
  return (
    <section className="py-28 lg:py-36" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Quy trình</span>
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: "#E8E0D5" }}>
            Cách Hoạt Động
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-px" style={{ background: "rgba(201,169,110,0.08)" }}>
          {steps.map((s, i) => (
            <div key={s.n} className="group p-8 lg:p-10 relative transition-all duration-300 cursor-default"
              style={{ background: "#0D0D0D" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#141414")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0D0D0D")}>
              <div className="font-display mb-6" style={{ fontSize: "4rem", fontWeight: 300, color: "rgba(201,169,110,0.07)", lineHeight: 1 }}>{s.n}</div>
              <div className="text-2xl mb-4" style={{ color: "#C9A96E" }}>{s.icon}</div>
              <h3 className="font-display text-xl mb-3" style={{ fontWeight: 400, color: "#E8E0D5" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.4)" }}>{s.desc}</p>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-xs" style={{ color: "rgba(201,169,110,0.3)" }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────
export function Features() {
  const features = [
    { n: "01", title: "Điểm ATS", en: "ATS Score", desc: "Kiểm tra khả năng CV vượt qua hệ thống lọc tự động của nhà tuyển dụng." },
    { n: "02", title: "Khớp Từ Khóa", en: "Keyword Match", desc: "So sánh từ khóa trong CV với JD, chỉ ra chính xác những gì còn thiếu." },
    { n: "03", title: "Gợi Ý Viết Lại", en: "Rewrite Suggestions", desc: "AI đề xuất câu chữ tốt hơn cho từng phần yếu của CV." },
    { n: "04", title: "Lưu Lịch Sử", en: "Analysis History", desc: "Xem lại toàn bộ lịch sử phân tích, theo dõi tiến trình cải thiện." },
  ];
  return (
    <section id="features" className="py-28 lg:py-36" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Tính năng</span>
            </div>
            <h2 className="font-display mb-6" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: "#E8E0D5", lineHeight: 1.1 }}>
              Tất Cả Những Gì<br />
              <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Bạn Cần</em>
            </h2>
            <p style={{ color: "rgba(232,224,213,0.45)", lineHeight: 1.8, maxWidth: "400px" }}>
              Một công cụ đầy đủ để cải thiện CV, tăng tỷ lệ được gọi phỏng vấn và hiểu rõ mình cần làm gì tiếp theo.
            </p>
            <div className="mt-10">
              <Link href="/analyze" className="btn-gold">
                <span>Thử ngay — Miễn phí</span>
              </Link>
            </div>
          </div>
          <div className="space-y-px" style={{ background: "rgba(201,169,110,0.08)" }}>
            {features.map(f => (
              <div key={f.n} className="group flex gap-6 p-6 lg:p-8 transition-all duration-300 cursor-default"
                style={{ background: "#0A0A0A" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#111111")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0A0A0A")}>
                <div className="font-display shrink-0 mt-1" style={{ fontSize: "1.5rem", fontWeight: 300, color: "rgba(201,169,110,0.3)" }}>{f.n}</div>
                <div>
                  <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(201,169,110,0.5)" }}>{f.en}</div>
                  <h3 className="font-display text-lg mb-2" style={{ fontWeight: 400, color: "#E8E0D5" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.4)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────
export function Testimonials() {
  const [active, setActive] = useState(0);
  const items = [
    { q: "Sau khi dùng FitYourCV, tôi nhận ra CV thiếu rất nhiều keyword. Chỉnh lại và nhận offer sau 2 tuần.", name: "Anh Nguyễn", role: "Product Manager", i: "A" },
    { q: "Điểm phù hợp giúp tôi hiểu vì sao mình bị loại sớm. Bây giờ tỷ lệ callback tăng hẳn.", name: "Thảo Vũ", role: "UI Designer", i: "T" },
    { q: "Tính năng gợi ý viết lại từng câu rất hữu ích. CV của tôi chuyên nghiệp hơn nhiều.", name: "Minh Trần", role: "Software Engineer", i: "M" },
  ];
  return (
    <section className="py-28 lg:py-36" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Người dùng nói gì</span>
            <div className="w-10 h-px" style={{ background: "#C9A96E" }} />
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: "#E8E0D5" }}>
            Câu Chuyện <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Thực Tế</em>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="p-10 lg:p-14 mb-8" style={{ border: "1px solid rgba(201,169,110,0.15)", background: "#111111" }}>
            <div className="font-display mb-8" style={{ fontSize: "5rem", color: "rgba(201,169,110,0.06)", lineHeight: 0.5 }}>"</div>
            <blockquote className="font-display mb-8" style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 300, color: "#E8E0D5", lineHeight: 1.6, fontStyle: "italic" }}>
              {items[active].q}
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display"
                style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>
                {items[active].i}
              </div>
              <div>
                <div style={{ color: "#E8E0D5", fontWeight: 400, fontSize: "0.9rem" }}>{items[active].name}</div>
                <div className="text-xs" style={{ color: "rgba(201,169,110,0.6)" }}>{items[active].role}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="transition-all duration-300"
                style={{ width: i === active ? "32px" : "8px", height: "2px", background: i === active ? "#C9A96E" : "rgba(201,169,110,0.2)" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="py-28 lg:py-36 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(201,169,110,0.5) 50px, rgba(201,169,110,0.5) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(201,169,110,0.5) 50px, rgba(201,169,110,0.5) 51px)` }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-14 h-px" style={{ background: "#C9A96E" }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>Bắt đầu ngay</span>
          <div className="w-14 h-px" style={{ background: "#C9A96E" }} />
        </div>
        <h2 className="font-display mb-6" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, color: "#E8E0D5", lineHeight: 1.1 }}>
          Sẵn Sàng Cải Thiện<br />
          <em style={{ color: "#C9A96E", fontStyle: "italic" }}>CV Của Bạn?</em>
        </h2>
        <p className="mb-12 leading-relaxed" style={{ color: "rgba(232,224,213,0.45)", fontSize: "1.05rem" }}>
          Miễn phí 5 lượt mỗi ngày. Nâng cấp Pro chỉ 20.000đ/tháng để phân tích không giới hạn.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/analyze" className="btn-gold" style={{ minWidth: "240px", padding: "1rem 2.5rem" }}>
            <span>Phân Tích Ngay — Miễn Phí</span>
          </Link>
          <Link href="/pricing" className="btn-ghost" style={{ minWidth: "200px", padding: "1rem 2.5rem" }}>
            Xem Bảng Giá
          </Link>
        </div>
        <p className="mt-6 text-xs tracking-widest uppercase" style={{ color: "rgba(232,224,213,0.2)" }}>
          Không cần thẻ tín dụng · Đăng nhập bằng Google
        </p>
      </div>
    </section>
  );
}
