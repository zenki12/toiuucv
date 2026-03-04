// src/app/login/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 4h12M3 8h8M3 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M13 10l2.5 2.5-2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-slate-900 text-[15px]">Tối Ưu CV</span>
        </Link>
        <button
          onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
        >
          <span className="text-base">{locale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
          <span>{locale === 'vi' ? 'VI' : 'EN'}</span>
        </button>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10 shadow-xl">
            {/* Logo + title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 mb-5 shadow-lg shadow-brand-200">
                <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12M3 8h8M3 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M13 10l2.5 2.5-2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                {t('auth.loginTitle')}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {/* Benefits list */}
            <div className="bg-brand-50 rounded-xl p-4 mb-6 space-y-2">
              {[
                locale === 'vi' ? '✓ Miễn phí 10 phân tích/tháng' : '✓ Free 10 analyses/month',
                locale === 'vi' ? '✓ Lưu lịch sử báo cáo' : '✓ Save report history',
                locale === 'vi' ? '✓ Không cần thẻ tín dụng' : '✓ No credit card required',
              ].map((item, i) => (
                <p key={i} className="text-brand-700 text-xs font-medium">{item}</p>
              ))}
            </div>

            {/* Google sign in */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
                bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm
                hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700
                active:scale-[0.98] transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                shadow-sm"
            >
              {/* Google logo */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.loginGoogle')}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              {t('auth.loginNote')}
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            {locale === 'vi'
              ? 'File CV/JD tự động xóa sau 90 ngày. Dữ liệu của bạn là riêng tư.'
              : 'CV/JD files auto-deleted after 90 days. Your data is private.'}
          </p>
        </div>
      </div>
    </div>
  );
}
