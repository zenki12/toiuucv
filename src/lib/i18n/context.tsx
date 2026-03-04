// src/lib/i18n/context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'vi' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('vi');

  const t = (key: string): string => {
    const translations = locale === 'vi' ? vi : en;
    return getNestedValue(translations, key) || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

function getNestedValue(obj: Record<string, any>, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) || '';
}

// ===== VIETNAMESE =====
const vi = {
  nav: {
    product: 'Sản phẩm',
    howItWorks: 'Cách hoạt động',
    pricing: 'Giá',
    faq: 'FAQ',
    login: 'Đăng nhập',
    dashboard: 'Bảng điều khiển',
    analyze: 'Phân tích CV',
    logout: 'Đăng xuất',
  },
  landing: {
    hero: {
      badge: 'Miễn phí · Không cần tài khoản trả phí',
      title: 'Tối Ưu CV',
      subtitle: 'Đánh giá CV của bạn so với Job Description',
      description: 'Phân tích thông minh · Lời khuyên chiến lược · Tăng cơ hội trúng tuyển',
      cta: 'Phân tích CV miễn phí',
      ctaSub: 'Không cần thẻ tín dụng · 10 phân tích/tháng',
    },
    counters: {
      reports: 'Báo cáo đã tạo',
      users: 'Ứng viên tin dùng',
      avgScore: 'Điểm trung bình sau tối ưu',
    },
    howItWorks: {
      title: 'Chỉ 3 bước đơn giản',
      subtitle: 'Từ CV thô đến CV tối ưu trong vài phút',
      step1: {
        title: 'Upload CV & JD',
        desc: 'Tải lên CV (PDF/DOCX) và dán Job Description. Hỗ trợ cả tiếng Việt và tiếng Anh.',
      },
      step2: {
        title: 'Phân tích thông minh',
        desc: 'Engine phân tích so sánh CV với JD theo 10 tiêu chí, chấm điểm và phát hiện gap.',
      },
      step3: {
        title: 'Nhận báo cáo chi tiết',
        desc: 'Xem điểm số, chiến lược tối ưu, Gap Map và lời khuyên viết lại từng phần.',
      },
    },
    features: {
      title: 'Đầy đủ tính năng coaching',
      subtitle: 'Không chỉ là công cụ chấm điểm — đây là người mentor CV của bạn',
      items: [
        {
          title: 'Chấm điểm 10 tiêu chí',
          desc: 'Đánh giá toàn diện từ nội dung, format, đến ATS compatibility',
        },
        {
          title: 'JD Fit Gap Map',
          desc: 'Bảng so sánh chi tiết từng yêu cầu JD với những gì CV của bạn đang có',
        },
        {
          title: 'Optimization Lab',
          desc: 'Lời khuyên cụ thể, checklist hành động và gợi ý viết lại từng mục',
        },
        {
          title: 'ATS Keywords',
          desc: 'Phát hiện từ khóa thiếu và gợi ý vị trí chèn vào',
        },
        {
          title: 'Chiến lược tổng thể',
          desc: 'Insight positioning CV theo JD, không chỉ sửa lỗi nhỏ',
        },
        {
          title: 'Lịch sử báo cáo',
          desc: 'Lưu và xem lại tất cả báo cáo, theo dõi tiến trình cải thiện',
        },
      ],
    },
    faq: {
      title: 'Câu hỏi thường gặp',
    },
    testimonials: {
      title: 'Ứng viên nói gì',
    },
    cta: {
      title: 'Sẵn sàng tối ưu CV?',
      subtitle: 'Miễn phí hoàn toàn. 10 phân tích mỗi tháng.',
      button: 'Bắt đầu ngay',
    },
  },
  report: {
    recommendation: {
      apply: 'Nên ứng tuyển',
      consider: 'Cân nhắc',
      not_fit: 'Chưa phù hợp',
    },
    scoreLabel: {
      excellent: 'Rất phù hợp',
      good: 'Khá phù hợp',
      average: 'Trung bình',
      needsWork: 'Cần cải thiện',
      poor: 'Chưa phù hợp',
    },
    sections: {
      strategy: 'Chiến lược tối ưu CV',
      radar: 'Biểu đồ phân tích',
      metrics: 'Chi tiết tiêu chí',
      gapMap: 'JD Fit Gap Map',
      optimizationLab: 'Optimization Lab',
      atsKeywords: 'ATS Keywords',
      checklist: 'Checklist hành động',
    },
    gapMap: {
      mustHave: 'Bắt buộc',
      responsibilities: 'Nhiệm vụ',
      tools: 'Công cụ/Stack',
      found: 'Có',
      partial: 'Một phần',
      missing: 'Thiếu',
      insertAt: 'Chèn vào',
      rewriteTemplate: 'Mẫu viết lại',
    },
    checklist: {
      title: 'Danh sách việc cần làm',
      saveNote: 'Tự động lưu',
    },
  },
  auth: {
    loginTitle: 'Đăng nhập vào Tối Ưu CV',
    loginSubtitle: 'Phân tích CV, tối ưu hồ sơ, tăng cơ hội trúng tuyển',
    loginGoogle: 'Tiếp tục với Google',
    loginNote: 'Chỉ đăng nhập bằng tài khoản Google. Miễn phí hoàn toàn.',
  },
  common: {
    loading: 'Đang tải...',
    error: 'Có lỗi xảy ra',
    retry: 'Thử lại',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    create: 'Tạo mới',
    back: 'Quay lại',
  },
};

