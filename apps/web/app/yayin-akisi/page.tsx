import { DAY_LABELS } from "@/lib/content";
import { getSchedule } from "@/lib/repository";

export default async function SchedulePage() {
  const entries = await getSchedule();
  const groups = DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek,
    label,
    entries: entries.filter((item) => item.dayOfWeek === dayOfWeek),
  }));

  const currentDay = new Date().getDay();
  const activeGroup = groups.find((group) => group.dayOfWeek === currentDay && group.entries.length > 0)
    ?? groups.find((group) => group.entries.length > 0)
    ?? groups[0];

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          Yayın Akışı
        </h1>

        <div className="mb-12 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/50 bg-white/40 p-1.5 shadow-sm backdrop-blur-md">
            {groups.map((group) => {
              const active = group.dayOfWeek === activeGroup.dayOfWeek;
              return (
                <span
                  key={group.dayOfWeek}
                  className={
                    active
                      ? "rounded-full bg-sky-500 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md"
                      : "rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-600"
                  }
                >
                  {group.label.slice(0, 3)}
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-4 left-[74px] top-4 hidden w-px bg-sky-200/60 md:block" />

          <div className="space-y-7">
            {activeGroup.entries.map((item) => (
              <article key={item.id} className="group relative flex items-center">
                <div className="mr-8 hidden w-[60px] text-right text-lg font-medium text-slate-600 md:block">{item.startsAt}</div>
                <div className="absolute left-[68px] hidden h-3.5 w-3.5 rounded-full border-2 border-white bg-sky-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] md:block" />

                <div className="ml-0 flex flex-1 items-center justify-between rounded-2xl border border-white/50 bg-white/40 p-4 shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-white/60 md:ml-8">
                  <div>
                    {item.isReplay ? (
                      <span className="mb-1 inline-block rounded bg-sky-100/80 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                        REPLAY
                      </span>
                    ) : null}
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{item.title}</h2>
                    <p className="text-sm text-slate-600">{item.presenterName ?? "Seyr FM"}</p>
                  </div>
                  <button className="rounded-full border border-white/60 bg-white/50 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-white/80">
                    REMIND
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
