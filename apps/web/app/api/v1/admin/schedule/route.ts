import { deleteScheduleEntry, listAdminSchedule, saveScheduleEntry } from "@/lib/repository";
import { requireAdminRole } from "@/lib/admin-auth";

function getIdFromRequest(request: import("next/server").NextRequest) {
  return request.nextUrl.searchParams.get("id");
}

export async function GET(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const data = await listAdminSchedule();
  return Response.json(data);
}

export async function POST(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    const saved = await saveScheduleEntry(payload);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Yayin akisi kaydedilemedi", detail: String(error) }, { status: 400 });
  }
}

export async function PUT(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const id = getIdFromRequest(request);
  if (!id) {
    return Response.json({ error: "Yayin akisi id gereklidir" }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const saved = await saveScheduleEntry({ ...payload, id });
    return Response.json(saved);
  } catch (error) {
    return Response.json({ error: "Yayin akisi guncellenemedi", detail: String(error) }, { status: 400 });
  }
}

export async function DELETE(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const id = getIdFromRequest(request);
  if (!id) {
    return Response.json({ error: "Yayin akisi id gereklidir" }, { status: 400 });
  }

  try {
    await deleteScheduleEntry(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Yayin akisi silinemedi", detail: String(error) }, { status: 400 });
  }
}
