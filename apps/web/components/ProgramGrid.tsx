import Link from "next/link";
import type { Program } from "@seyir/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { summarizeText } from "@/lib/content";

export function ProgramGrid({ programs }: { programs: Program[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program, index) => (
        <article key={program.id} className="editorial-card program-card group p-3.5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-4">
          <div className="editorial-media aspect-[5/4] rounded-[1rem] bg-[color:rgba(15,23,42,0.05)]">
            {program.coverImageUrl ? (
              <img
                src={program.coverImageUrl}
                alt={program.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="h-full w-full bg-[color:rgba(15,23,42,0.06)]" />
            )}
          </div>

          <div className="space-y-4 px-1 pb-1 pt-5 sm:space-y-5">
            <div className="flex items-center justify-between gap-3">
              <Badge tone={program.isPublished ? "default" : "muted"}>{program.isPublished ? "Yayinda" : "Taslak"}</Badge>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:rgba(17,24,39,0.45)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold leading-tight text-[color:var(--foreground)]">{program.title}</h3>
              <p className="text-sm leading-7 text-[color:rgba(17,24,39,0.66)]">
                {summarizeText(program.summary ?? program.body, "Program ozeti yakinda guncellenecek.", 170)}
              </p>
            </div>

            <Button asChild variant="outline" className="h-9 w-full justify-center rounded-full bg-[color:rgba(255,255,255,0.54)]">
              <Link href={`/programlar/${program.slug}`}>Programi Incele</Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
