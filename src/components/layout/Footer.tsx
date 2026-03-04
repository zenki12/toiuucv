// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';

export function Footer() {
  const { locale } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12M3 8h8M3 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M13 10l2.5 2.5-2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-white text-[15px]">Tối Ưu CV</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {locale === 'vi'
                ? 'Công cụ phân tích và tối ưu CV miễn phí, giúp ứng viên tăng cơ hội trúng tuyển.'
                : 'Free CV analysis and optimization tool to help job seekers increase their hiring chances.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">
              {locale === 'vi' ? 'Sản phẩm' : 'Product'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/analyze" className="hover:text-slate-200 transition-colors">
                {locale === 'vi' ? 'Phân tích CV' : 'Analyze CV'}
              </Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-200 transition-colors">
                {locale === 'vi' ? 'Lịch sử' : 'History'}
              </Link></li>
              <li><Link href="/#faq" className="hover:text-slate-200 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">
              {locale === 'vi' ? 'Pháp lý' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-slate-200 transition-colors">
                {locale === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
              </Link></li>
              <li><Link href="/terms" className="hover:text-slate-200 transition-colors">
                {locale === 'vi' ? 'Điều khoản dịch vụ' : 'Terms of Service'}
              </Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Tối Ưu CV. {locale === 'vi' ? 'Miễn phí · Không quảng cáo.' : 'Free · No ads.'}</p>
          <p className="text-slate-600">
            {locale === 'vi' ? 'File CV/JD tự động xóa sau 90 ngày.' : 'CV/JD files auto-deleted after 90 days.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
