import { getCurrentOrNextSchedule } from "@/lib/content";
import { getPageBySlug, getSchedule, getStreams } from "@/lib/repository";

const mockChat = [
  "Harika bir yayin, tesekkurler.",
  "Program cok keyifli gidiyor.",
  "Sesi temiz aliyoruz.",
  "Allah razi olsun.",
];

export default async function LivePage() {
  const [streams, schedule, livePage] = await Promise.all([getStreams(), getSchedule(), getPageBySlug("canli-yayin")]);
  const primary = streams[0];
  const nextEntry = getCurrentOrNextSchedule(schedule);
  const tvEmbedUrl = livePage?.content?.match(/https?:\/\/\S*tvyayini_embed\S*/i)?.[0]?.replace(/[),.;]+$/, "") ?? null;
  const appLinks = [...new Set(livePage?.content?.match(/https?:\/\/\S*(?:play\.google|apps\.apple)\S*/gi) ?? [])];

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {tvEmbedUrl ? (
          <article className="mb-8 overflow-hidden rounded-3xl border border-white/30 bg-black/70 p-3 shadow-2xl backdrop-blur-xl">
            <iframe
              title="Seyr TV Canli Yayin"
              src={tvEmbedUrl}
              className="h-[260px] w-full rounded-2xl border-0 sm:h-[360px] lg:h-[440px]"
              allow="autoplay; fullscreen"
            />
          </article>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 shadow-2xl backdrop-blur-xl md:flex">
          <div className="relative aspect-video flex-1 bg-black">
            {primary?.coverImageUrl ? (
              <img src={primary.coverImageUrl} alt={primary.name} className="h-full w-full object-cover opacity-80" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(140deg,#0f172a,#1e293b)]" />
            )}

            <span className="absolute left-4 top-4 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white animate-pulse">LIVE</span>

            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={primary?.streamUrl ?? "#"}
                target={primary?.streamUrl ? "_blank" : undefined}
                rel={primary?.streamUrl ? "noreferrer" : undefined}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition hover:bg-white/30"
              >
                <svg className="ml-1 h-6 w-6 fill-white text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </a>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <audio controls preload="none" src={primary?.streamUrl} className="audio-player" />
            </div>
          </div>

          <aside className="flex w-full flex-col border-l border-white/10 bg-white/10 p-4 backdrop-blur-md md:w-80">
            <h2 className="mb-4 text-white">Live Chat</h2>
            <div className="custom-scrollbar mb-4 flex-1 space-y-4 overflow-y-auto pr-2">
              {mockChat.map((message, index) => (
                <div key={message} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-xs font-bold text-white">
                    U{index + 1}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-sky-300">User {index + 1}</span>
                    <p className="text-sm text-slate-200">{message}</p>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="text"
              readOnly
              value="Message..."
              className="w-full rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm text-white outline-none"
            />
          </aside>
        </div>

        <article className="mt-8 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg backdrop-blur-md">
          <h3 className="text-2xl font-bold text-slate-800">Live: {nextEntry?.title ?? primary?.name ?? "Seyr FM"}</h3>
          <p className="mt-2 text-slate-600">
            {nextEntry?.presenterName ?? "Canli yayin program bilgisi ve icerik ozeti bu alanda gorunur."}
          </p>
          {appLinks.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {appLinks.map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
                >
                  {link.includes("play.google") ? "Google Play" : "App Store"}
                </a>
              ))}
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