// ===== ENGLISH =====
const en = {
  nav: {
    product: 'Product',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    faq: 'FAQ',
    login: 'Log in',
    dashboard: 'Dashboard',
    analyze: 'Analyze CV',
    logout: 'Log out',
  },
  landing: {
    hero: {
      badge: 'Free · No paid account needed',
      title: 'CV Optimizer',
      subtitle: 'Evaluate your CV against the Job Description',
      description: 'Smart Analysis · Strategic Coaching · Increase Hiring Chances',
      cta: 'Analyze CV for free',
      ctaSub: 'No credit card · 10 analyses/month',
    },
    counters: {
      reports: 'Reports Generated',
      users: 'Job Seekers Trust Us',
      avgScore: 'Avg Score After Optimization',
    },
    howItWorks: {
      title: '3 Simple Steps',
      subtitle: 'From raw CV to optimized CV in minutes',
      step1: {
        title: 'Upload CV & JD',
        desc: 'Upload your CV (PDF/DOCX) and paste the Job Description. Supports Vietnamese and English.',
      },
      step2: {
        title: 'Smart Analysis',
        desc: 'Our engine compares your CV against the JD on 10 criteria, scores them and finds gaps.',
      },
      step3: {
        title: 'Get Detailed Report',
        desc: 'View your score, optimization strategy, Gap Map and section-by-section rewrite suggestions.',
      },
    },
    features: {
      title: 'Full-featured coaching',
      subtitle: "Not just a scoring tool — it's your CV mentor",
      items: [
        {
          title: '10-criteria scoring',
          desc: 'Comprehensive evaluation: content, format, ATS compatibility',
        },
        {
          title: 'JD Fit Gap Map',
          desc: 'Detailed comparison of each JD requirement vs. your CV',
        },
        {
          title: 'Optimization Lab',
          desc: 'Specific advice, action checklists and section-by-section rewrites',
        },
        {
          title: 'ATS Keywords',
          desc: 'Missing keywords detected with insertion suggestions',
        },
        {
          title: 'Overall Strategy',
          desc: 'CV positioning insight, not just fixing small errors',
        },
        {
          title: 'Report History',
          desc: 'Save and review all reports, track improvement progress',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
    },
    testimonials: {
      title: 'What candidates say',
    },
    cta: {
      title: 'Ready to optimize your CV?',
      subtitle: 'Completely free. 10 analyses per month.',
      button: 'Get started',
    },
  },
  report: {
    recommendation: {
      apply: 'Should Apply',
      consider: 'Consider Applying',
      not_fit: 'Not a Fit Yet',
    },
    scoreLabel: {
      excellent: 'Excellent Match',
      good: 'Good Match',
      average: 'Average',
      needsWork: 'Needs Work',
      poor: 'Poor Match',
    },
    sections: {
      strategy: 'CV Optimization Strategy',
      radar: 'Analysis Radar',
      metrics: 'Criteria Details',
      gapMap: 'JD Fit Gap Map',
      optimizationLab: 'Optimization Lab',
      atsKeywords: 'ATS Keywords',
      checklist: 'Action Checklist',
    },
    gapMap: {
      mustHave: 'Must-Have',
      responsibilities: 'Responsibilities',
      tools: 'Tools/Stack',
      found: 'Found',
      partial: 'Partial',
      missing: 'Missing',
      insertAt: 'Insert at',
      rewriteTemplate: 'Rewrite Template',
    },
    checklist: {
      title: 'Action Items',
      saveNote: 'Auto-saved',
    },
  },
  auth: {
    loginTitle: 'Sign in to CV Optimizer',
    loginSubtitle: 'Analyze your CV, optimize your profile, increase hiring chances',
    loginGoogle: 'Continue with Google',
    loginNote: 'Google sign-in only. Completely free.',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
  },
};
