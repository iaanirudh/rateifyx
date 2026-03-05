"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stage = "idle" | "loading" | "sent" | "error" | "exchanging";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const params      = new URLSearchParams(window.location.search);
    const token_hash  = params.get("token_hash");
    const type        = params.get("type");
    const redirectTo  = params.get("next") ?? params.get("redirectTo") ?? "/dashboard";
    const code        = params.get("code");

    // Handle token_hash flow (most reliable)
    if (token_hash && type) {
      setStage("exchanging");
      const supabase = createClient();
      supabase.auth.verifyOtp({
        token_hash,
        type: type as "email" | "magiclink" | "signup",
      }).then(({ error }) => {
        if (!error) {
          window.location.href = redirectTo;
        } else {
          console.error("OTP verify error:", error.message);
          setError("Login link expired or already used. Request a new one.");
          setStage("error");
        }
      });
      return;
    }

    // Handle code flow as fallback
    if (code) {
      setStage("exchanging");
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          window.location.href = redirectTo;
        } else {
          console.error("Code exchange error:", error.message);
          setError("Login link expired or already used. Request a new one.");
          setStage("error");
        }
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setStage("loading");

    try {
      const supabase   = createClient();
      const params     = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo") ?? "/dashboard";

      const { error: sbError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo:  `${window.location.origin}/login?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (sbError) throw sbError;
      setStage("sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStage("error");
    }
  };

  // Exchanging / loading state
  if (stage === "exchanging") {
    return (
      <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} className="grid-bg">
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} style={{ color: "#f59e0b", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <div style={{ fontSize: 13, color: "#4a4a4a" }}>Signing you in...</div>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", flexDirection: "column" }} className="grid-bg">

      {/* Header */}
      <header style={{ padding: "24px 32px", borderBottom: "1px solid #1c1c1c" }}>
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#080808" }}>RX</span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#ede8dc" }}>
            Rateify<span style={{ color: "#f59e0b" }}>X</span>
          </span>
        </Link>
      </header>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {stage !== "sent" ? (
            <>
              <div style={{ marginBottom: 32 }}>
                <div className="tag tag-amber" style={{ marginBottom: 16 }}>Secure login</div>
                <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 28, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  Sign in to RateifyX
                </h1>
                <p style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.7 }}>
                  Enter your email and we'll send you a magic link — no password needed.
                </p>
              </div>

              <div style={{ border: "1px solid #1c1c1c", padding: 32, background: "#0a0a0a" }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: 8 }}>
                    Email address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a4a4a" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      placeholder="you@company.com"
                      disabled={stage === "loading"}
                      style={{
                        width: "100%",
                        background: "#080808",
                        border: `1px solid ${error ? "#ef4444" : "#1c1c1c"}`,
                        color: "#ede8dc",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13,
                        padding: "11px 12px 11px 36px",
                        outline: "none",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={e  => (e.target.style.borderColor = error ? "#ef4444" : "#1c1c1c")}
                    />
                  </div>
                  {error && (
                    <div style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>{error}</div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={stage === "loading"}
                  className="rx-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity: stage === "loading" ? 0.7 : 1,
                    cursor: stage === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {stage === "loading"
                    ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
                    : <>Send magic link <ArrowRight size={14} /></>
                  }
                </button>

                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1c1c1c", fontSize: 11, color: "#2a2a2a", textAlign: "center", lineHeight: 1.7 }}>
                  By signing in you agree to our{" "}
                  <Link href="/terms"   style={{ color: "#4a4a4a" }}>Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: "#4a4a4a" }}>Privacy Policy</Link>.
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#2a2a2a" }}>
                No account?{" "}
                <Link href="/pricing" style={{ color: "#f59e0b", textDecoration: "none" }}>
                  Start free trial
                </Link>
              </div>
            </>
          ) : (
            <div style={{ border: "1px solid #1c1c1c", padding: 40, background: "#0a0a0a", textAlign: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <CheckCircle2 size={24} style={{ color: "#22c55e" }} />
              </div>
              <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#ede8dc", marginBottom: 10 }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.8, marginBottom: 24 }}>
                We sent a magic link to{" "}
                <span style={{ color: "#ede8dc" }}>{email}</span>.
                <br />Click it to sign in — expires in 10 minutes.
              </p>
              <button
                onClick={() => { setStage("idle"); setError(""); setEmail(""); }}
                className="rx-btn-ghost"
                style={{ fontSize: 11 }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}