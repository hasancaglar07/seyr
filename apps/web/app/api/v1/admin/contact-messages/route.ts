import { listContactMessages } from "@/lib/repository";
import { requireAdminRole } from "@/lib/admin-auth";

export async function GET(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const data = await listContactMessages();
  return Response.json(data);
}
