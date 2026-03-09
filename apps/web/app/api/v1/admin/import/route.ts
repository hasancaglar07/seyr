import { readFile } from "node:fs/promises";
import { importLegacySnapshot } from "@/lib/repository";
import { resolveWorkspacePath } from "@/lib/workspace-path";
import { requireAdminRole } from "@/lib/admin-auth";

export async function POST(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const legacyPath = resolveWorkspacePath("scripts", "legacy-export.json");
    const raw = await readFile(legacyPath, "utf8");
    const payload = JSON.parse(raw);
    const result = await importLegacySnapshot(payload);

    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Legacy import basarisiz", detail: String(error) }, { status: 400 });
  }
}
