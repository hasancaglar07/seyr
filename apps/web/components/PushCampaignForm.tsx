"use client";

import { FormEvent, useState } from "react";

export function PushCampaignForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<"ANNOUNCEMENT" | "LIVE_START">("ANNOUNCEMENT");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");

    try {
      const response = await fetch("/api/v1/admin/push-campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, channel, sendNow: true, scheduledAt: null }),
      });

      if (!response.ok) {
        throw new Error("Campaign failed");
      }

      setStatus("done");
      setTitle("");
      setBody("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      <label>
        Baslik
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label>
        Mesaj
        <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} required />
      </label>
      <label>
        Kanal
        <select value={channel} onChange={(event) => setChannel(event.target.value as "ANNOUNCEMENT" | "LIVE_START")}>
          <option value="ANNOUNCEMENT">Duyuru</option>
          <option value="LIVE_START">Canli Yayin Basladi</option>
        </select>
      </label>
      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Gonderiliyor" : "Push Gonder"}
      </button>
      {status === "done" ? <p className="ok">Kampanya kuyruga alindi.</p> : null}
      {status === "error" ? <p className="err">Kampanya gonderilemedi.</p> : null}
    </form>
  );
}
