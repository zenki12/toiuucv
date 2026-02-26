import Anthropic from "@anthropic-ai/sdk";
import type { Analysis } from "@/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type AIAnalysisResult = Omit<Analysis,
  "id" | "user_id" | "cv_filename" | "cv_text" | "jd_text" | "created_at"
>;

export async function analyzeCV(
  cvText: string,
  jdText: string
): Promise<AIAnalysisResult> {
  const prompt = `Bạn là một Career Coach và Resume Strategist cấp cao với chuyên môn về tối ưu hóa hồ sơ cho hệ thống ATS.
Nhiệm vụ: Phân tích CV và đối chiếu với Job Description (JD) một cách cực kỳ chi tiết.

Nội dung CV:
${cvText.slice(0, 4500)}

Nội dung JD:
${jdText.slice(0, 2000)}

YÊU CẦU PHÂN TÍCH CHI TIẾT:
1. Đánh giá 10 chỉ số (score 0-100, weight tổng = 100): Mức độ phù hợp JD, Hiệu quả tóm tắt, Độ sâu kinh nghiệm, Tác động thành tích, Kỹ năng kỹ thuật, Kỹ năng mềm, Kỹ năng bổ sung, Chất lượng ngôn ngữ, Cá tính thương hiệu, Cấu trúc ATS
2. Phân tích Bố cục (layout): font chữ, khoảng trắng, tính logic, khả năng ATS scan
3. Khuyến nghị ứng tuyển: 1 trong 4 trạng thái "Khuyến khích"/"Rất tiềm năng"/"Cần cân nhắc"/"Chưa phù hợp" + lý do
4. Ít nhất 6-8 điểm cải thiện chi tiết với Before/After rewrites, bao phủ đa dạng tiêu chí
5. 3 lời khuyên chiến lược: strategicMove, interviewTip, optimizationPriority

Trả về JSON hợp lệ (không có markdown, không có text thừa) với cấu trúc CHÍNH XÁC sau:

{
  "overall_score": <number 0-100>,
  "verdict": "<1 câu tóm tắt tổng quan bằng tiếng Việt>",
  "summary": "<2-3 câu phân tích tổng thể bằng tiếng Việt>",
  "job_title": "<vị trí tuyển dụng từ JD>",
  "company_name": "<tên công ty từ JD, hoặc 'Không rõ'>",
  "app_recommendation": {
    "status": "<Khuyến khích | Rất tiềm năng | Cần cân nhắc | Chưa phù hợp>",
    "reasoning": "<giải thích cụ thể tại sao, dựa trên gap hoặc điểm mạnh>"
  },
  "layout_analysis": {
    "score": <number 0-100>,
    "feedback": "<nhận xét tổng về bố cục CV>",
    "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
  },
  "metrics": {
    "jobRelevance":            { "score": <n>, "label": "Phù hợp JD",      "weight": 20, "note": "<nhận xét>" },
    "summaryEffectiveness":    { "score": <n>, "label": "Hiệu quả tóm tắt", "weight": 8,  "note": "<nhận xét>" },
    "experienceDepth":         { "score": <n>, "label": "Độ sâu kinh nghiệm","weight": 15, "note": "<nhận xét>" },
    "achievementImpact":       { "score": <n>, "label": "Tác động thành tích","weight": 12, "note": "<nhận xét>" },
    "technicalSkills":         { "score": <n>, "label": "Kỹ năng kỹ thuật",  "weight": 15, "note": "<nhận xét>" },
    "softSkills":              { "score": <n>, "label": "Kỹ năng mềm",       "weight": 8,  "note": "<nhận xét>" },
    "additionalSkills":        { "score": <n>, "label": "Kỹ năng bổ sung",   "weight": 5,  "note": "<nhận xét>" },
    "languageQuality":         { "score": <n>, "label": "Chất lượng ngôn ngữ","weight": 7,  "note": "<nhận xét>" },
    "brandingPersonality":     { "score": <n>, "label": "Cá tính thương hiệu","weight": 5,  "note": "<nhận xét>" },
    "structureProfessionalism":{ "score": <n>, "label": "Cấu trúc ATS",      "weight": 5,  "note": "<nhận xét>" }
  },
  "recommendation": {
    "strategicMove": "<bước đi chiến lược tiếp theo cụ thể>",
    "interviewTip": "<1 tip phỏng vấn dựa trên JD này>",
    "optimizationPriority": "<ưu tiên tối ưu số 1 cần làm ngay>"
  },
  "strengths": ["<điểm mạnh 1>", "<điểm mạnh 2>", "<điểm mạnh 3>"],
  "weaknesses": ["<điểm yếu 1>", "<điểm yếu 2>", "<điểm yếu 3>"],
  "matched_skills": ["<skill có trong CV khớp JD>", ...],
  "missing_skills": ["<skill JD yêu cầu nhưng CV thiếu>", ...],
  "improvements": [
    {
      "category": "<tên tiêu chí, vd: Thành tích định lượng>",
      "currentScore": <number 0-100>,
      "priority": "<high | medium | low>",
      "issue": "<mô tả vấn đề cụ thể>",
      "strategicAdvice": "<lời khuyên chiến lược>",
      "actionSteps": ["<bước 1>", "<bước 2>", "<bước 3>"],
      "rewrites": [
        {
          "original": "<câu gốc trong CV>",
          "improved": "<câu viết lại tốt hơn, có số liệu/keyword từ JD>",
          "explanation": "<giải thích tại sao bản mới tốt hơn>"
        }
      ]
    }
  ]
}

Đảm bảo: phản hồi bằng tiếng Việt, ít nhất 6 improvements, mỗi improvement có ít nhất 1 rewrite example.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = ((message.content[0] as any).text ?? "").trim();
  const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
  }

  // Clamp all scores 0-100
  const clamp = (v: any) => Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
  parsed.overall_score = clamp(parsed.overall_score);
  if (parsed.layout_analysis) parsed.layout_analysis.score = clamp(parsed.layout_analysis.score);
  if (parsed.metrics) {
    for (const key of Object.keys(parsed.metrics)) {
      parsed.metrics[key].score = clamp(parsed.metrics[key].score);
    }
  }
  if (parsed.improvements) {
    parsed.improvements = parsed.improvements.map((imp: any) => ({
      ...imp,
      currentScore: clamp(imp.currentScore),
    }));
  }

  return parsed as AIAnalysisResult;
}
