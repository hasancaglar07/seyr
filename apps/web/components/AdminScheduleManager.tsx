"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Program, ScheduleEntry } from "@seyir/contracts";

type ScheduleFormState = {
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  title: string;
  presenterName: string;
  programId: string;
  isReplay: boolean;
};

const initialForm: ScheduleFormState = {
  dayOfWeek: 1,
  startsAt: "09:00",
  endsAt: "",
  title: "",
  presenterName: "",
  programId: "",
  isReplay: false,
};

const dayOptions = [
  { value: 0, label: "Pazar" },
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Sali" },
  { value: 3, label: "Carsamba" },
  { value: 4, label: "Persembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
];

export function AdminScheduleManager({ entries, programs }: { entries: ScheduleEntry[]; programs: Program[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduleFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function resetForm() {
    setActiveId(null);
    setForm(initialForm);
    setStatus("idle");
    setMessage("");
  }

  function startEdit(entry: ScheduleEntry) {
    setActiveId(entry.id);
    setForm({
      dayOfWeek: entry.dayOfWeek,
      startsAt: entry.startsAt,
      endsAt: entry.endsAt ?? "",
      title: entry.title,
      presenterName: entry.presenterName ?? "",
      programId: entry.programId ?? "",
      isReplay: entry.isReplay,
    });
    setStatus("idle");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(activeId ? `/api/v1/admin/schedule?id=${activeId}` : "/api/v1/admin/schedule", {
        method: activeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Schedule request failed");
      }

      resetForm();
      setStatus("done");
      setMessage(activeId ? "Yayin akisi guncellendi." : "Yayin akisi olusturuldu.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Yayin akisi kaydi basarisiz.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu yayin akisi kaydi silinsin mi?")) {
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/schedule?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Schedule delete failed");
      }

      if (activeId === id) {
        resetForm();
      }

      setStatus("done");
      setMessage("Yayin akisi silindi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Yayin akisi silinemedi.");
    }
  }

  return (
    <div className="admin-columns">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Yayin Akisi</h2>
            <p>{entries.length} kayit</p>
          </div>
          <button type="button" className="button-secondary" onClick={resetForm}>
            Yeni Kayit
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Gun</th>
              <th>Saat</th>
              <th>Baslik</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{dayOptions.find((item) => item.value === entry.dayOfWeek)?.label ?? entry.dayOfWeek}</td>
                <td>
                  {entry.startsAt}
                  {entry.endsAt ? ` - ${entry.endsAt}` : ""}
                </td>
                <td>{entry.title}</td>
                <td className="admin-row-actions">
                  <button type="button" className="button-secondary" onClick={() => startEdit(entry)}>
                    Duzenle
                  </button>
                  <button type="button" className="button-danger" onClick={() => remove(entry.id)}>
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
            <h2>{activeId ? "Kayit Duzenle" : "Yeni Kayit"}</h2>
            <p>Akis hem web sayfasina hem mobil schedule ekranina akar.</p>
          </div>
        </div>
        <form className="admin-form admin-stack" onSubmit={submit}>
          <label>
            Gun
            <select
              value={form.dayOfWeek}
              onChange={(event) => setForm((current) => ({ ...current, dayOfWeek: Number(event.target.value) }))}
            >
              {dayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Baslangic
            <input type="time" value={form.startsAt} onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))} />
          </label>
          <label>
            Bitis
            <input type="time" value={form.endsAt} onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))} />
          </label>
          <label>
            Baslik
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </label>
          <label>
            Programci
            <input
              value={form.presenterName}
              onChange={(event) => setForm((current) => ({ ...current, presenterName: event.target.value }))}
              placeholder="opsiyonel"
            />
          </label>
          <label>
            Ilgili Program
            <select value={form.programId} onChange={(event) => setForm((current) => ({ ...current, programId: event.target.value }))}>
              <option value="">Program baglama</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-inline">
            <input
              type="checkbox"
              checked={form.isReplay}
              onChange={(event) => setForm((current) => ({ ...current, isReplay: event.target.checked }))}
            />
            <span>Tekrar yayini</span>
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
