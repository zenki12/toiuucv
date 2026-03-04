// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalReports, totalUsers, avgScoreResult] = await Promise.all([
      prisma.report.count(),
      prisma.user.count(),
      prisma.report.aggregate({ _avg: { overallScore: true } }),
    ]);

    return NextResponse.json({
      total_reports: totalReports,
      total_users: totalUsers,
      avg_score: Math.round(avgScoreResult._avg.overallScore || 72),
    });
  } catch {
    return NextResponse.json({ total_reports: 0, total_users: 0, avg_score: 72 });
  }
}
