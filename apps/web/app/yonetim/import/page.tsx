import { readFile } from "node:fs/promises";
import { AdminShell } from "@/components/AdminShell";
import { LegacyImportRunner } from "@/components/LegacyImportRunner";
import { resolveWorkspacePath } from "@/lib/workspace-path";

async function readLegacyFile() {
  try {
    const path = resolveWorkspacePath("scripts", "legacy-export.json");
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as {
      fetchedAt: string;
      programs: unknown[];
      presenters: unknown[];
      scheduleHints: unknown[];
      streams: unknown[];
    };
  } catch {
    return null;
  }
}

export default async function AdminImportPage() {
  const data = await readLegacyFile();

  return (
    <main>
      <AdminShell title="Legacy Import Onay">
        {data ? (
          <>
            <div className="admin-grid">
              <article className="admin-kpi">
                <p>Export Tarihi</p>
                <h3>{new Date(data.fetchedAt).toLocaleString("tr-TR")}</h3>
              </article>
              <article className="admin-kpi">
                <p>Program</p>
                <h3>{data.programs.length}</h3>
              </article>
              <article className="admin-kpi">
                <p>Programci</p>
                <h3>{data.presenters.length}</h3>
              </article>
              <article className="admin-kpi">
                <p>Akis Satiri</p>
                <h3>{data.scheduleHints.length}</h3>
              </article>
              <article className="admin-kpi">
                <p>Stream URL</p>
                <h3>{data.streams.length}</h3>
              </article>
            </div>
            <LegacyImportRunner />
          </>
        ) : (
          <article className="admin-kpi">
            <p>Henuz legacy export yok.</p>
            <p>
              <code>pnpm import:legacy</code> komutunu calistirin, sonra bu ekrani yenileyin.
            </p>
          </article>
        )}
      </AdminShell>
    </main>
  );
}

