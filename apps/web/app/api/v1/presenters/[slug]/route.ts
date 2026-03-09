import { getPresenterBySlug } from "@/lib/repository";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presenter = await getPresenterBySlug(slug);

  if (!presenter) {
    return Response.json({ error: "Programcı bulunamadı" }, { status: 404 });
  }

  return Response.json(presenter);
}