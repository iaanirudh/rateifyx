import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/dodo";

export async function POST(req: NextRequest) {
  try {
    const payload   = await req.text();
    const signature = req.headers.get("dodo-signature") ?? "";

    // Verify signature
    const valid = verifyWebhookSignature(
      payload,
      signature,
      process.env.DODO_WEBHOOK_SECRET!
    );

    if (!valid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const supabase = await createClient();

    console.log("[dodo webhook]", event.type);

    switch (event.type) {

      // Subscription created / activated
      case "subscription.created":
      case "subscription.activated": {
        const { customer_email, customer_id, id, current_period_start, current_period_end, price_id } = event.data;

        // Find user by email
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customer_email)
          .single();

        if (!profile) break;

        // Determine plan from price id
        const plan  = getPlanFromPriceId(price_id);
        const cycle = getCycleFromPriceId(price_id);

        await supabase
          .from("subscriptions")
          .update({
            plan,
            status:               "active",
            billing_cycle:         cycle,
            dodo_customer_id:      customer_id,
            dodo_subscription_id:  id,
            current_period_start:  current_period_start,
            current_period_end:    current_period_end,
            trial_ends_at:         null,
            updated_at:            new Date().toISOString(),
          })
          .eq("user_id", profile.id);

        // Update usage limit based on plan
        const quotesLimit = plan === "pro" ? 999999 : 20;
        const periodStart = new Date().toISOString().slice(0, 7) + "-01";

        await supabase
          .from("usage")
          .update({ quotes_limit: quotesLimit, updated_at: new Date().toISOString() })
          .eq("user_id", profile.id)
          .eq("period_start", periodStart);

        break;
      }

      // Subscription renewed
      case "subscription.renewed": {
        const { customer_email, current_period_start, current_period_end } = event.data;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customer_email)
          .single();

        if (!profile) break;

        // Update subscription period
        await supabase
          .from("subscriptions")
          .update({
            status:              "active",
            current_period_start,
            current_period_end,
            updated_at:          new Date().toISOString(),
          })
          .eq("user_id", profile.id);

        // Reset usage for new period
        const periodStart = new Date().toISOString().slice(0, 7) + "-01";

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", profile.id)
          .single();

        const quotesLimit = sub?.plan === "pro" ? 999999 : 20;

        await supabase
          .from("usage")
          .upsert({
            user_id:      profile.id,
            period_start: periodStart,
            quotes_used:  0,
            quotes_limit: quotesLimit,
            updated_at:   new Date().toISOString(),
          }, { onConflict: "user_id,period_start" });

        break;
      }

      // Payment failed
      case "subscription.past_due":
      case "payment.failed": {
        const { customer_email } = event.data;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customer_email)
          .single();

        if (!profile) break;

        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("user_id", profile.id);

        break;
      }

      // Subscription canceled
      case "subscription.canceled": {
        const { customer_email } = event.data;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customer_email)
          .single();

        if (!profile) break;

        await supabase
          .from("subscriptions")
          .update({
            status:      "canceled",
            canceled_at: new Date().toISOString(),
            updated_at:  new Date().toISOString(),
          })
          .eq("user_id", profile.id);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[dodo webhook] error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Helpers to map price IDs back to plan/cycle
function getPlanFromPriceId(priceId: string): "basic" | "pro" {
  if (priceId === process.env.DODO_PRICE_PRO_MONTHLY || priceId === process.env.DODO_PRICE_PRO_YEARLY) return "pro";
  return "basic";
}

function getCycleFromPriceId(priceId: string): "monthly" | "yearly" {
  if (priceId === process.env.DODO_PRICE_BASIC_YEARLY || priceId === process.env.DODO_PRICE_PRO_YEARLY) return "yearly";
  return "monthly";
}