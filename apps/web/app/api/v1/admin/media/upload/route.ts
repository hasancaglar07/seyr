import { requireAdminRole } from "@/lib/admin-auth";

export async function POST(request: import("next/server").NextRequest) {
  const auth = await requireAdminRole(request, ["ADMIN", "EDITOR"]);
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");

  return Response.json({
    message: "Media upload scaffold",
    hasFile: Boolean(file),
    nextStep: "Upload file to Supabase Storage and save metadata into media_assets",
  });
}
