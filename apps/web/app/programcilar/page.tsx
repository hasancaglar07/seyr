import { BroadcastersGrid } from "@/components/BroadcastersGrid";
import { getPresenters } from "@/lib/repository";

export default async function PresentersPage() {
  const presenters = await getPresenters();
  const mapped = presenters.map((item) => {
    const parts = item.fullName.trim().split(/\s+/);
    return {
      id: item.id,
      name: parts.slice(0, 2).join(" "),
      subtitle: parts.slice(2).join(" ") || undefined,
      image: item.avatarUrl ?? undefined,
    };
  });

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          Yayıncı Kadrosu
        </h1>

        <div className="mx-auto max-w-4xl">
          <BroadcastersGrid broadcasters={mapped} />
        </div>
      </section>
    </main>
  );
}
