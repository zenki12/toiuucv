// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { locale } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {locale === 'vi' ? 'Xin chào' : 'Hello'},{' '}
              {session?.user?.name?.split(' ').pop()} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {locale === 'vi'
                ? 'Quản lý báo cáo phân tích CV của bạn'
                : 'Manage your CV analysis reports'}
            </p>
          </div>
          <Link href="/analyze" className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {locale === 'vi' ? 'Phân tích mới' : 'New Analysis'}
          </Link>
        </div>

        {/* Usage meter */}
        <div className="card p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {locale === 'vi' ? 'Số phân tích còn lại tháng này' : 'Remaining analyses this month'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {locale === 'vi' ? 'Giới hạn miễn phí: 10/tháng' : 'Free limit: 10/month'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-2.5 h-6 rounded-sm ${i < 8 ? 'bg-brand-500' : 'bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700">8/10</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="card p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-slate-900 mb-2">
            {locale === 'vi' ? 'Chưa có báo cáo nào' : 'No reports yet'}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {locale === 'vi'
              ? 'Upload CV và JD để nhận báo cáo phân tích chi tiết đầu tiên của bạn.'
              : 'Upload your CV and JD to get your first detailed analysis report.'}
          </p>
          <Link href="/analyze" className="btn-primary">
            {locale === 'vi' ? 'Phân tích CV ngay' : 'Analyze CV Now'}
          </Link>
        </div>
      </main>
    </div>
  );
}
