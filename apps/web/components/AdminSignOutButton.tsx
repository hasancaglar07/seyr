"use client";

import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminSignOutButton({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  async function signOut() {
    if (!enabled) {
      router.push("/");
      return;
    }

    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      router.push("/");
      return;
    }

    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  return (
    <button type="button" className="button-secondary" onClick={signOut}>
      {enabled ? "Cikis Yap" : "Anasayfa"}
    </button>
  );
}
