import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim());

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseServer(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdmin();
  const { data: stats } = await admin.rpc("get_admin_stats");
  const { data: recentUsers } = await admin
    .from("profiles")
    .select("email, plan, total_analyses, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentPayments } = await admin
    .from("payments")
    .select("amount, status, created_at, paid_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({ stats, recentUsers, recentPayments });
}
