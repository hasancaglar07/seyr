"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ImportResult = {
  fetchedAt: string;
  programs: number;
  presenters: number;
  scheduleEntries: number;
  streams: number;
  pages: number;
};

export function LegacyImportRunner() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState("");

  async function runImport() {
    setStatus("running");
    setMessage("");

    try {
      const response = await fetch("/api/v1/admin/import", {
        method: "POST",
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail ?? "Legacy import failed");
      }

      setResult(payload);
      setStatus("done");
      setMessage("Legacy export veri katmanina aktarildi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Legacy import calismadi.");
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div>
          <h2>Legacy Aktarim</h2>
          <p>`scripts/legacy-export.json` dosyasini mevcut veri kaynagina yazar.</p>
        </div>
        <button type="button" onClick={runImport} disabled={status === "running"}>
          {status === "running" ? "Aktariliyor" : "Importu Calistir"}
        </button>
      </div>
      {message ? <p className={status === "error" ? "err" : "ok"}>{message}</p> : null}
      {result ? (
        <div className="admin-grid">
          <article className="admin-kpi">
            <p>Program</p>
            <h3>{result.programs}</h3>
          </article>
          <article className="admin-kpi">
            <p>Programci</p>
            <h3>{result.presenters}</h3>
          </article>
          <article className="admin-kpi">
            <p>Yayin Akisi</p>
            <h3>{result.scheduleEntries}</h3>
          </article>
          <article className="admin-kpi">
            <p>Stream</p>
            <h3>{result.streams}</h3>
          </article>
          <article className="admin-kpi">
            <p>Sayfa</p>
            <h3>{result.pages}</h3>
          </article>
        </div>
      ) : null}
    </section>
  );
}
