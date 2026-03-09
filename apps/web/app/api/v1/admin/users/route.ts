import { listAdminUsers } from "@/lib/repository";
import { requireAdminRole } from "@/lib/admin-auth";

export async function GET(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN"]);
  if (!auth.ok) return auth.response;

  const data = await listAdminUsers();
  return Response.json(data);
}
