import { createContactMessage } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const saved = await createContactMessage(payload);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Mesaj kaydedilemedi", detail: String(error) }, { status: 400 });
  }
}