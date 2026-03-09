import { getContactSettings, updateContactSettings } from "@/lib/repository";
import { requireAdminRole } from "@/lib/admin-auth";

export async function GET(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const data = await getContactSettings();
  return Response.json(data);
}

export async function PUT(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    const saved = await updateContactSettings(payload);
    return Response.json(saved);
  } catch (error) {
    return Response.json({ error: "Iletisim ayarlari guncellenemedi", detail: String(error) }, { status: 400 });
  }
}
