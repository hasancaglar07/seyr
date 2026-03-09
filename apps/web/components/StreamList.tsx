import Link from "next/link";
import type { Stream } from "@seyir/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StreamList({ streams }: { streams: Stream[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {streams.map((stream, index) => (
        <article key={stream.id} className="editorial-card overflow-hidden p-3.5 sm:p-4">
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="editorial-media min-h-56 rounded-[1rem] bg-[color:rgba(15,23,42,0.05)]">
              {stream.coverImageUrl ? (
                <img src={stream.coverImageUrl} alt={stream.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[color:rgba(15,23,42,0.06)]" />
              )}
            </div>

            <div className="flex flex-col justify-between gap-5 p-1">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={stream.isLive ? "live" : "muted"}>{stream.isLive ? "Canli" : "Arsiv"}</Badge>
                  <Badge tone="sky">Kanal {String(index + 1).padStart(2, "0")}</Badge>
                </div>
                <h3 className="text-2xl font-semibold leading-tight text-[color:var(--foreground)]">{stream.name}</h3>
                <p className="text-sm leading-7 text-[color:rgba(17,24,39,0.66)]">
                  Mevcut yayin adresi korunur. Web ve mobil uygulama ayni stream kaynagiyla eszamanli calisir.
                </p>
              </div>

              <div className="rounded-[0.95rem] border border-[color:rgba(15,23,42,0.08)] bg-[color:rgba(250,250,249,0.92)] p-4">
                <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:rgba(17,24,39,0.45)]">Dinleme paneli</p>
                <audio controls preload="none" src={stream.streamUrl} className="audio-player" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild className="rounded-full px-3">
                  <Link href="/canli-yayin">Canli Ekrana Git</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="rounded-full bg-[color:rgba(255,255,255,0.54)] px-3">
                  <a href={stream.streamUrl} target="_blank" rel="noreferrer">
                    Stream URL Ac
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
