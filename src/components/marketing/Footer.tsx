"use client";

import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Features",  href: "/#features" },
    { label: "Pricing",   href: "/pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Company: [
    { label: "About",   href: "#" },
    { label: "Contact", href: "mailto:hello@rateifyx.com" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1c1c1c", background: "#080808", padding: "60px 32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#ede8dc" }}>
                Rateify<span style={{ color: "#f59e0b" }}>X</span>
              </span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--rx-text-2)", maxWidth: 260 }}>
              Normalize shipping quotes from any carrier, any format. Win more business by quoting faster.
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
              <span className="tag tag-amber">v2.1</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--rx-text-3)", marginBottom: 16 }}>{section}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} style={{ fontSize: 12, color: "var(--rx-text-2)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ede8dc")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--rx-text-2)")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #1c1c1c", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 11, color: "var(--rx-text-3)" }} suppressHydrationWarning>
            © {new Date().getFullYear()} RateifyX. All rights reserved.
          </span>
          <span style={{ fontSize: 11, color: "var(--rx-text-3)" }}>
            Built for freight operations teams.
          </span>
        </div>
      </div>
    </footer>
  );
}
