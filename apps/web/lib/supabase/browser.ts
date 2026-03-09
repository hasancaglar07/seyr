"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseConfig } from "@/lib/supabase";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabaseClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (!browserClient) {
    const url = getSupabaseUrl();
    const key = getSupabasePublishableKey();

    if (!url || !key) {
      return null;
    }

    browserClient = createBrowserClient(url, key);
  }

  return browserClient;
}
