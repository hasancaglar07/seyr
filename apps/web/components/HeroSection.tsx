export function HeroSection({
  currentShow,
  time,
  streamUrl,
}: {
  currentShow: string;
  time: string;
  streamUrl?: string | null;
}) {
  return (
    <section className="relative z-30 pb-12 pt-12 text-center">
      <h1 className="text-5xl font-thin tracking-tight text-slate-800 drop-shadow-sm sm:text-7xl md:text-8xl">
        LIVE RADIO
      </h1>
      <p className="mt-3 text-lg font-light text-slate-800 sm:text-2xl">
        Current Show: <span className="font-medium">{currentShow}</span>
      </p>
      <p className="mt-1 text-base font-light text-slate-600 sm:text-lg">Time: {time}</p>

      <div className="mt-10">
        <a
          href={streamUrl ?? "#"}
          target={streamUrl ? "_blank" : undefined}
          rel={streamUrl ? "noreferrer" : undefined}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-gradient-to-br from-white/80 to-white/40 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.08),inset_0_0_10px_rgba(255,255,255,0.5)] transition duration-300 hover:scale-105"
        >
          <span className="inline-block h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-sky-500" />
          Listen Live
        </a>
      </div>
    </section>
  );
}
