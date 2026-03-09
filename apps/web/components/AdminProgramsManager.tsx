"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Presenter, Program } from "@seyir/contracts";

type ProgramFormState = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  coverImageUrl: string;
  isPublished: boolean;
  presenterIds: string[];
};

const initialForm: ProgramFormState = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  coverImageUrl: "",
  isPublished: true,
  presenterIds: [],
};

export function AdminProgramsManager({
  programs,
  presenters,
  programPresenterMap,
}: {
  programs: Program[];
  presenters: Presenter[];
  programPresenterMap: Record<string, string[]>;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function startCreate() {
    setActiveId(null);
    setForm(initialForm);
    setStatus("idle");
    setMessage("");
  }

  function startEdit(program: Program) {
    setActiveId(program.id);
    setForm({
      title: program.title,
      slug: program.slug,
      summary: program.summary ?? "",
      body: program.body ?? "",
      coverImageUrl: program.coverImageUrl ?? "",
      isPublished: program.isPublished,
      presenterIds: programPresenterMap[program.id] ?? [],
    });
    setStatus("idle");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(activeId ? `/api/v1/admin/programs?id=${activeId}` : "/api/v1/admin/programs", {
        method: activeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Program request failed");
      }

      setActiveId(null);
      setForm(initialForm);
      setStatus("done");
      setMessage(activeId ? "Program guncellendi." : "Program olusturuldu.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Program kaydi basarisiz.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu program silinsin mi?")) {
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/programs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      if (activeId === id) {
        startCreate();
      }

      setStatus("done");
      setMessage("Program silindi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Program silinemedi.");
    }
  }

  function togglePresenter(presenterId: string) {
    setForm((current) => ({
      ...current,
      presenterIds: current.presenterIds.includes(presenterId)
        ? current.presenterIds.filter((item) => item !== presenterId)
        : [...current.presenterIds, presenterId],
    }));
  }

  return (
    <div className="admin-columns">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Programlar</h2>
            <p>{programs.length} kayit</p>
          </div>
          <button type="button" className="button-secondary" onClick={startCreate}>
            Yeni Program
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Baslik</th>
              <th>Slug</th>
              <th>Durum</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>{program.title}</td>
                <td>{program.slug}</td>
                <td>{program.isPublished ? "Yayinda" : "Taslak"}</td>
                <td className="admin-row-actions">
                  <button type="button" className="button-secondary" onClick={() => startEdit(program)}>
                    Duzenle
                  </button>
                  <button type="button" className="button-danger" onClick={() => remove(program.id)}>
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
            <h2>{activeId ? "Program Duzenle" : "Yeni Program"}</h2>
            <p>Mobil ve web ayni API yuzeyini tuketir.</p>
          </div>
        </div>
        <form className="admin-form admin-stack" onSubmit={submit}>
          <label>
            Baslik
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="bos birakilirsa basliktan uretilir"
            />
          </label>
          <label>
            Ozet
            <textarea value={form.summary} rows={3} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
          </label>
          <label>
            Icerik
            <textarea value={form.body} rows={6} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} />
          </label>
          <label>
            Kapak Gorseli
            <input
              value={form.coverImageUrl}
              onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <fieldset className="admin-fieldset">
            <legend>Programcilar</legend>
            <div className="admin-checkbox-grid">
              {presenters.map((presenter) => (
                <label key={presenter.id} className="admin-inline">
                  <input
                    type="checkbox"
                    checked={form.presenterIds.includes(presenter.id)}
                    onChange={() => togglePresenter(presenter.id)}
                  />
                  <span>{presenter.fullName}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="admin-inline">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
            />
            <span>Yayinda</span>
          </label>
          <div className="admin-actions">
            <button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Kaydediliyor" : activeId ? "Guncelle" : "Olustur"}
            </button>
            <button type="button" className="button-secondary" onClick={startCreate}>
              Temizle
            </button>
          </div>
          {message ? <p className={status === "error" ? "err" : "ok"}>{message}</p> : null}
        </form>
      </section>
    </div>
  );
}
