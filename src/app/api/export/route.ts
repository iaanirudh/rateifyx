import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/db";

export async function GET() {
  const quotes = await getQuotes(1000);

  if (!quotes.length) {
    return NextResponse.json({ error: "No quotes" }, { status: 404 });
  }

  const headers = [
    "Carrier", "Origin", "Destination", "Price (USD)",
    "Transit Days", "Fuel Included", "Source", "Confidence", "Notes", "Date",
  ];

  const rows = quotes.map(q => [
    q.carrier,
    q.origin,
    q.destination,
    Number(q.price_usd).toFixed(2),
    q.transit_days,
    q.includes_fuel ? "Yes" : "No",
    q.source_format,
    q.confidence,
    q.notes ?? "",
    new Date(q.created_at).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="rateifyx-quotes-${Date.now()}.csv"`,
    },
  });
}