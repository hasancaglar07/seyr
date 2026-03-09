import { getStreams } from "@/lib/repository";

export async function GET() {
  const data = await getStreams();
  return Response.json(data);
}