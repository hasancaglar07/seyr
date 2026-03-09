import { getPresenters } from "@/lib/repository";

export async function GET() {
  const data = await getPresenters();
  return Response.json(data);
}