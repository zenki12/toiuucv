// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tối Ưu CV — Phân tích và tối ưu CV miễn phí',
  description:
    'Đánh giá CV so với Job Description, nhận lời khuyên chiến lược và tối ưu hồ sơ để tăng cơ hội trúng tuyển.',
  keywords: ['cv', 'resume', 'job description', 'phân tích cv', 'tối ưu cv', 'ats'],
  openGraph: {
    title: 'Tối Ưu CV',
    description: 'Phân tích CV vs JD · Lời khuyên chiến lược · Miễn phí',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-body bg-slate-50 text-slate-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
