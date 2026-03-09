import { createPushCampaign, listPushCampaigns } from "@/lib/repository";
import { requireAdminRole } from "@/lib/admin-auth";

export async function GET(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const data = await listPushCampaigns();
  return Response.json(data);
}

export async function POST(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN"]);
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    const saved = await createPushCampaign(payload);

    // V1: burada gerçek Expo push dispatch kuyruğuna entegre edilecek.
    return Response.json({ ...saved, transport: "expo-notifications (queued)" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Push campaign oluşturulamadı", detail: String(error) }, { status: 400 });
  }
}
