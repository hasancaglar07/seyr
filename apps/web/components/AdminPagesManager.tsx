"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Page } from "@seyir/contracts";

type PageFormState = {
  title: string;
  slug: string;
  seoDescription: string;
  content: string;
  isPublished: boolean;
};

const initialForm: PageFormState = {
  title: "",
  slug: "",
  seoDescription: "",
  content: "",
  isPublished: true,
};

export function AdminPagesManager({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<PageFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function resetForm() {
    setActiveId(null);
    setForm(initialForm);
    setStatus("idle");
    setMessage("");
  }

  function startEdit(page: Page) {
    setActiveId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      seoDescription: page.seoDescription ?? "",
      content: page.content ?? "",
      isPublished: page.isPublished,
    });
    setStatus("idle");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(activeId ? `/api/v1/admin/pages?id=${activeId}` : "/api/v1/admin/pages", {
        method: activeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Page request failed");
      }

      resetForm();
      setStatus("done");
      setMessage(activeId ? "Sayfa guncellendi." : "Sayfa olusturuldu.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Sayfa kaydi basarisiz.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu sayfa silinsin mi?")) {
      return;
    }

    setStatus("deleting");
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/pages?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Page delete failed");
      }

      if (activeId === id) {
        resetForm();
      }

      setStatus("done");
      setMessage("Sayfa silindi.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Sayfa silinemedi.");
    }
  }

  return (
    <div className="admin-columns">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Sayfalar</h2>
            <p>{pages.length} kayit</p>
          </div>
          <button type="button" className="button-secondary" onClick={resetForm}>
            Yeni Sayfa
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
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>{page.slug}</td>
                <td>{page.isPublished ? "Yayinda" : "Taslak"}</td>
                <td className="admin-row-actions">
                  <button type="button" className="button-secondary" onClick={() => startEdit(page)}>
                    Duzenle
                  </button>
                  <button type="button" className="button-danger" onClick={() => remove(page.id)}>
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
            <h2>{activeId ? "Sayfa Duzenle" : "Yeni Sayfa"}</h2>
            <p>Kurumsal, iletisim ve diger sabit icerikler burada yonetilir.</p>
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
            SEO Aciklamasi
            <textarea
              value={form.seoDescription}
              rows={3}
              onChange={(event) => setForm((current) => ({ ...current, seoDescription: event.target.value }))}
            />
          </label>
          <label>
            Icerik
            <textarea value={form.content} rows={10} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} />
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
