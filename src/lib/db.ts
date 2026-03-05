import { createClient } from "@/lib/supabase/server";

// =============================================
// PROFILE
// =============================================
export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateProfile(updates: {
  full_name?: string;
  company_name?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  return data;
}

// =============================================
// SUBSCRIPTION
// =============================================
export async function getSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

// =============================================
// USAGE
// =============================================
export async function getUsage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const periodStart = new Date();
  periodStart.setDate(1);
  const period = periodStart.toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage")
    .select("*")
    .eq("user_id", user.id)
    .eq("period_start", period)
    .single();

  return data;
}

export async function canProcessQuote(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .rpc("can_process_quote", { p_user_id: user.id });

  return data ?? false;
}

export async function incrementUsage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc("increment_quote_usage", { p_user_id: user.id });
}

// =============================================
// QUOTES
// =============================================
export async function getQuotes(limit = 50) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("quotes")
    .select("*, quote_batches(name, source)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function saveQuote(quote: {
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
  batch_id?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("quotes")
    .insert({ ...quote, user_id: user.id })
    .select()
    .single();

  return data;
}

export async function deleteQuote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("quotes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
}

// =============================================
// BATCHES
// =============================================
export async function createBatch(source: "paste" | "upload" | "email" | "api") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("quote_batches")
    .insert({ user_id: user.id, source })
    .select()
    .single();

  return data;
}

export async function updateBatchCount(id: string, count: number) {
  const supabase = await createClient();

  await supabase
    .from("quote_batches")
    .update({ quote_count: count })
    .eq("id", id);
}