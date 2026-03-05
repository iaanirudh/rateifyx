"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { CheckCircle2, ArrowRight, Zap, Loader2 } from "lucide-react";

const PLANS = [
  {
    key:      "basic" as const,
    name:     "Basic",
    desc:     "For small freight teams getting started with quote automation.",
    monthly:  99,
    yearly:   Math.round(99 * 12 * 0.8),
    features: [
      "20 quotes per month",
      "PDF, Excel, Email parsing",
      "AI extraction engine",
      "Comparison table & CSV export",
      "Magic email address",
      "Email support",
    ],
    notIncluded: [
      "WhatsApp parsing",
      "API access",
      "Priority support",
      "Unlimited quotes",
    ],
    cta:       "Start Basic",
    highlight: false,
  },
  {
    key:      "pro" as const,
    name:     "Pro",
    desc:     "For growing operations that need speed, volume, and full automation.",
    monthly:  349,
    yearly:   Math.round(349 * 12 * 0.8),
    features: [
      "Unlimited quotes",
      "All formats incl. WhatsApp",
      "AI extraction engine",
      "Comparison table & CSV export",
      "Magic email address",
      "Full API access",
      "Webhook support",
      "Multi-currency auto-convert",
      "Priority support",
      "Team seats (up to 10)",
    ],
    notIncluded: [],
    cta:       "Start Pro",
    highlight: true,
  },
];

export default function PricingPage() {
  const [yearly,  setYearly]  = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState("");

  const handleCheckout = async (plan: "basic" | "pro") => {
    setLoading(plan);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          plan,
          cycle: yearly ? "yearly" : "monthly",
        }),
      });

      const data = await res.json();

      if (data.error === "Unauthorized") {
        // Not logged in — send to login first
        window.location.href = `/login?redirectTo=/pricing`;
        return;
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      // Redirect to DodoPayments checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <Header />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "48px 32px 64px", maxWidth: 680, margin: "0 auto" }}>
          <div className="tag tag-amber" style={{ marginBottom: 20 }}>Pricing</div>
          <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.03em", marginBottom: 16 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 14, color: "#4a4a4a", lineHeight: 1.8, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            No per-carrier fees. No setup costs. Cancel anytime.
          </p>

          {/* Yearly toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 36 }}>
            <span style={{ fontSize: 12, color: yearly ? "#4a4a4a" : "#ede8dc", transition: "color 0.2s" }}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              style={{
                width: 52, height: 28,
                background: yearly ? "#f59e0b" : "#1c1c1c",
                border: "1px solid #2a2a2a", borderRadius: 14,
                cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: yearly ? 26 : 3,
                width: 20, height: 20, borderRadius: "50%",
                background: yearly ? "#080808" : "#4a4a4a",
                transition: "left 0.2s, background 0.2s",
              }} />
            </button>
            <span style={{ fontSize: 12, color: yearly ? "#ede8dc" : "#4a4a4a", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}>
              Yearly
              <span style={{
                fontSize: 10, padding: "2px 8px", fontWeight: 600,
                background: "rgba(34,197,94,0.12)", color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.25)",
                opacity: yearly ? 1 : 0.4, transition: "opacity 0.2s",
              }}>
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ maxWidth: 600, margin: "0 auto 24px", padding: "12px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#ef4444", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Cards */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {PLANS.map((plan) => {
            const price    = yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;
            const annual   = Math.round(plan.monthly * 12 * 0.8);
            const savings  = plan.monthly * 12 - annual;
            const isLoading = loading === plan.key;

            return (
              <div
                key={plan.key}
                style={{
                  border: plan.highlight
                    ? "1px solid rgba(245,158,11,0.4)"
                    : "1px solid #1c1c1c",
                  background: plan.highlight
                    ? "rgba(245,158,11,0.03)"
                    : "#0a0a0a",
                  padding: 36,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top accent line for pro */}
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #f59e0b, transparent)" }} />
                )}

                {/* Popular badge */}
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span className="tag tag-amber">
                      <Zap size={9} style={{ display: "inline", marginRight: 3 }} />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: plan.highlight ? "#f59e0b" : "#4a4a4a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 48, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.04em" }}>
                    ${price}
                  </span>
                  <span style={{ fontSize: 13, color: "#4a4a4a", marginLeft: 4 }}>/mo</span>
                </div>

                {/* Yearly savings */}
                {yearly ? (
                  <div style={{ fontSize: 11, color: "#22c55e", marginBottom: 8 }}>
                    ${annual}/year — save ${savings}/yr
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: "#2a2a2a", marginBottom: 8 }}>
                    or ${Math.round(plan.monthly * 0.8)}/mo billed yearly
                  </div>
                )}

                <p style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.7, marginBottom: 28, marginTop: 8 }}>
                  {plan.desc}
                </p>

                {/* CTA button */}
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={isLoading}
                  className={plan.highlight ? "rx-btn" : "rx-btn-ghost"}
                  style={{
                    width: "100%", justifyContent: "center",
                    marginBottom: 32, display: "flex",
                    opacity: isLoading ? 0.8 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Redirecting...</>
                  ) : (
                    <>{plan.cta} <ArrowRight size={13} /></>
                  )}
                </button>

                {/* Features */}
                <div style={{ borderTop: "1px solid #1c1c1c", paddingTop: 24 }}>
                  <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
                    Included
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "#ede8dc" }}>
                        <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }} />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "#2a2a2a" }}>
                        <CheckCircle2 size={14} style={{ color: "#2a2a2a", flexShrink: 0, marginTop: 1 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        {/* FAQ */}
        <div style={{ maxWidth: 720, margin: "72px auto 0", padding: "0 32px" }}>
          <div className="section-label" style={{ marginBottom: 36 }}>Common questions</div>
          {[
            { q: "Can I switch plans?",            a: "Absolutely. Upgrade or downgrade anytime. Billing is prorated automatically." },
            { q: "What payment methods?",          a: "All major credit and debit cards via DodoPayments. Invoicing available on annual Pro." },
            { q: "What happens at the limit?",     a: "On Basic we pause processing and notify you. Upgrade to Pro for unlimited quotes." },
            { q: "Is my quote data private?",      a: "Yes. All data is encrypted in transit and at rest. We never share your data with carriers." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "22px 0", borderBottom: "1px solid #1c1c1c" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#ede8dc", marginBottom: 8 }}>
                {item.q}
              </div>
              <div style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.8 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}