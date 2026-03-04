// src/app/analyze/page.tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Navbar } from '@/components/layout/Navbar';

export default function AnalyzePage() {
  const { locale } = useI18n();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {locale === 'vi' ? 'Phân tích CV mới' : 'New CV Analysis'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {locale === 'vi'
              ? 'Upload CV và dán Job Description để nhận báo cáo chi tiết'
              : 'Upload CV and paste Job Description to get a detailed report'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CV Upload */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-1">
              {locale === 'vi' ? 'Bước 1: Upload CV' : 'Step 1: Upload CV'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">PDF hoặc DOCX, tối đa 100MB</p>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${isDragging ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'}
                ${cvFile ? 'border-emerald-300 bg-emerald-50' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) setCvFile(file);
              }}
              onClick={() => document.getElementById('cv-input')?.click()}
            >
              <input
                id="cv-input" type="file" className="hidden"
                accept=".pdf,.docx"
                onChange={(e) => { if (e.target.files?.[0]) setCvFile(e.target.files[0]); }}
              />
              {cvFile ? (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-emerald-700 text-sm">{cvFile.name}</p>
                  <p className="text-xs text-emerald-500 mt-1">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="font-medium text-slate-700 text-sm mb-1">
                    {locale === 'vi' ? 'Kéo thả hoặc click để upload' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOCX</p>
                </div>
              )}
            </div>
          </div>

          {/* JD Input */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-1">
              {locale === 'vi' ? 'Bước 2: Job Description' : 'Step 2: Job Description'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {locale === 'vi' ? 'Dán nội dung JD vào đây' : 'Paste JD content here'}
            </p>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder={locale === 'vi'
                ? 'Dán Job Description vào đây...\n\nVí dụ: "Chúng tôi tìm kiếm Senior Frontend Engineer với 3+ năm kinh nghiệm React..."'
                : 'Paste Job Description here...\n\nExample: "We are looking for a Senior Frontend Engineer with 3+ years of React experience..."'}
              className="w-full h-48 text-sm text-slate-700 placeholder-slate-300 resize-none
                border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2
                focus:ring-brand-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-2">{jdText.length} {locale === 'vi' ? 'ký tự' : 'characters'}</p>
          </div>
        </div>

        {/* Analyze button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            disabled={!cvFile || jdText.length < 50}
            className="btn-primary text-base px-10 py-4 shadow-lg shadow-brand-200 disabled:opacity-40"
            onClick={() => alert(locale === 'vi' ? 'Tính năng đang được xây dựng (Milestone 2)' : 'Feature coming in Milestone 2')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {locale === 'vi' ? 'Phân tích ngay' : 'Analyze Now'}
          </button>
          {(!cvFile || jdText.length < 50) && (
            <p className="text-xs text-slate-400">
              {locale === 'vi'
                ? 'Cần upload CV và nhập ít nhất 50 ký tự JD'
                : 'Please upload CV and enter at least 50 characters of JD'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
