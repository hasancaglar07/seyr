import { getPageBySlug } from "@/lib/repository";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return Response.json({ error: "Sayfa bulunamadı" }, { status: 404 });
  }

  return Response.json(page);
}