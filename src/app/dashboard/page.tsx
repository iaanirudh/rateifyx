import { getProfile, getSubscription, getUsage, getQuotes } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, FileText, Clock, TrendingUp, Zap } from "lucide-react";

export default async function DashboardPage() {
  const [profile, subscription, usage, quotes] = await Promise.all([
    getProfile(),
    getSubscription(),
    getUsage(),
    getQuotes(5),
  ]);

  const firstName = profile?.full_name?.split(" ")[0]
    || profile?.email?.split("@")[0]
    || "there";

  const quotesUsed   = usage?.quotes_used ?? 0;
  const quotesLimit  = usage?.quotes_limit ?? 20;
  const quotesLeft   = quotesLimit - quotesUsed;
  const usagePct     = Math.min((quotesUsed / quotesLimit) * 100, 100);
  const isPro        = subscription?.plan === "pro";
  const isTrialing   = subscription?.status === "trialing";

  const trialDaysLeft = subscription?.trial_ends_at
    ? Math.max(0, Math.ceil(
        (new Date(subscription.trial_ends_at).getTime() - Date.now()) / 86400000
      ))
    : 0;

  const SOURCE_LABELS: Record<string, string> = {
    email: "✉ EMAIL", whatsapp: "💬 WAPP",
    pdf: "📄 PDF", excel: "📊 XLS", unknown: "? UNK",
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1100 }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: 6 }}>
            Dashboard
          </div>
          <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
            Welcome back, {firstName}
          </h1>
        </div>
        <Link href="/dashboard/quotes" className="rx-btn" style={{ fontSize: 11, padding: "10px 20px" }}>
          <Zap size={12} /> New quote
        </Link>
      </div>

      {/* Trial banner */}
      {isTrialing && trialDaysLeft > 0 && (
        <div style={{ marginBottom: 24, padding: "14px 20px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "#f59e0b" }}>
            ⚡ Free trial — <strong>{trialDaysLeft} days left</strong>
          </div>
          <Link href="/pricing" style={{ fontSize: 11, color: "#f59e0b", textDecoration: "none", border: "1px solid rgba(245,158,11,0.3)", padding: "4px 12px" }}>
            Upgrade →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          {
            label: "Quotes this month",
            value: quotesUsed.toString(),
            sub: isPro ? "Unlimited" : `${quotesLeft} remaining`,
            icon: FileText,
            color: "#f59e0b",
          },
          {
            label: "Quote limit",
            value: isPro ? "∞" : `${quotesLimit}`,
            sub: isPro ? "Pro plan" : "Basic plan",
            icon: TrendingUp,
            color: isPro ? "#22c55e" : "#4a4a4a",
          },
          {
            label: "Total quotes saved",
            value: quotes.length > 0 ? quotes.length.toString() : "0",
            sub: "All time",
            icon: Clock,
            color: "#818cf8",
          },
          {
            label: "Plan status",
            value: isTrialing ? "Trial" : subscription?.plan === "pro" ? "Pro" : "Basic",
            sub: isTrialing ? `${trialDaysLeft}d left` : "Active",
            icon: Zap,
            color: isTrialing ? "#f59e0b" : "#22c55e",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: "#0a0a0a", border: "1px solid #1c1c1c", padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 10, color: "#4a4a4a", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>
                <Icon size={14} style={{ color: s.color }} />
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 30, fontWeight: 700, color: "#ede8dc", marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "#4a4a4a" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Usage bar — only for basic */}
      {!isPro && (
        <div style={{ marginBottom: 32, padding: "20px 24px", background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#4a4a4a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Monthly usage
            </span>
            <span style={{ fontSize: 11, color: usagePct >= 90 ? "#ef4444" : "#4a4a4a" }}>
              {quotesUsed} / {quotesLimit} quotes
            </span>
          </div>
          <div style={{ height: 4, background: "#1c1c1c", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${usagePct}%`,
              background: usagePct >= 90 ? "#ef4444" : usagePct >= 70 ? "#f59e0b" : "#22c55e",
              transition: "width 0.4s ease",
              borderRadius: 2,
            }} />
          </div>
          {quotesLeft <= 5 && quotesLeft > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: "#f59e0b" }}>
              ⚠ Only {quotesLeft} quotes left this month.{" "}
              <Link href="/pricing" style={{ color: "#f59e0b" }}>Upgrade to Pro</Link> for unlimited.
            </div>
          )}
          {quotesLeft === 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: "#ef4444" }}>
              ✕ Limit reached.{" "}
              <Link href="/pricing" style={{ color: "#ef4444" }}>Upgrade to Pro</Link> to keep processing quotes.
            </div>
          )}
        </div>
      )}

      {/* Recent quotes */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="section-label" style={{ flex: 1, marginBottom: 0 }}>Recent quotes</div>
          <Link href="/dashboard/history" style={{ fontSize: 11, color: "#f59e0b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginLeft: 16 }}>
            View all <ArrowRight size={11} />
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div style={{ border: "1px solid #1c1c1c", padding: "48px 32px", textAlign: "center", background: "#0a0a0a" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📦</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#ede8dc", marginBottom: 8 }}>
              No quotes yet
            </div>
            <div style={{ fontSize: 12, color: "#4a4a4a", marginBottom: 20 }}>
              Paste a carrier quote to get started
            </div>
            <Link href="/dashboard/quotes" className="rx-btn" style={{ fontSize: 11 }}>
              Extract first quote
            </Link>
          </div>
        ) : (
          <div style={{ border: "1px solid #1c1c1c", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Carrier", "Route", "Price", "Transit", "Source", "Date"].map(h => (
                    <th key={h} style={{ background: "#0d0d0d", color: "#4a4a4a", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #1c1c1c", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid #111" }}>
                    <td style={{ padding: "12px 14px", color: "#ede8dc", fontWeight: 500 }}>{q.carrier}</td>
                    <td style={{ padding: "12px 14px", color: "#4a4a4a" }}>{q.origin} → {q.destination}</td>
                    <td style={{ padding: "12px 14px", color: "#ede8dc", fontWeight: 600 }}>${Number(q.price_usd).toFixed(2)}</td>
                    <td style={{ padding: "12px 14px", color: q.transit_days <= 3 ? "#22c55e" : "#ede8dc" }}>{q.transit_days}d</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", background: "rgba(255,255,255,0.04)", color: "#4a4a4a", border: "1px solid #1c1c1c" }}>
                        {SOURCE_LABELS[q.source_format] ?? q.source_format}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#2a2a2a", fontSize: 11 }}>
                      {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="section-label" style={{ marginBottom: 16 }}>Quick actions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Paste quote",   desc: "Any raw quote format",     href: "/dashboard/quotes",  icon: "📋" },
          { label: "Upload files",  desc: "PDF, Excel, email files",  href: "/dashboard/upload",  icon: "📄" },
          { label: "View history",  desc: "All past comparisons",     href: "/dashboard/history", icon: "📊" },
        ].map(a => (
          <Link key={a.label} href={a.href} style={{ textDecoration: "none", padding: 20, background: "#0a0a0a", border: "1px solid #1c1c1c", display: "block", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#f59e0b")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1c1c1c")}
          >
            <div style={{ fontSize: 20, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#ede8dc", marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 11, color: "#4a4a4a" }}>{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}