import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeSlug } from "@seyir/contracts";
import { getProgramBySlug, getProgramPresenters, getSchedule } from "@/lib/repository";

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const [presenters, schedule] = await Promise.all([getProgramPresenters(program.id), getSchedule()]);
  const relatedEntries = schedule.filter((entry) => entry.programId === program.id || normalizeSlug(entry.title) === program.slug);

  return (
    <main className="pb-24">
      <section className="relative z-30 mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 lg:px-8">
        <article className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-lg backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-start">
            <div className="overflow-hidden rounded-2xl border border-white/50 bg-slate-100">
              {program.coverImageUrl ? (
                <img src={program.coverImageUrl} alt={program.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex aspect-[4/5] items-end bg-[linear-gradient(145deg,#0f2027,#203a43,#2c5364)] p-4 text-xs uppercase tracking-[0.2em] text-white/80">
                  Program
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Program Detail</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{program.title}</h1>
              <p className="mt-4 text-sm leading-8 text-slate-700">{program.summary ?? "Program ozeti bu alanda gosterilir."}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {presenters.length > 0 ? (
                  presenters.map((item) => (
                    <Link
                      key={item.id}
                      href={`/programcilar/${item.slug}`}
                      className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:bg-white"
                    >
                      {item.fullName}
                    </Link>
                  ))
                ) : (
                  <span className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                    Presenter pending
                  </span>
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-white/60 bg-white/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Program Body</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-700">
                  {program.body ?? "Bu program icin detayli metin henuz eklenmedi."}
                </p>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-10 rounded-3xl border border-white/50 bg-white/40 p-6 shadow-md backdrop-blur-md sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Yayin Slotlari</h2>
            <Link href="/yayin-akisi" className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Tum akis
            </Link>
          </div>

          <div className="grid gap-3">
            {relatedEntries.length > 0 ? (
              relatedEntries.slice(0, 10).map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{entry.title}</p>
                      <p className="text-sm text-slate-600">{entry.presenterName ?? "Seyr FM"}</p>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {entry.startsAt}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">Bu program icin yayin akisi kaydi bulunamadi.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
