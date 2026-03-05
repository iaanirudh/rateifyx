import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, PLANS, PlanKey, CycleKey } from "@/lib/dodo";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, cycle } = await req.json() as { plan: PlanKey; cycle: CycleKey };

    if (!PLANS[plan]?.[cycle]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get existing dodo customer id if any
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("dodo_customer_id")
      .eq("user_id", user.id)
      .single();

    const session = await createCheckoutSession({
      priceId:       PLANS[plan][cycle].priceId,
      customerId:    sub?.dodo_customer_id ?? undefined,
      customerEmail: user.email!,
      successUrl:    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancelUrl:     `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("/api/checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}