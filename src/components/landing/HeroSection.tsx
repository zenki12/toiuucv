// src/components/landing/HeroSection.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n/context';

export function HeroSection() {
  const { data: session } = useSession();
  const { t, locale } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-brand-200/30 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-brand-100/40 blur-3xl animate-pulse-soft animate-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-50/60 blur-3xl" />
        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-xs font-semibold mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          {t('landing.hero.badge')}
        </div>

        {/* Main title */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-up animate-delay-100">
          <span className="gradient-text">{t('landing.hero.title')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-slate-600 font-medium mb-4 animate-fade-up animate-delay-200 text-balance">
          {t('landing.hero.subtitle')}
        </p>

        <p className="text-sm text-slate-400 mb-10 animate-fade-up animate-delay-300 tracking-wider uppercase font-medium">
          {t('landing.hero.description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-delay-400">
          <Link
            href={session ? '/analyze' : '/login'}
            className="btn-primary text-base px-8 py-4 shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 transition-shadow"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            {t('landing.hero.cta')}
          </Link>
          <p className="text-xs text-slate-400">{t('landing.hero.ctaSub')}</p>
        </div>

        {/* Visual preview / score mockup */}
        <div className="mt-16 animate-fade-up animate-delay-500">
          <div className="relative max-w-3xl mx-auto">
            {/* Mock report card */}
            <div className="card p-6 shadow-2xl border-slate-200/60 bg-white/90 backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-apply">✓ {locale === 'vi' ? 'Nên ứng tuyển' : 'Should Apply'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {locale === 'vi' ? 'Senior Frontend Engineer · TechCorp Vietnam' : 'Senior Frontend Engineer · TechCorp Vietnam'}
                  </p>
                </div>
                {/* Score circle */}
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#dbeafe" strokeWidth="8"/>
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="213.6"
                      strokeDashoffset="42.7"
                      className="score-ring"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#1d4ed8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold font-display text-slate-900">80</span>
                    <span className="text-[9px] text-slate-400 font-medium">/100</span>
                  </div>
                </div>
              </div>

              {/* Mini metrics */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: locale === 'vi' ? 'Phù hợp' : 'Match', score: 80, color: 'bg-blue-500' },
                  { label: locale === 'vi' ? 'Kinh nghiệm' : 'Experience', score: 75, color: 'bg-indigo-500' },
                  { label: locale === 'vi' ? 'Kỹ năng' : 'Skills', score: 85, color: 'bg-violet-500' },
                  { label: 'ATS', score: 70, color: 'bg-sky-500' },
                  { label: locale === 'vi' ? 'Ngôn ngữ' : 'Language', score: 90, color: 'bg-cyan-500' },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="h-1.5 rounded-full bg-slate-100 mb-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{m.label}</p>
                    <p className="text-xs font-bold text-slate-700">{m.score}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating labels */}
            <div className="absolute -left-4 top-8 card px-3 py-2 shadow-lg text-xs font-semibold text-brand-700 bg-brand-50 border-brand-200 hidden sm:block">
              🎯 {locale === 'vi' ? 'Gap Map 15 yêu cầu' : '15 JD requirements mapped'}
            </div>
            <div className="absolute -right-4 bottom-8 card px-3 py-2 shadow-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200 hidden sm:block">
              ✅ {locale === 'vi' ? 'Lời khuyên coach' : 'Coach advice included'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
