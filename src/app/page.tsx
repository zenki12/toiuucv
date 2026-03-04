// src/app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { CountersSection } from '@/components/landing/CountersSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { prisma } from '@/lib/prisma';

async function getStats() {
  try {
    const [totalReports, totalUsers, avgScore] = await Promise.all([
      prisma.report.count(),
      prisma.user.count(),
      prisma.report.aggregate({ _avg: { overallScore: true } }),
    ]);
    return {
      total_reports: totalReports,
      total_users: totalUsers,
      avg_score: Math.round(avgScore._avg.overallScore || 72),
    };
  } catch {
    return { total_reports: 0, total_users: 0, avg_score: 72 };
  }
}

async function getFAQs() {
  try {
    return await prisma.adminFaq.findMany({ orderBy: { displayOrder: 'asc' } });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await prisma.adminTestimonial.findMany({ orderBy: { displayOrder: 'asc' } });
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const [stats, faqs, testimonials] = await Promise.all([
    getStats(),
    getFAQs(),
    getTestimonials(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CountersSection stats={stats} />
        <HowItWorksSection />
        <FeaturesSection />
        {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
        <FAQSection faqs={faqs} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
