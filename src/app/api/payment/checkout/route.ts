import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase";
import { createPayOSPayment, generateOrderCode } from "@/lib/payos";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createSupabaseServer(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const orderCode = generateOrderCode();
    const amount = parseInt(process.env.PRO_PRICE_VND ?? "20000");

    // Create payment record first
    const admin = createSupabaseAdmin();
    await admin.from("payments").insert({
      user_id: user.id,
      order_code: orderCode,
      amount,
      description: "FitYourCV Pro 30 ngay",
      status: "pending",
      plan: "pro",
      plan_duration_days: 30,
    });

    // Create PayOS payment link
    const payosData = await createPayOSPayment({
      orderCode,
      amount,
      description: "FitYourCV Pro 30 ngay",
      buyerEmail: user.email,
      buyerName: user.user_metadata?.full_name ?? undefined,
      cancelUrl: `${appUrl}/pricing?status=cancelled`,
      returnUrl: `${appUrl}/dashboard?status=success`,
    });

    // Save payment link id
    await admin.from("payments")
      .update({ payos_payment_link_id: payosData.paymentLinkId })
      .eq("order_code", orderCode);

    return NextResponse.json({
      success: true,
      checkoutUrl: payosData.checkoutUrl,
      orderCode,
    });
  } catch (err: any) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: err.message || "Không thể tạo thanh toán." }, { status: 500 });
  }
}
