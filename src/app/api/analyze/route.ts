import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase";
import { extractTextFromFile, validateFileSize, validateFileType } from "@/lib/extract";
import { analyzeCV } from "@/lib/ai";
import { checkAndIncrementLimit } from "@/lib/auth";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const cookieStore = cookies();
    const supabase = createSupabaseServer(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để sử dụng tính năng này.", authRequired: true },
        { status: 401 }
      );
    }

    // 2. Rate limit check + increment
    const { allowed, remaining, isPro } = await checkAndIncrementLimit(user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Bạn đã dùng hết 5 lượt miễn phí hôm nay. Nâng cấp Pro để tiếp tục.",
          limitReached: true,
          remainingToday: 0,
        },
        { status: 429 }
      );
    }

    // 3. Parse form data
    const formData = await request.formData();
    const file = formData.get("cv") as File | null;
    const jdText = (formData.get("jd") as string | null)?.trim();

    if (!file) return NextResponse.json({ error: "Vui lòng chọn file CV." }, { status: 400 });
    if (!jdText || jdText.length < 50)
      return NextResponse.json({ error: "Job Description quá ngắn (tối thiểu 50 ký tự)." }, { status: 400 });

    // 4. Validate & extract text
    validateFileType(file.name);
    validateFileSize(file.size);
    const buffer = Buffer.from(await file.arrayBuffer());
    const cvText = await extractTextFromFile(buffer, file.name);

    if (cvText.length < 100) {
      return NextResponse.json(
        { error: "Không thể đọc nội dung CV. Vui lòng kiểm tra lại file." },
        { status: 400 }
      );
    }

    // 5. AI Analysis
    const ai = await analyzeCV(cvText, jdText);

    // 6. Save to DB
    const admin = createSupabaseAdmin();
    const { data: analysis, error: dbError } = await admin
      .from("analyses")
      .insert({
        user_id: user.id,
        cv_filename: file.name,
        cv_text: cvText.slice(0, 10000),
        jd_text: jdText.slice(0, 5000),
        job_title: ai.job_title,
        company_name: ai.company_name,
        overall_score: ai.overall_score,
        verdict: ai.verdict,
        summary: ai.summary,
        app_recommendation: ai.app_recommendation,
        layout_analysis: ai.layout_analysis,
        metrics: ai.metrics,
        recommendation: ai.recommendation,
        strengths: ai.strengths,
        weaknesses: ai.weaknesses,
        matched_skills: ai.matched_skills,
        missing_skills: ai.missing_skills,
        improvements: ai.improvements,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ error: "Lưu kết quả thất bại. Vui lòng thử lại." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      remainingToday: isPro ? null : remaining,
      isPro,
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: err.message || "Đã xảy ra lỗi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
