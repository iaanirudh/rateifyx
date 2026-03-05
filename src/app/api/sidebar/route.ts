import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    // Get subscription + usage in parallel
    const [{ data: sub }, { data: usage }] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("usage")
        .select("quotes_used, quotes_limit")
        .eq("user_id", user.id)
        .eq("period_start", new Date().toISOString().slice(0, 7) + "-01")
        .single(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        plan:         sub?.plan         ?? "basic",
        status:       sub?.status       ?? "trialing",
        quotes_used:  usage?.quotes_used  ?? 0,
        quotes_limit: usage?.quotes_limit ?? 20,
      },
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}