import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FitYourCV — AI CV Optimizer", template: "%s | FitYourCV" },
  description: "Tải lên CV và nhận phân tích AI chi tiết. So khớp với JD, điểm ATS, gợi ý cải thiện — miễn phí 5 lượt/ngày.",
  keywords: ["CV optimizer", "phân tích CV", "ATS", "AI resume", "tối ưu CV"],
  openGraph: {
    title: "FitYourCV — AI CV Optimizer",
    description: "Phân tích CV bằng AI, khớp với Job Description, tăng tỷ lệ phỏng vấn.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="grain">{children}</body>
    </html>
  );
}
