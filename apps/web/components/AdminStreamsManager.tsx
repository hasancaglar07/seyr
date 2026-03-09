"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Stream } from "@seyir/contracts";

type StreamFormState = {
  name: string;
  key: string;
  streamUrl: string;
  coverImageUrl: string;
  isLive: boolean;
  orderNo: number;
};

const initialForm: StreamFormState = {
  name: "",
  key: "",
  streamUrl: "",
  coverImageUrl: "",
  isLive: false,
  orderNo: 0,
};

export function AdminStreamsManager({ streams }: { streams: Stream[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<StreamFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function resetForm() {
    setActiveId(null);
    setForm(initialForm);
    setStatus("idle");
    setMessage("");
  }

  function startEdit(stream: Stream) {
    setActiveId(stream.id);
    setForm({
      name: stream.name,
      key: stream.key,
      streamUrl: stream.streamUrl,
      coverImageUrl: stream.coverImageUrl ?? "",
      isLive: stream.isLive,
      orderNo: stream.orderNo,
    });
    setStatus("idle");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(activeId ? `/api/v1/admin/streams?id=${activeId}` : "/api/v1/admin/streams", {
        method: activeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Stream request failed");
      }

      resetForm();
      setStatus("done");
      setMessage(activeId ? "Stream guncellendi." : "Stream olusturuldu.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Stream kaydi basarisiz.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu stream silinsin mi?")) {
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/streams?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Stream delete failed");
      }

      if (activeId === id) {
        resetForm();
      }

      setStatus("done");
      setMessage("Stream silindi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Stream silinemedi.");
    }
  }

  return (
    <div className="admin-columns">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Streamler</h2>
            <p>{streams.length} kayit</p>
          </div>
          <button type="button" className="button-secondary" onClick={resetForm}>
            Yeni Stream
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Key</th>
              <th>Durum</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id}>
                <td>{stream.name}</td>
                <td>{stream.key}</td>
                <td>{stream.isLive ? "Canli" : "Pasif"}</td>
                <td className="admin-row-actions">
                  <button type="button" className="button-secondary" onClick={() => startEdit(stream)}>
                    Duzenle
                  </button>
                  <button type="button" className="button-danger" onClick={() => remove(stream.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>{activeId ? "Stream Duzenle" : "Yeni Stream"}</h2>
            <p>Canli yayin anahtarlari admin tarafindan yonetilir.</p>
          </div>
        </div>
        <form className="admin-form admin-stack" onSubmit={submit}>
          <label>
            Ad
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label>
            Key
            <input value={form.key} onChange={(event) => setForm((current) => ({ ...current, key: event.target.value }))} />
          </label>
          <label>
            Stream URL
            <input
              value={form.streamUrl}
              onChange={(event) => setForm((current) => ({ ...current, streamUrl: event.target.value }))}
              required
            />
          </label>
          <label>
            Kapak Gorseli
            <input
              value={form.coverImageUrl}
              onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label>
            Sira
            <input
              type="number"
              min={0}
              value={form.orderNo}
              onChange={(event) => setForm((current) => ({ ...current, orderNo: Number(event.target.value) }))}
            />
          </label>
          <label className="admin-inline">
            <input
              type="checkbox"
              checked={form.isLive}
              onChange={(event) => setForm((current) => ({ ...current, isLive: event.target.checked }))}
            />
            <span>Canli stream</span>
          </label>
          <div className="admin-actions">
            <button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Kaydediliyor" : activeId ? "Guncelle" : "Olustur"}
            </button>
            <button type="button" className="button-secondary" onClick={resetForm}>
              Temizle
            </button>
          </div>
          {message ? <p className={status === "error" ? "err" : "ok"}>{message}</p> : null}
        </form>
      </section>
    </div>
  );
}
