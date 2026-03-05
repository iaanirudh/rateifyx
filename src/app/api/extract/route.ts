import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { canProcessQuote, incrementUsage, saveQuote, createBatch, updateBatchCount } from "@/lib/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Quota check
    const allowed = await canProcessQuote();
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Monthly quote limit reached. Upgrade to Pro for unlimited quotes.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 403 }
      );
    }

    // 3. Parse request
    const { text, carrier, batch_id } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, error: "No text provided" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { success: false, error: "Text too long (max 10,000 characters)" },
        { status: 400 }
      );
    }

    // 4. Extract with Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `You are a freight quote data extractor. Extract structured data from the provided quote message.
Return ONLY valid JSON, no markdown, no explanation, no preamble.

JSON structure:
{
  "carrier": "carrier company name",
  "origin": "City, ST (e.g. Chicago, IL)",
  "destination": "City, ST (e.g. Los Angeles, CA)",
  "price_usd": total price as number in USD (convert from other currencies),
  "transit_days": number of days as integer (use midpoint if range),
  "includes_fuel": true or false,
  "source_format": "email" | "whatsapp" | "pdf" | "excel" | "unknown",
  "confidence": "high" | "medium" | "low",
  "notes": "any caveats or conditions, empty string if none"
}`,
      messages: [{
        role: "user",
        content: carrier
          ? `Carrier hint: ${carrier}\n\nQuote:\n${text}`
          : `Quote:\n${text}`,
      }],
    });

    const raw = response.content
      .map(c => c.type === "text" ? c.text : "")
      .join("");

    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    // 5. Create batch if not provided
    let batchId = batch_id;
    if (!batchId) {
      const batch = await createBatch("paste");
      batchId = batch?.id;
    }

    // 6. Save to database
    const saved = await saveQuote({
      carrier:        parsed.carrier || carrier || "Unknown",
      origin:         parsed.origin || "Unknown",
      destination:    parsed.destination || "Unknown",
      price_usd:      Number(parsed.price_usd) || 0,
      transit_days:   Number(parsed.transit_days) || 0,
      includes_fuel:  Boolean(parsed.includes_fuel),
      source_format:  parsed.source_format || "unknown",
      confidence:     parsed.confidence || "low",
      raw_text:       text,
      notes:          parsed.notes || "",
      batch_id:       batchId,
    });

    // 7. Increment usage counter
    await incrementUsage();

    // 8. Update batch count
    if (batchId) {
      await updateBatchCount(batchId, 1);
    }

    return NextResponse.json({
      success: true,
      quote: {
        ...parsed,
        id: saved?.id,
        batch_id: batchId,
        processed_at: saved?.created_at,
      },
    });

  } catch (err) {
    console.error("/api/extract error:", err);
    return NextResponse.json(
      { success: false, error: "Extraction failed" },
      { status: 500 }
    );
  }
}