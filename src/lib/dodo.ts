export const PLANS = {
    basic: {
      monthly: { priceId: process.env.DODO_PRICE_BASIC_MONTHLY!, amount: 99  },
      yearly:  { priceId: process.env.DODO_PRICE_BASIC_YEARLY!,  amount: 950 },
    },
    pro: {
      monthly: { priceId: process.env.DODO_PRICE_PRO_MONTHLY!, amount: 349  },
      yearly:  { priceId: process.env.DODO_PRICE_PRO_YEARLY!,  amount: 3350 },
    },
  } as const;
  
  export type PlanKey   = keyof typeof PLANS;
  export type CycleKey  = "monthly" | "yearly";
  
  export async function createCheckoutSession({
    priceId,
    customerId,
    customerEmail,
    successUrl,
    cancelUrl,
  }: {
    priceId:       string;
    customerId?:   string;
    customerEmail: string;
    successUrl:    string;
    cancelUrl:     string;
  }) {
    const res = await fetch("https://api.dodopayments.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.DODO_API_KEY}`,
      },
      body: JSON.stringify({
        price_id:       priceId,
        customer_email: customerEmail,
        customer_id:    customerId,
        success_url:    successUrl,
        cancel_url:     cancelUrl,
        mode:           "subscription",
      }),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? "Checkout session creation failed");
    }
  
    return res.json() as Promise<{ url: string; id: string }>;
  }
  
  export async function cancelSubscription(subscriptionId: string) {
    const res = await fetch(
      `https://api.dodopayments.com/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DODO_API_KEY}`,
          "Content-Type":  "application/json",
        },
      }
    );
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? "Cancellation failed");
    }
  
    return res.json();
  }
  
  export function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret:    string
  ): boolean {
    const crypto = require("crypto");
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    return `sha256=${expected}` === signature;
  }