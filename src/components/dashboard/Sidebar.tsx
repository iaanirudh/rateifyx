"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Upload,
  History, Settings, LogOut, ChevronRight, Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Overview", href: "/dashboard",          icon: LayoutDashboard },
  { label: "Quotes",   href: "/dashboard/quotes",   icon: FileText },
  { label: "Upload",   href: "/dashboard/upload",   icon: Upload },
  { label: "History",  href: "/dashboard/history",  icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface UsageInfo {
  quotes_used:  number;
  quotes_limit: number;
  plan:         string;
  status:       string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [usage,  setUsage]  = useState<UsageInfo | null>(null);
  const [email,  setEmail]  = useState("");

  useEffect(() => {
    // Get logged in user email
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? "");
    });

    // Get usage + plan
    fetch("/api/sidebar")
      .then(r => r.json())
      .then(d => { if (d.success) setUsage(d.data); });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isPro      = usage?.plan === "pro";
  const isTrialing = usage?.status === "trialing";
  const pct        = usage
    ? Math.min((usage.quotes_used / usage.quotes_limit) * 100, 100)
    : 0;
  const barColor   = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <aside style={{
      width: 224,
      background: "#0a0a0a",
      borderRight: "1px solid #1c1c1c",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>

      {/* Logo */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #1c1c1c" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#080808" }}>RX</span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#ede8dc" }}>
            Rateify<span style={{ color: "#f59e0b" }}>X</span>
          </span>
        </Link>
      </div>

      {/* Plan badge */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #1c1c1c" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px",
          background: isPro ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${isPro ? "rgba(245,158,11,0.2)" : "#1c1c1c"}`,
        }}>
          <Zap size={11} style={{ color: isPro ? "#f59e0b" : "#4a4a4a" }} />
          <span style={{ fontSize: 10, color: isPro ? "#f59e0b" : "#4a4a4a", fontWeight: 600, letterSpacing: "0.1em" }}>
            {isPro ? "PRO PLAN" : isTrialing ? "TRIAL" : "BASIC PLAN"}
          </span>
          {!isPro && (
            <Link href="/pricing" style={{ marginLeft: "auto", fontSize: 9, color: "#f59e0b", textDecoration: "none", letterSpacing: "0.05em" }}>
              UPGRADE
            </Link>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#2a2a2a", textTransform: "uppercase", padding: "8px 20px 4px" }}>
          Navigation
        </div>
        {NAV.map((item) => {
          const Icon   = item.icon;
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px", textDecoration: "none",
                background: active ? "rgba(245,158,11,0.07)" : "transparent",
                borderLeft: active ? "2px solid #f59e0b" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={14} style={{ color: active ? "#f59e0b" : "#4a4a4a", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: active ? "#ede8dc" : "#4a4a4a", fontWeight: active ? 500 : 400, flex: 1 }}>
                {item.label}
              </span>
              {active && <ChevronRight size={11} style={{ color: "#f59e0b" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Usage bar — basic only */}
      {!isPro && usage && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1c1c1c" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Monthly quotes
            </span>
            <span style={{ fontSize: 9, color: pct >= 90 ? "#ef4444" : "#2a2a2a" }}>
              {usage.quotes_used}/{usage.quotes_limit}
            </span>
          </div>
          <div style={{ height: 3, background: "#1c1c1c", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: barColor, borderRadius: 2,
              transition: "width 0.4s ease",
            }} />
          </div>
          {pct >= 90 && (
            <div style={{ marginTop: 6, fontSize: 9, color: "#ef4444" }}>
              Almost at limit —{" "}
              <Link href="/pricing" style={{ color: "#ef4444" }}>upgrade</Link>
            </div>
          )}
        </div>
      )}

      {/* User + logout */}
      <div style={{ borderTop: "1px solid #1c1c1c" }}>
        {email && (
          <div style={{ padding: "10px 20px", fontSize: 10, color: "#2a2a2a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", width: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            transition: "background 0.15s", borderTop: "1px solid #111",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={13} style={{ color: "#4a4a4a" }} />
          <span style={{ fontSize: 12, color: "#4a4a4a" }}>Log out</span>
        </button>
      </div>
    </aside>
  );
}