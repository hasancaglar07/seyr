import Link from "next/link";
import type { Presenter } from "@seyir/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { summarizeText } from "@/lib/content";

export function PresenterGrid({ presenters }: { presenters: Presenter[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {presenters.map((presenter, index) => (
        <article key={presenter.id} className="editorial-card presenter-card p-5 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-white/70 bg-[color:rgba(15,23,42,0.05)] p-1">
              {presenter.avatarUrl ? (
                <img src={presenter.avatarUrl} alt={presenter.fullName} className="h-full w-full rounded-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 space-y-3 pt-4">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="sky">Programci</Badge>
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:rgba(17,24,39,0.45)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-xl font-semibold leading-tight text-[color:var(--foreground)]">{presenter.fullName}</h3>
            </div>
          </div>

          <div className="mt-4 space-y-4 text-center">
            <p className="text-sm leading-7 text-[color:rgba(17,24,39,0.66)]">
              {summarizeText(presenter.bio, "Programci biyografisi guncelleniyor.", 190)}
            </p>
            <Button asChild variant="outline" className="h-9 w-full justify-center rounded-full bg-[color:rgba(255,255,255,0.54)]">
              <Link href={`/programcilar/${presenter.slug}`}>Profili Ac</Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
