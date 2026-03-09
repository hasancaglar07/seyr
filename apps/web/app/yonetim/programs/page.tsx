import { AdminProgramsManager } from "@/components/AdminProgramsManager";
import { AdminShell } from "@/components/AdminShell";
import { getProgramPresenters, listAdminPresenters, listAdminPrograms } from "@/lib/repository";

export default async function AdminProgramsPage() {
  const [programs, presenters] = await Promise.all([listAdminPrograms(), listAdminPresenters()]);
  const relations = await Promise.all(
    programs.map(async (program) => [program.id, (await getProgramPresenters(program.id)).map((presenter) => presenter.id)] as const),
  );

  return (
    <main>
      <AdminShell title="Program Yonetimi">
        <AdminProgramsManager programs={programs} presenters={presenters} programPresenterMap={Object.fromEntries(relations)} />
      </AdminShell>
    </main>
  );
}

