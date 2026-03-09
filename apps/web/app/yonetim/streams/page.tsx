import { AdminShell } from "@/components/AdminShell";
import { AdminStreamsManager } from "@/components/AdminStreamsManager";
import { listAdminStreams } from "@/lib/repository";

export default async function AdminStreamsPage() {
  const streams = await listAdminStreams();

  return (
    <main>
      <AdminShell title="Stream Yonetimi">
        <AdminStreamsManager streams={streams} />
      </AdminShell>
    </main>
  );
}

