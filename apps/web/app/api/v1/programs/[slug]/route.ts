import { getProgramBySlug, getProgramPresenters } from "@/lib/repository";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return Response.json({ error: "Program bulunamadı" }, { status: 404 });
  }

  const presenters = await getProgramPresenters(program.id);
  return Response.json({ ...program, presenters });
}