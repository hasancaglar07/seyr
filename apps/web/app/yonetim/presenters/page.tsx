import { AdminPresentersManager } from "@/components/AdminPresentersManager";
import { AdminShell } from "@/components/AdminShell";
import { listAdminPresenters } from "@/lib/repository";

export default async function AdminPresentersPage() {
  const presenters = await listAdminPresenters();

  return (
    <main>
      <AdminShell title="Programci Yonetimi">
        <AdminPresentersManager presenters={presenters} />
      </AdminShell>
    </main>
  );
}

