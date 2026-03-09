import { getSchedule } from "@/lib/repository";

export async function GET() {
  const data = await getSchedule();
  return Response.json(data);
}