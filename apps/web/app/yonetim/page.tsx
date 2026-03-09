import { AdminShell } from "@/components/AdminShell";
import { listAdminPresenters, listAdminPrograms, listAdminSchedule, listAdminStreams } from "@/lib/repository";

export default async function AdminDashboardPage() {
  const [streams, programs, presenters, schedule] = await Promise.all([
    listAdminStreams(),
    listAdminPrograms(),
    listAdminPresenters(),
    listAdminSchedule(),
  ]);

  return (
    <main>
      <AdminShell title="Dashboard">
        <div className="admin-grid">
          <article className="admin-kpi">
            <p>Aktif Stream</p>
            <h2>{streams.length}</h2>
          </article>
          <article className="admin-kpi">
            <p>Program</p>
            <h2>{programs.length}</h2>
          </article>
          <article className="admin-kpi">
            <p>Programci</p>
            <h2>{presenters.length}</h2>
          </article>
        </div>
        <article className="admin-kpi" style={{ marginTop: "1rem" }}>
          <h3>Bu Haftaki Akis Kayitlari</h3>
          <p>{schedule.length} satir yayin akisi var.</p>
        </article>
      </AdminShell>
    </main>
  );
}

