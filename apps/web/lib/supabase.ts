import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl() {
  return supabaseUrl;
}

export function getSupabasePublishableKey() {
  return supabasePublishableKey;
}

export function getPublicSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false },
  });
}

export function getServiceSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function hasSupabaseServiceRoleConfig(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}
