"use client";

const channels = [
  { id: 1, mark: "D", active: true },
  { id: 2, mark: "S", active: false },
  { id: 3, mark: "M", active: false },
  { id: 4, mark: "F", active: false },
  { id: 5, mark: "L", active: false },
  { id: 6, mark: "T", active: false },
];

export function ChannelCarousel() {
  return (
    <section className="relative z-30 mb-16 flex justify-center px-4">
      <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-white/50 bg-white/40 px-5 py-3 shadow-[0_8px_32px_rgba(31,38,135,0.1)] backdrop-blur-xl">
        <div className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Channels</div>
        <div className="h-6 w-px shrink-0 bg-slate-400/30" />

        <button className="shrink-0 text-slate-400 transition hover:text-slate-700" aria-label="Previous channels">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="no-scrollbar flex flex-1 items-center justify-center gap-3 overflow-x-auto">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={
                channel.active
                  ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-sky-500/10 text-sm font-semibold text-sky-500 ring-2 ring-sky-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/30 text-sm font-semibold text-slate-500 transition hover:bg-white/60"
              }
            >
              {channel.mark}
            </button>
          ))}
        </div>

        <button className="shrink-0 text-slate-400 transition hover:text-slate-700" aria-label="Next channels">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
