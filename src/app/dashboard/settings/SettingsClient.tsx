"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Zap, Bell, CreditCard, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  profile:      Record<string, string> | null;
  subscription: Record<string, string> | null;
  usage:        Record<string, number> | null;
}

export default function SettingsClient({ profile, subscription, usage }: Props) {
  const [fullName,   setFullName]   = useState(profile?.full_name    ?? "");
  const [company,    setCompany]    = useState(profile?.company_name  ?? "");
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState("");
  const [copied,     setCopied]     = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWeekly,setNotifWeekly]= useState(false);

  const isPro      = subscription?.plan === "pro";
  const isTrialing = subscription?.status === "trialing";
  const quotesUsed = usage?.quotes_used  ?? 0;
  const quotesLimit= usage?.quotes_limit ?? 20;

  const trialDaysLeft = subscription?.trial_ends_at
    ? Math.max(0, Math.ceil(
        (new Date(subscription.trial_ends_at).getTime() - Date.now()) / 86400000
      ))
    : 0;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .update({ full_name: fullName, company_name: company, updated_at: new Date().toISOString() })
        .eq("id", profile?.id);

      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
    setSaving(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(`quotes+${profile?.id?.slice(0, 8)}@inbound.rateifyx.com`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", maxWidth: 420,
    background: "#080808", border: "1px solid #1c1c1c",
    color: "#ede8dc", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13, padding: "10px 12px", outline: "none",
    transition: "border-color 0.15s",
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid #1c1c1c" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: 20 }}>
        {title}
      </div>
      {children}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "36px 40px", maxWidth: 680 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: 6 }}>
          Settings
        </div>
        <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
          Account Settings
        </h1>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <Field label="Email address">
          <input
            value={profile?.email ?? ""}
            disabled
            style={{ ...inputStyle, color: "#4a4a4a", cursor: "not-allowed" }}
          />
          <div style={{ fontSize: 10, color: "#2a2a2a", marginTop: 6 }}>
            Email cannot be changed — it's your login identity
          </div>
        </Field>
        <Field label="Full name">
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Jane Smith"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "#f59e0b")}
            onBlur={e  => (e.target.style.borderColor = "#1c1c1c")}
          />
        </Field>
        <Field label="Company name">
          <input
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Acme Freight LLC"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "#f59e0b")}
            onBlur={e  => (e.target.style.borderColor = "#1c1c1c")}
          />
        </Field>
        {error && (
          <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 12 }}>{error}</div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rx-btn"
          style={{ fontSize: 11, opacity: saving ? 0.7 : 1 }}
        >
          {saved ? <><Check size={13} /> Saved!</> : saving ? "Saving..." : "Save changes"}
        </button>
      </Section>

      {/* Subscription */}
      <Section title="Subscription">
        <div style={{ padding: 20, background: "#0a0a0a", border: `1px solid ${isPro ? "rgba(245,158,11,0.25)" : "#1c1c1c"}`, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Zap size={15} style={{ color: isPro ? "#f59e0b" : "#4a4a4a" }} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#ede8dc" }}>
                {isPro ? "Pro Plan" : "Basic Plan"}
              </span>
            </div>
            <span className={isPro ? "tag tag-amber" : "tag tag-gray"}>
              {isTrialing ? `TRIAL · ${trialDaysLeft}d left` : subscription?.status?.toUpperCase() ?? "ACTIVE"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Price",    isPro ? "$349/mo" : "$99/mo"],
              ["Billing",  subscription?.billing_cycle ?? "monthly"],
              ["Quotes",   isPro ? "Unlimited" : `${quotesUsed} / ${quotesLimit} this month`],
              ["Renews",   subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#080808", padding: "10px 14px", border: "1px solid #1c1c1c" }}>
                <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 12, color: "#ede8dc" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage bar */}
        {!isPro && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: "#4a4a4a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Monthly usage</span>
              <span style={{ fontSize: 10, color: "#4a4a4a" }}>{quotesUsed}/{quotesLimit}</span>
            </div>
            <div style={{ height: 4, background: "#1c1c1c", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((quotesUsed / quotesLimit) * 100, 100)}%`,
                background: quotesUsed >= quotesLimit ? "#ef4444" : quotesUsed / quotesLimit >= 0.7 ? "#f59e0b" : "#22c55e",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {!isPro && (
            <Link href="/pricing" className="rx-btn" style={{ fontSize: 11, padding: "10px 18px" }}>
              <Zap size={12} /> Upgrade to Pro
            </Link>
          )}
          <button className="rx-btn-ghost" style={{ fontSize: 11, padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
            <CreditCard size={12} /> Manage billing
          </button>
        </div>
      </Section>

      {/* Magic email */}
      <Section title="Magic Email Inbox">
        <p style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.8, marginBottom: 16 }}>
          Forward any carrier quote email to this address. We'll extract and add it to your dashboard automatically.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#080808", border: "1px solid #1c1c1c", maxWidth: 460, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#f59e0b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            quotes+{profile?.id?.slice(0, 8)}@inbound.rateifyx.com
          </span>
          <button
            onClick={copyEmail}
            style={{ background: "transparent", border: "1px solid #1c1c1c", color: copied ? "#22c55e" : "#4a4a4a", padding: "4px 10px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, display: "flex", alignItems: "center", gap: 4, flexShrink: 0, transition: "color 0.15s" }}
          >
            {copied ? <><Check size={10} /> COPIED</> : <><Copy size={10} /> COPY</>}
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          { key: "email",  label: "Batch complete",  desc: "Email when a batch finishes processing", val: notifEmail,  set: setNotifEmail },
          { key: "weekly", label: "Weekly report",   desc: "Weekly summary of quotes and savings",   val: notifWeekly, set: setNotifWeekly },
        ].map(n => (
          <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #111" }}>
            <div>
              <div style={{ fontSize: 13, color: "#ede8dc", marginBottom: 3 }}>{n.label}</div>
              <div style={{ fontSize: 11, color: "#4a4a4a" }}>{n.desc}</div>
            </div>
            <button
              onClick={() => n.set(!n.val)}
              style={{
                width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                background: n.val ? "#f59e0b" : "#1c1c1c",
                border: "1px solid #2a2a2a", cursor: "pointer",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: n.val ? 22 : 3,
                width: 16, height: 16, borderRadius: "50%",
                background: n.val ? "#080808" : "#4a4a4a",
                transition: "left 0.2s",
              }} />
            </button>
          </div>
        ))}
      </Section>

      {/* Danger zone */}
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: 20 }}>
          Danger zone
        </div>
        <div style={{ padding: 20, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
          <div style={{ fontSize: 13, color: "#ede8dc", marginBottom: 6 }}>Delete account</div>
          <div style={{ fontSize: 12, color: "#4a4a4a", marginBottom: 16, lineHeight: 1.7 }}>
            Permanently delete your account and all quote data. This cannot be undone.
          </div>
          <button className="rx-btn-ghost" style={{ fontSize: 11, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
            Delete my account
          </button>
        </div>
      </div>

    </div>
  );
}