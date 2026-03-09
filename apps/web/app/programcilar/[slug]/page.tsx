import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeSlug } from "@seyir/contracts";
import { getPresenterBySlug, getPresenterPrograms, getSchedule } from "@/lib/repository";

export default async function PresenterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presenter = await getPresenterBySlug(slug);

  if (!presenter) {
    notFound();
  }

  const [programs, schedule] = await Promise.all([getPresenterPrograms(presenter.id), getSchedule()]);
  const relatedEntries = schedule.filter((entry) => entry.presenterName && normalizeSlug(entry.presenterName) === presenter.slug);

  return (
    <main className="pb-24">
      <section className="relative z-30 mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 lg:px-8">
        <article className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-lg backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-start">
            <div className="overflow-hidden rounded-2xl border border-white/50 bg-slate-100">
              {presenter.avatarUrl ? (
                <img src={presenter.avatarUrl} alt={presenter.fullName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex aspect-[4/5] items-end bg-[linear-gradient(140deg,#0f2027,#203a43,#2c5364)] p-4 text-xs uppercase tracking-[0.2em] text-white/80">
                  Presenter
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Broadcaster Profile</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{presenter.fullName}</h1>
              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-700">
                {presenter.bio ?? "Biyografi metni bu alanda yer alir."}
              </p>

              <div className="mt-8 rounded-2xl border border-white/60 bg-white/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Programs</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {programs.length > 0 ? (
                    programs.map((item) => (
                      <Link
                        key={item.id}
                        href={`/programlar/${item.slug}`}
                        className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:bg-white"
                      >
                        {item.title}
                      </Link>
                    ))
                  ) : (
                    <span className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                      Program pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-10 rounded-3xl border border-white/50 bg-white/40 p-6 shadow-md backdrop-blur-md sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Yayinda Gorunen Slotlar</h2>
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
                      <p className="text-sm text-slate-600">{entry.presenterName}</p>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {entry.startsAt}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">Bu programci icin yayin akisi kaydi bulunamadi.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
