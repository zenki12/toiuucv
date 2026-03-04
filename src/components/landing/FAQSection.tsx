// src/components/landing/FAQSection.tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface FAQ {
  id: string;
  qVi: string;
  aVi: string;
  qEn: string;
  aEn: string;
}

const DEFAULT_FAQS = [
  {
    id: '1',
    qVi: 'Tôi có cần trả phí không?',
    aVi: 'Không. Tối Ưu CV hoàn toàn miễn phí với 10 phân tích mỗi tháng cho mỗi tài khoản.',
    qEn: 'Do I need to pay?',
    aEn: 'No. CV Optimizer is completely free with 10 analyses per month per account.',
  },
  {
    id: '2',
    qVi: 'Dữ liệu CV của tôi có bị lưu trữ không?',
    aVi: 'File CV/JD được lưu trên server private và tự động xóa sau 90 ngày. Chúng tôi không chia sẻ dữ liệu với bên thứ ba.',
    qEn: 'Is my CV data stored?',
    aEn: 'CV/JD files are stored on private servers and automatically deleted after 90 days. We do not share data with third parties.',
  },
  {
    id: '3',
    qVi: 'Điểm số được tính như thế nào?',
    aVi: 'Điểm được tính theo 10 tiêu chí có trọng số khác nhau, từ mức độ phù hợp với JD, kinh nghiệm, kỹ năng chuyên môn, đến ATS format. Không dùng AI trả phí — tất cả dựa trên thuật toán phân tích nội bộ.',
    qEn: 'How is the score calculated?',
    aEn: 'The score is calculated across 10 weighted criteria, from JD relevance, experience, and skills to ATS formatting. No paid AI — all based on our internal analysis engine.',
  },
  {
    id: '4',
    qVi: 'Hỗ trợ những định dạng file nào?',
    aVi: 'PDF và DOCX (Word). Kích thước tối đa 100MB. Nên dùng PDF để đảm bảo trích xuất chính xác nhất.',
    qEn: 'What file formats are supported?',
    aEn: 'PDF and DOCX (Word). Maximum size 100MB. PDF is recommended for the most accurate text extraction.',
  },
  {
    id: '5',
    qVi: 'JD Fit Gap Map là gì?',
    aVi: 'Đây là bảng phân tích chi tiết từng yêu cầu trong JD, cho biết CV của bạn đã đáp ứng (FOUND), đáp ứng một phần (PARTIAL), hay còn thiếu (MISSING) — kèm gợi ý cụ thể để bổ sung.',
    qEn: 'What is the JD Fit Gap Map?',
    aEn: "This is a detailed analysis table of each JD requirement, showing whether your CV has met (FOUND), partially met (PARTIAL), or is missing (MISSING) it — with specific suggestions to fill the gap.",
  },
];

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const { t, locale } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);

  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">{t('landing.faq.title')}</h2>
        </div>

        <div className="space-y-3">
          {displayFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const q = locale === 'vi' ? faq.qVi : faq.qEn;
            const a = locale === 'vi' ? faq.aVi : faq.aEn;

            return (
              <div key={faq.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-sm pr-4">{q}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
