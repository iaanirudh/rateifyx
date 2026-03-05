"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Features", href: "/#features" },
  { label: "Pricing",  href: "/pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: "1px solid #1c1c1c",
      background: "rgba(8,8,8,0.92)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#ede8dc", letterSpacing: "0.05em" }}>
            Rateify<span style={{ color: "#f59e0b" }}>X</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {NAV.map(n => (
            <Link key={n.label} href={n.href} style={{ fontSize: 12, letterSpacing: "0.06em", color: "var(--rx-text-2)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ede8dc")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--rx-text-2)")}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/pricing" className="rx-btn" style={{ padding: "8px 18px", fontSize: 11 }}>
            LogIn
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ede8dc", display: "none", padding: 4 }}
            className="show-mobile"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div style={{ borderTop: "1px solid #1c1c1c", background: "#080808", padding: "16px 32px 20px" }}>
          {NAV.map(n => (
            <Link key={n.label} href={n.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 13, color: "var(--rx-text-2)", textDecoration: "none", borderBottom: "1px solid #111", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
