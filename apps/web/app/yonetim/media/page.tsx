import { AdminShell } from "@/components/AdminShell";

export default function AdminMediaPage() {
  return (
    <main>
      <AdminShell title="Medya KÃ¼tÃ¼phanesi">
        <article className="admin-kpi">
          <p>Supabase Storage bucket baÄŸlantÄ±sÄ± hazÄ±r.</p>
          <p>V1'de gÃ¶rsel yÃ¼kleme ve varlÄ±k etiketleme bu modÃ¼lden yÃ¶netilir.</p>
        </article>
      </AdminShell>
    </main>
  );
}
