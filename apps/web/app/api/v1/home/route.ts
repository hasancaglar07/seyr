import { getHomeData } from "@/lib/repository";

export async function GET() {
  const data = await getHomeData();
  return Response.json(data);
}