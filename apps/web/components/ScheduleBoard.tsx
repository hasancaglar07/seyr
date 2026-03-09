import type { ScheduleEntry } from "@seyir/contracts";
import { Badge } from "@/components/ui/badge";
import { getCurrentOrNextSchedule, groupScheduleByDay } from "@/lib/content";

export function ScheduleBoard({ entries }: { entries: ScheduleEntry[] }) {
  const days = groupScheduleByDay(entries);
  const activeEntry = getCurrentOrNextSchedule(entries);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {days.map((day) => (
        <section key={day.dayOfWeek} className="editorial-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/40 pb-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(15,23,42,0.5)]">Yayin plani</p>
              <h3 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">{day.label}</h3>
            </div>
            <Badge tone="muted">{day.entries.length} slot</Badge>
          </div>

          <div className="space-y-3">
            {day.entries.map((entry) => {
              const highlighted = activeEntry?.id === entry.id;

              return (
                <article
                  key={entry.id}
                  className={
                    highlighted
                      ? "rounded-[0.95rem] border border-[color:rgba(14,165,233,0.32)] bg-[color:rgba(255,255,255,0.42)] px-4 py-4"
                      : "rounded-[0.95rem] border border-white/45 bg-[color:rgba(255,255,255,0.28)] px-4 py-4"
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex min-w-20 items-center justify-center rounded-full border border-[color:rgba(14,165,233,0.2)] bg-[color:rgba(14,165,233,0.08)] px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-[color:rgba(15,23,42,0.72)]">
                        {entry.startsAt}
                      </span>
                      {entry.isReplay ? <Badge tone="default">Tekrar</Badge> : null}
                    </div>
                    {highlighted ? <Badge tone="live">Siradaki</Badge> : null}
                  </div>
                  <h4 className="mt-3 font-semibold text-[color:var(--foreground)]">{entry.title}</h4>
                  <p className="mt-1 text-sm leading-7 text-[color:rgba(15,23,42,0.65)]">
                    {entry.presenterName ?? "Seyr yayin akisi"}
                    {entry.endsAt ? ` • ${entry.endsAt}` : ""}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
