// src/app/admin/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '-', icon: '👥' },
            { label: 'Total Reports', value: '-', icon: '📊' },
            { label: 'Avg Score', value: '-', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold font-display text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">FAQ Management</h2>
            <p className="text-sm text-slate-500">Coming in Milestone 6</p>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Testimonials Management</h2>
            <p className="text-sm text-slate-500">Coming in Milestone 6</p>
          </div>
        </div>
      </main>
    </div>
  );
}
