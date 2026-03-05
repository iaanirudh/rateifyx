"use client";

import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import {
  Zap, FileText, BarChart3, Mail, Upload, CheckCircle2,
  ArrowRight, Clock, TrendingUp, Shield, Globe
} from "lucide-react";

const FEATURES = [
  {
    icon: <FileText size={20} />,
    title: "Any format, zero setup",
    desc: "PDF, Excel, email, WhatsApp — paste or forward it. RateifyX reads it all without configuration.",
  },
  {
    icon: <Zap size={20} />,
    title: "AI-powered extraction",
    desc: "Claude extracts price, route, transit time, and fuel surcharge from any messy carrier quote instantly.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Instant comparison table",
    desc: "Every quote normalized to the same structure. Sort by price or speed. Decide in seconds.",
  },
  {
    icon: <Mail size={20} />,
    title: "Magic email address",
    desc: "Forward any quote to your RateifyX inbox. It processes automatically and updates your dashboard.",
  },
  {
    icon: <Upload size={20} />,
    title: "Batch file upload",
    desc: "Drop 10 PDFs at once. All parsed, normalized, and ready for comparison within moments.",
  },
  {
    icon: <Globe size={20} />,
    title: "Multi-currency support",
    desc: "Carriers quoting in EUR, GBP, or CAD? We convert everything to USD at mid-market rates.",
  },
];

const STATS = [
  { val: "10x", label: "Faster quoting" },
  { val: "40+", label: "Carrier formats" },
  { val: "2 min", label: "Avg. comparison time" },
  { val: "99.9%", label: "Uptime SLA" },
];

const HOW = [
  { step: "01", title: "Receive quotes", desc: "Get quotes from any carrier in any format — email, PDF, Excel, WhatsApp screenshot." },
  { step: "02", title: "Forward or upload", desc: "Forward to your RateifyX address, upload files, or paste raw text directly." },
  { step: "03", title: "Compare instantly", desc: "See every quote normalized in a clean table. Pick the best rate and book." },
];

export default function HomePage() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section className="grid-bg" style={{ paddingTop: 160, paddingBottom: 120, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <div className="tag tag-amber" style={{ marginBottom: 24 }}>
            ⚡ Freight intelligence, automated
          </div>

          <h1 style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#ede8dc",
            marginBottom: 24,
          }}>
            Quote faster.<br />
            <span style={{ color: "#f59e0b" }}>Win more freight.</span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--rx-text-2)", maxWidth: 560, margin: "0 auto 40px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            RateifyX normalizes shipping quotes from 40+ carriers across any format — PDF, email, Excel, WhatsApp — into one clean comparison table. Instantly.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pricing" className="rx-btn" style={{ fontSize: 13, padding: "14px 32px" }}>
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/#features" className="rx-btn-ghost" style={{ fontSize: 13, padding: "14px 32px" }}>
              See how it works
            </Link>
          </div>
        </div>

        {/* Terminal preview */}
        <div style={{ maxWidth: 900, margin: "72px auto 0", padding: "0 32px" }}>
          <div style={{ border: "1px solid #1c1c1c", borderRadius: 4, overflow: "hidden", background: "#0a0a0a" }} className="glow-amber">
            <div style={{ background: "#0f0f0f", padding: "12px 16px", borderBottom: "1px solid #1c1c1c", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ marginLeft: 12, fontSize: 11, color: "var(--rx-text-3)" }}>rateifyx — quote comparison</span>
            </div>
            <div style={{ padding: 24, textAlign: "left" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["#", "Carrier", "Source", "Price", "Transit", "Fuel"].map(h => (
                      <th key={h} style={{ color: "var(--rx-text-3)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #1c1c1c" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["01", "XPO Logistics",  "✉ EMAIL", "$1,753", "3d", true,  true],
                    ["02", "DSV Road",        "📄 PDF",  "$1,699", "3d", true,  false],
                    ["03", "Maersk Freight",  "✉ EMAIL", "$1,847", "4d", false, false],
                    ["04", "FedEx Freight",   "💬 WAPP", "$1,790", "3d", true,  false],
                    ["05", "DB Schenker",     "📄 PDF",  "$1,838", "4d", true,  false],
                  ].map(([num, carrier, src, price, transit, fuel, best]) => (
                    <tr key={String(num)} style={{ background: best ? "rgba(34,197,94,0.04)" : "transparent" }}>
                      <td style={{ padding: "10px 12px", color: "var(--rx-text-3)", fontSize: 11, borderLeft: best ? "2px solid #22c55e" : "2px solid transparent" }}>{num}</td>
                      <td style={{ padding: "10px 12px", color: best ? "#22c55e" : "#ede8dc", fontWeight: best ? 600 : 400 }}>
                        {String(carrier)}
                        {best && <span style={{ marginLeft: 8, fontSize: 9, padding: "2px 6px", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>BEST</span>}
                      </td>
                      <td style={{ padding: "10px 12px", color: "var(--rx-text-2)", fontSize: 11 }}>{String(src)}</td>
                      <td style={{ padding: "10px 12px", color: best ? "#22c55e" : "#ede8dc", fontWeight: 600 }}>{String(price)}</td>
                      <td style={{ padding: "10px 12px", color: "#ede8dc" }}>{String(transit)}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 10, padding: "2px 8px", ...(fuel ? { color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" } : { color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }) }}>
                          {fuel ? "YES" : "NO"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #1c1c1c", borderBottom: "1px solid #1c1c1c", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: "center", padding: "16px 24px", borderRight: i < 3 ? "1px solid #1c1c1c" : "none" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 36, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--rx-text-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: 20 }}>Features</div>
            <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
              Everything your quote desk needs
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: "1px solid #1c1c1c" }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} style={{ padding: 32, background: "#0a0a0a", borderRight: (i + 1) % 3 !== 0 ? "1px solid #1c1c1c" : "none", borderBottom: i < 3 ? "1px solid #1c1c1c" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#0d0d0d")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0a0a0a")}
              >
                <div style={{ color: "#f59e0b", marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#ede8dc", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--rx-text-2)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 32px", borderTop: "1px solid #1c1c1c", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: 20 }}>How it works</div>
            <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
              From inbox to decision in 2 minutes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {HOW.map((h, i) => (
              <div key={h.step} style={{ position: "relative" }}>
                {i < 2 && (
                  <div style={{ position: "absolute", top: 20, left: "calc(100% - 20px)", width: 40, height: 1, background: "#1c1c1c", zIndex: 1 }} />
                )}
                <div style={{ fontSize: 48, fontWeight: 700, color: "#1c1c1c", marginBottom: 16, fontFamily: "'IBM Plex Sans', sans-serif" }}>{h.step}</div>
                <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#ede8dc", marginBottom: 10 }}>{h.title}</h3>
                <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--rx-text-2)" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", border: "1px solid #1c1c1c", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="tag tag-amber" style={{ marginBottom: 20 }}>Start today</div>
          <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "#ede8dc", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Ready to quote in 2 minutes<br />instead of 2 hours?
          </h2>
          <p style={{ fontSize: 13, color: "var(--rx-text-2)", marginBottom: 32, lineHeight: 1.8 }}>
            Join freight teams already saving hours every day.
          </p>
          <Link href="/pricing" className="rx-btn" style={{ fontSize: 13, padding: "14px 36px" }}>
            View pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
