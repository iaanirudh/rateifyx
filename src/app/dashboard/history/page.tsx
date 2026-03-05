import { getQuotes, getUsage } from "@/lib/db";
import { Download } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  email: "✉ EMAIL", whatsapp: "💬 WAPP",
  pdf: "📄 PDF", excel: "📊 XLS", unknown: "? UNK",
};

const CONF_COLORS: Record<string, string> = {
  high: "#22c55e", medium: "#f59e0b", low: "#ef4444",
};

export default async function HistoryPage() {
  const [quotes, usage] = await Promise.all([
    getQuotes(100),
    getUsage(),
  ]);

  const quotesUsed  = usage?.quotes_used ?? 0;
  const quotesLimit = usage?.quotes_limit ?? 20;

  return (
    <div style={{ padding: "36px 40px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: 6 }}>
            History
          </div>
          <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
            Quote History
          </h1>
          <p style={{ fontSize: 12, color: "#4a4a4a", marginTop: 6 }}>
            {quotes.length} quote{quotes.length !== 1 ? "s" : ""} · {quotesUsed}/{quotesLimit} used this month
          </p>
        </div>

        {quotes.length > 0 && (
          
            href="/api/export"
            className="rx-btn-ghost"
            style={{ fontSize: 11, padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Download size={12} /> Export CSV
          </a>
        )}
      </div>

      {/* Empty state */}
      {quotes.length === 0 ? (
        <div style={{ border: "1px solid #1c1c1c", padding: "64px 32px", textAlign: "center", background: "#0a0a0a" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#ede8dc", marginBottom: 8 }}>
            No quotes yet
          </div>
          <div style={{ fontSize: 12, color: "#4a4a4a", marginBottom: 24 }}>
            Your extracted quotes will appear here
          </div>
          <a href="/dashboard/quotes" className="rx-btn" style={{ fontSize: 11 }}>
            Extract first quote
          </a>
        </div>
      ) : (
        <div style={{ border: "1px solid #1c1c1c", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Carrier", "Origin", "Destination", "Price", "Transit", "Fuel", "Source", "Confidence", "Date"].map(h => (
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
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  style={{ borderBottom: "1px solid #111" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.01)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px", color: "#ede8dc", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {q.carrier}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#4a4a4a", whiteSpace: "nowrap" }}>
                    {q.origin}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#4a4a4a", whiteSpace: "nowrap" }}>
                    {q.destination}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#ede8dc", fontWeight: 600, whiteSpace: "nowrap" }}>
                    ${Number(q.price_usd).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 14px", color: q.transit_days <= 3 ? "#22c55e" : "#ede8dc", whiteSpace: "nowrap" }}>
                    {q.transit_days}d
                  </td>
                  <td style={{ padding: "12px 14px" }}>
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
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "rgba(255,255,255,0.04)", color: "#4a4a4a", border: "1px solid #1c1c1c" }}>
                      {SOURCE_LABELS[q.source_format] ?? q.source_format}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 12, color: CONF_COLORS[q.confidence] ?? "#4a4a4a" }}>
                      {{ high: "●●●", medium: "●●○", low: "●○○" }[q.confidence] ?? "●○○"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "#2a2a2a", fontSize: 11, whiteSpace: "nowrap" }}>
                    {new Date(q.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}