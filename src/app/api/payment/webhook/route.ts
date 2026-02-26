import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { verifyPayOSWebhook } from "@/lib/payos";
import { activateProPlan } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify signature
    const isValid = verifyPayOSWebhook(body, process.env.PAYOS_CHECKSUM_KEY!);
    if (!isValid) {
      console.error("Invalid PayOS webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { code, data } = body;
    const admin = createSupabaseAdmin();

    // Find payment
    const { data: payment } = await admin
      .from("payments")
      .select("*")
      .eq("order_code", data?.orderCode)
      .single();

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (code === "00" && data?.status === "PAID") {
      // Update payment
      await admin.from("payments").update({
        status: "paid",
        paid_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        webhook_data: body,
      }).eq("order_code", data.orderCode);

      // Activate pro
      if (payment.user_id) {
        await activateProPlan(payment.user_id, payment.plan_duration_days ?? 30);
      }
    } else if (data?.status === "CANCELLED") {
      await admin.from("payments").update({ status: "cancelled", webhook_data: body })
        .eq("order_code", data.orderCode);
    } else if (data?.status === "EXPIRED") {
      await admin.from("payments").update({ status: "expired", webhook_data: body })
        .eq("order_code", data.orderCode);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
