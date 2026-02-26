import { cookies } from "next/headers";
import { createSupabaseServer, createSupabaseAdmin } from "./supabase";
import type { Profile } from "@/types";

const FREE_DAILY_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT ?? "5");

export async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = createSupabaseServer(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const admin = createSupabaseAdmin();
  const { data } = await admin.from("profiles").select("*").eq("id", user.id).single();
  return data as Profile | null;
}

export async function checkAndIncrementLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  isPro: boolean;
}> {
  const admin = createSupabaseAdmin();

  // Reset daily count if date has changed
  await admin.rpc("reset_daily_count_if_needed", { p_user_id: userId });

  // Fetch fresh profile
  const { data: profile } = await admin
    .from("profiles")
    .select("plan, pro_expires_at, daily_count, total_analyses")
    .eq("id", userId)
    .single();

  if (!profile) return { allowed: false, remaining: 0, isPro: false };

  const isPro =
    profile.plan === "pro" &&
    profile.pro_expires_at &&
    new Date(profile.pro_expires_at) > new Date();

  if (isPro) {
    // Pro: increment counts directly (no rpc needed)
    await admin
      .from("profiles")
      .update({
        daily_count: profile.daily_count + 1,
        total_analyses: (profile.total_analyses || 0) + 1,
      })
      .eq("id", userId);
    return { allowed: true, remaining: Infinity, isPro: true };
  }

  // Free plan: check limit
  if (profile.daily_count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0, isPro: false };
  }

  const newCount = profile.daily_count + 1;
  await admin
    .from("profiles")
    .update({
      daily_count: newCount,
      total_analyses: (profile.total_analyses || 0) + 1,
    })
    .eq("id", userId);

  return {
    allowed: true,
    remaining: FREE_DAILY_LIMIT - newCount,
    isPro: false,
  };
}

export async function activateProPlan(userId: string, durationDays = 30) {
  const admin = createSupabaseAdmin();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  await admin
    .from("profiles")
    .update({ plan: "pro", pro_expires_at: expiresAt.toISOString() })
    .eq("id", userId);
}
