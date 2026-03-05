import { NextResponse } from "next/server";
import { getUsage } from "@/lib/db";

export async function GET() {
  try {
    const usage = await getUsage();
    if (!usage) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, usage });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}