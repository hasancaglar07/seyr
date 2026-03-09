import { AdminPagesManager } from "@/components/AdminPagesManager";
import { AdminShell } from "@/components/AdminShell";
import { listPages } from "@/lib/repository";

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <main>
      <AdminShell title="Sayfa Yonetimi">
        <AdminPagesManager pages={pages} />
      </AdminShell>
    </main>
  );
}

