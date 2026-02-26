import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseServer(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const admin = createSupabaseAdmin();

  if (id) {
    // Single analysis
    const { data, error } = await admin
      .from("analyses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ analysis: data });
  }

  // List
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;
  const from = (page - 1) * limit;

  const { data, error, count } = await admin
    .from("analyses")
    .select("id, cv_filename, job_title, company_name, overall_score, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ analyses: data, total: count, page, limit });
}

export async function DELETE(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseServer(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createSupabaseAdmin();
  await admin.from("analyses").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
