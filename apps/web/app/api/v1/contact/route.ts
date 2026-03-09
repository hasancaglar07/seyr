import { getContactSettings } from "@/lib/repository";

export async function GET() {
  const data = await getContactSettings();
  return Response.json(data);
}