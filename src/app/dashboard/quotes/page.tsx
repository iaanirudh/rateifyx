"use client";

import { useState, useEffect } from "react";
import { ArrowRight, X, Eye, Download, RotateCcw } from "lucide-react";

interface Quote {
  id: string;
  carrier: string;
  origin: string;
  destination: string;
  price_usd: number;
  transit_days: number;
  includes_fuel: boolean;
  source_format: string;
  confidence: string;
  raw_text: string;
  notes?: string;
  processed_at?: string;
}

interface UsageInfo {
  quotes_used: number;
  quotes_limit: number;
}

const CONF_DOTS: Record<string, string>  = { high: "●●●", medium: "●●○", low: "●○○" };
const CONF_COLORS: Record<string, string> = { high: "#22c55e", medium: "#f59e0b", low: "#ef4444" };
const SOURCE_LABELS: Record<string, string> = {
  email: "✉ EMAIL", whatsapp: "💬 WAPP",
  pdf: "📄 PDF", excel: "📊 XLS", unknown: "? UNK",
};

export default function QuotesPage() {
  const [text,        setText]        = useState("");
  const [quotes,      setQuotes]      = useState<Quote[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [sortKey,     setSortKey]     = useState<"price" | "transit">("price");
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [error,       setError]       = useState("");
  const [usage,       setUsage]       = useState<UsageInfo | null>(null);
  const [batchId,     setBatchId]     = useState<string | null>(null);

  // Load usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then(r => r.json())
      .then(d => { if (d.success) setUsage(d.usage); });
  }, []);

  const quotesLeft = usage ? usage.quotes_limit - usage.quotes_used : null;
  const atLimit    = quotesLeft !== null && quotesLeft <= 0;

  const extract = async () => {
    if (!text.trim() || loading || atLimit) return;
    setLoading(true);
    setError("");

    try {
      const res  = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, batch_id: batchId }),
      });
      const data = await res.json();

      if (data.success && data.quote) {
        setQuotes(prev => [...prev, data.quote]);
        setText("");
        // Save batch id for grouping
        if (!batchId && data.quote.batch_id) setBatchId(data.quote.batch_id);
        // Update usage
        setUsage(prev => prev
          ? { ...prev, quotes_used: prev.quotes_used + 1 }
          : prev
        );
      } else if (data.code === "QUOTA_EXCEEDED") {
        setError("Monthly limit reached. Upgrade to Pro for unlimited quotes.");
      } else {
        setError(data.error || "Extraction failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const sorted = [...quotes].sort((a, b) =>
    sortKey === "price"
      ? a.price_usd - b.price_usd
      : a.transit_days - b.transit_days
  );
  const best = sorted[0]?.price_usd;

  const downloadCSV = () => {
    const rows = [
      ["Carrier","Origin","Destination","Price","Transit","Fuel","Source","Confidence"],
      ...sorted.map(q => [
        q.carrier, q.origin, q.destination,
        q.price_usd.toFixed(2), q.transit_days,
        q.includes_fuel ? "Yes" : "No",
        q.source_format, q.confidence,
      ]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a   = document.createElement("a");
    a.href    = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `quotes-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: "36px 40px" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: 6 }}>
          Quotes
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
            Quote Extractor
          </h1>
          {usage && (
            <div style={{ fontSize: 11, color: quotesLeft === 0 ? "#ef4444" : quotesLeft !== null && quotesLeft <= 5 ? "#f59e0b" : "#4a4a4a" }}>
              {usage.quotes_used} / {usage.quotes_limit} quotes used this month
            </div>
          )}
        </div>
      </div>

      {/* Limit banner */}
      {atLimit && (
        <div style={{ marginBottom: 20, padding: "14px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#ef4444" }}>
            ✕ Monthly limit reached — upgrade to keep extracting quotes
          </span>
          <a href="/pricing" className="rx-btn" style={{ fontSize: 11, padding: "8px 16px", background: "#ef4444" }}>
            Upgrade →
          </a>
        </div>
      )}

      {/* Warning when close to limit */}
      {!atLimit && quotesLeft !== null && quotesLeft <= 5 && quotesLeft > 0 && (
        <div style={{ marginBottom: 20, padding: "14px 20px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <span style={{ fontSize: 12, color: "#f59e0b" }}>
            ⚠ Only {quotesLeft} quote{quotesLeft !== 1 ? "s" : ""} left this month.{" "}
            <a href="/pricing" style={{ color: "#f59e0b" }}>Upgrade to Pro</a> for unlimited.
          </span>
        </div>
      )}

      {/* Input */}
      <div style={{ border: "1px solid #1c1c1c", padding: 24, background: "#0a0a0a", marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: 10 }}>
          Paste raw quote
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.metaKey) extract(); }}
          placeholder="Paste any carrier quote — email, WhatsApp, PDF text, Excel data..."
          disabled={atLimit}
          style={{
            width: "100%", background: "#080808",
            border: "1px solid #1c1c1c", color: "#ede8dc",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
            padding: 14, resize: "vertical", minHeight: 110,
            outline: "none", marginBottom: 12,
            opacity: atLimit ? 0.5 : 1,
            cursor: atLimit ? "not-allowed" : "text",
          }}
          onFocus={e => { if (!atLimit) e.target.style.borderColor = "#f59e0b"; }}
          onBlur={e  => (e.target.style.borderColor = "#1c1c1c")}
        />

        {error && (
          <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={extract}
            disabled={loading || !text.trim() || atLimit}
            className="rx-btn"
            style={{ fontSize: 11, padding: "10px 20px", opacity: loading || !text.trim() || atLimit ? 0.5 : 1, cursor: loading || !text.trim() || atLimit ? "not-allowed" : "pointer" }}
          >
            {loading
              ? "Extracting..."
              : <><ArrowRight size={13} /> Extract quote</>
            }
          </button>
          {text && (
            <button onClick={() => setText("")} className="rx-btn-ghost" style={{ fontSize: 11, padding: "10px 14px" }}>
              <X size={12} />
            </button>
          )}
          <span style={{ fontSize: 10, color: "#2a2a2a", marginLeft: 4 }}>
            ⌘ + Enter to extract
          </span>
        </div>
      </div>

      {/* Results table */}
      {quotes.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="section-label" style={{ flex: 1, marginBottom: 0 }}>
              {quotes.length} quote{quotes.length > 1 ? "s" : ""} extracted this session
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
              {(["price", "transit"] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  style={{
                    background: sortKey === k ? "rgba(245,158,11,0.08)" : "transparent",
                    color: sortKey === k ? "#f59e0b" : "#4a4a4a",
                    border: `1px solid ${sortKey === k ? "#f59e0b" : "#1c1c1c"}`,
                    padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  {k}
                </button>
              ))}
              <button
                onClick={downloadCSV}
                className="rx-btn-ghost"
                style={{ fontSize: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Download size={11} /> CSV
              </button>
              <button
                onClick={() => { setQuotes([]); setBatchId(null); }}
                className="rx-btn-ghost"
                style={{ fontSize: 10, padding: "6px 10px" }}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid #1c1c1c", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["#", "Carrier", "Price", "Transit", "Fuel", "Route", "Conf.", ""].map(h => (
                    <th key={h} style={{
                      background: "#0d0d0d", color: "#4a4a4a",
                      fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                      padding: "10px 14px", textAlign: "left",
                      borderBottom: "1px solid #1c1c1c", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((q, i) => {
                  const isBest = i === 0 && quotes.length > 1;
                  const diff   = best && q.price_usd !== best
                    ? (((q.price_usd - best) / best) * 100).toFixed(1)
                    : null;

                  return (
                    <tr
                      key={q.id}
                      style={{ borderBottom: "1px solid #111", background: isBest ? "rgba(34,197,94,0.03)" : "transparent" }}
                    >
                      <td style={{ padding: "11px 14px", color: "#2a2a2a", fontSize: 11, borderLeft: isBest ? "2px solid #22c55e" : "2px solid transparent" }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ color: "#ede8dc", fontWeight: 500 }}>{q.carrier}</span>
                        {isBest && (
                          <span style={{ marginLeft: 8, fontSize: 9, padding: "2px 6px", background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                            BEST
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: isBest ? "#22c55e" : "#ede8dc" }}>
                          ${Number(q.price_usd).toFixed(2)}
                        </span>
                        {diff && (
                          <span style={{ fontSize: 10, color: "#ef4444", marginLeft: 6 }}>+{diff}%</span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px", color: q.transit_days <= 3 ? "#22c55e" : "#ede8dc" }}>
                        {q.transit_days}d
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 2,
                          ...(q.includes_fuel
                            ? { color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }
                            : { color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }
                          ),
                        }}>
                          {q.includes_fuel ? "YES" : "NO"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", color: "#4a4a4a", fontSize: 11, whiteSpace: "nowrap" }}>
                        {q.origin} → {q.destination}
                      </td>
                      <td style={{ padding: "11px 14px", color: CONF_COLORS[q.confidence] ?? "#4a4a4a" }}>
                        {CONF_DOTS[q.confidence] ?? "●○○"}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <button
                          onClick={() => setActiveQuote(q)}
                          style={{
                            background: "transparent", border: "1px solid #1c1c1c",
                            color: "#4a4a4a", padding: "4px 10px", cursor: "pointer",
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <Eye size={10} /> VIEW
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Raw quote slide-out panel */}
      {activeQuote && (
        <>
          <div
            onClick={() => setActiveQuote(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
          />
          <div style={{
            position: "fixed", right: 0, top: 0, bottom: 0, width: 400,
            background: "#0a0a0a", borderLeft: "2px solid #f59e0b",
            zIndex: 100, display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1c1c1c", background: "#0d0d0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#ede8dc" }}>{activeQuote.carrier}</div>
                <div style={{ fontSize: 10, color: "#4a4a4a", marginTop: 2 }}>
                  {SOURCE_LABELS[activeQuote.source_format] ?? "RAW SOURCE"}
                </div>
              </div>
              <button
                onClick={() => setActiveQuote(null)}
                style={{ background: "transparent", border: "1px solid #1c1c1c", color: "#4a4a4a", padding: "4px 8px", cursor: "pointer" }}
              >
                <X size={12} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 20, fontSize: 12, lineHeight: 1.8, color: "#4a4a4a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {activeQuote.raw_text}
            </div>

            <div style={{ padding: "16px 20px", borderTop: "1px solid #1c1c1c", background: "#0d0d0d" }}>
              <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.15em", marginBottom: 10 }}>EXTRACTED DATA</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Price",      `$${Number(activeQuote.price_usd).toFixed(2)}`],
                  ["Transit",    `${activeQuote.transit_days}d`],
                  ["Fuel",       activeQuote.includes_fuel ? "Included" : "Not included"],
                  ["Confidence", activeQuote.confidence],
                  ["Route",      `${activeQuote.origin} → ${activeQuote.destination}`],
                  ["Source",     SOURCE_LABELS[activeQuote.source_format] ?? activeQuote.source_format],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#080808", padding: "8px 12px", border: "1px solid #1c1c1c" }}>
                    <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12, color: "#ede8dc", fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              {activeQuote.notes && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "#080808", border: "1px solid #1c1c1c" }}>
                  <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.6 }}>{activeQuote.notes}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}