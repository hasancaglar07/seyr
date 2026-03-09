import { getPrograms } from "@/lib/repository";

export async function GET() {
  const data = await getPrograms();
  return Response.json(data);
}