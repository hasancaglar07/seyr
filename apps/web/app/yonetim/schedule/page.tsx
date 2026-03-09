import { AdminScheduleManager } from "@/components/AdminScheduleManager";
import { AdminShell } from "@/components/AdminShell";
import { listAdminPrograms, listAdminSchedule } from "@/lib/repository";

export default async function AdminSchedulePage() {
  const [entries, programs] = await Promise.all([listAdminSchedule(), listAdminPrograms()]);

  return (
    <main>
      <AdminShell title="Yayin Akisi Yonetimi">
        <AdminScheduleManager entries={entries} programs={programs} />
      </AdminShell>
    </main>
  );
}

