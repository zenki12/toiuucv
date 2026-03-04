// src/components/landing/TestimonialsSection.tsx
'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

interface Testimonial {
  id: string;
  name: string;
  titleVi: string;
  titleEn: string;
  quoteVi: string;
  quoteEn: string;
  avatarUrl?: string | null;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t, locale } = useI18n();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">{t('landing.testimonials.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t_item) => (
            <div key={t_item.id} className="card p-6 hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-slate-600 text-sm leading-relaxed mb-5 italic">
                "{locale === 'vi' ? t_item.quoteVi : t_item.quoteEn}"
              </blockquote>

              <div className="flex items-center gap-3">
                {t_item.avatarUrl ? (
                  <Image src={t_item.avatarUrl} alt={t_item.name} width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                    {t_item.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t_item.name}</p>
                  <p className="text-xs text-slate-400">
                    {locale === 'vi' ? t_item.titleVi : t_item.titleEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
