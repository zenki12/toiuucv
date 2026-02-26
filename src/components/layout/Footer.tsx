import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16" style={{ background: "#080808", borderTop: "1px solid rgba(201,169,110,0.08)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>F</div>
              <span className="font-display text-lg" style={{ fontWeight: 500, color: "#E8E0D5" }}>FitYourCV</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(232,224,213,0.3)" }}>
              Tối ưu CV bằng AI. Tăng tỷ lệ phỏng vấn với phân tích chi tiết và gợi ý thông minh.
            </p>
          </div>

          {[
            { title: "Sản phẩm", links: [["Phân tích CV", "/analyze"], ["Bảng giá", "/pricing"], ["Dashboard", "/dashboard"]] },
            { title: "Tài nguyên", links: [["Blog", "#"], ["Hướng dẫn", "#"], ["FAQ", "#"]] },
            { title: "Liên hệ", links: [["Facebook", "#"], ["LinkedIn", "#"], ["info@fityourcv.com", "mailto:info@fityourcv.com"]] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs tracking-[0.25em] uppercase mb-5" style={{ color: "#C9A96E" }}>{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors duration-300"
                      style={{ color: "rgba(232,224,213,0.35)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.35)")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(201,169,110,0.07)" }}>
          <p className="text-xs" style={{ color: "rgba(232,224,213,0.2)" }}>
            © 2025 FitYourCV. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            {[["Điều khoản", "#"], ["Bảo mật", "#"]].map(([label, href]) => (
              <Link key={label} href={href} className="text-xs transition-colors duration-300"
                style={{ color: "rgba(232,224,213,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.2)")}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
