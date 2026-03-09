import { ProgramsGrid } from "@/components/ProgramsGrid";
import { getPrograms } from "@/lib/repository";

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const mapped = programs.map((item) => ({
    id: item.id,
    title: item.title,
    presenter: item.summary ?? "Seyr FM",
    image: item.coverImageUrl ?? undefined,
  }));

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          İçerik Kataloğu
        </h1>

        <ProgramsGrid programs={mapped} />
      </section>
    </main>
  );
}
