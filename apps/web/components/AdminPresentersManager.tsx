"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Presenter } from "@seyir/contracts";

type PresenterFormState = {
  fullName: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  isPublished: boolean;
};

const initialForm: PresenterFormState = {
  fullName: "",
  slug: "",
  bio: "",
  avatarUrl: "",
  isPublished: true,
};

export function AdminPresentersManager({ presenters }: { presenters: Presenter[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<PresenterFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function resetForm() {
    setActiveId(null);
    setForm(initialForm);
    setStatus("idle");
    setMessage("");
  }

  function startEdit(presenter: Presenter) {
    setActiveId(presenter.id);
    setForm({
      fullName: presenter.fullName,
      slug: presenter.slug,
      bio: presenter.bio ?? "",
      avatarUrl: presenter.avatarUrl ?? "",
      isPublished: presenter.isPublished,
    });
    setStatus("idle");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(activeId ? `/api/v1/admin/presenters?id=${activeId}` : "/api/v1/admin/presenters", {
        method: activeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Presenter request failed");
      }

      resetForm();
      setStatus("done");
      setMessage(activeId ? "Programci guncellendi." : "Programci olusturuldu.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Programci kaydi basarisiz.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu programci silinsin mi?")) {
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/presenters?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Presenter delete failed");
      }

      if (activeId === id) {
        resetForm();
      }

      setStatus("done");
      setMessage("Programci silindi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Programci silinemedi.");
    }
  }

  return (
    <div className="admin-columns">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Programcilar</h2>
            <p>{presenters.length} kayit</p>
          </div>
          <button type="button" className="button-secondary" onClick={resetForm}>
            Yeni Programci
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Slug</th>
              <th>Durum</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {presenters.map((presenter) => (
              <tr key={presenter.id}>
                <td>{presenter.fullName}</td>
                <td>{presenter.slug}</td>
                <td>{presenter.isPublished ? "Yayinda" : "Taslak"}</td>
                <td className="admin-row-actions">
                  <button type="button" className="button-secondary" onClick={() => startEdit(presenter)}>
                    Duzenle
                  </button>
                  <button type="button" className="button-danger" onClick={() => remove(presenter.id)}>
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
            <h2>{activeId ? "Programci Duzenle" : "Yeni Programci"}</h2>
            <p>Programci kartlari web ve mobilde ortak kaynaktan gelir.</p>
          </div>
        </div>
        <form className="admin-form admin-stack" onSubmit={submit}>
          <label>
            Ad Soyad
            <input
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="bos birakilirsa isimden uretilir"
            />
          </label>
          <label>
            Biyografi
            <textarea value={form.bio} rows={5} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          </label>
          <label>
            Avatar URL
            <input
              value={form.avatarUrl}
              onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
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
