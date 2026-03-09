"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

function mapErrorMessage(error: string | null) {
  if (error === "auth") {
    return "Admin paneline girmek icin giris yapmaniz gerekir.";
  }

  if (error === "forbidden") {
    return "Bu hesap admin paneli icin yetkili degil.";
  }

  return null;
}

export function AdminLoginForm({ redirectTo, error }: { redirectTo: string; error: string | null }) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState(mapErrorMessage(error));

  const isDevelopmentMode = supabase === null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      router.push("/yonetim");
      router.refresh();
      return;
    }

    setStatus("loading");
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setStatus("error");
      setMessage(signInError.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <section className="auth-card">
      <h1>Admin Girisi</h1>
      <p>
        {isDevelopmentMode
          ? "Supabase env degerleri tanimli degil. Local gelistirme modunda admin paneli acik."
          : "Supabase Auth ile giris yapin. Kullaniciya admin role kaydi tanimlanmis olmalidir."}
      </p>
      <form className="admin-form admin-stack" onSubmit={submit}>
        <label>
          E-posta
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@seyirdijital.com"
            required={!isDevelopmentMode}
          />
        </label>
        <label>
          Sifre
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required={!isDevelopmentMode}
          />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Giris yapiliyor" : isDevelopmentMode ? "Admin Panele Git" : "Giris Yap"}
        </button>
      </form>
      {message ? <p className={status === "error" || error ? "err" : "ok"}>{message}</p> : null}
    </section>
  );
}
