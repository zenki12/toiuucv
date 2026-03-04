// src/components/landing/CTASection.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n/context';

export function CTASection() {
  const { data: session } = useSession();
  const { t } = useI18n();

  return (
    <section className="py-20 bg-gradient-to-br from-brand-800 to-brand-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-brand-700/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-brand-600/20 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          {t('landing.cta.title')}
        </h2>
        <p className="text-brand-300 text-lg mb-8">{t('landing.cta.subtitle')}</p>
        <Link
          href={session ? '/analyze' : '/login'}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-800 font-bold text-base
            hover:bg-brand-50 active:scale-95 transition-all duration-150 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('landing.cta.button')}
        </Link>
      </div>
    </section>
  );
}
