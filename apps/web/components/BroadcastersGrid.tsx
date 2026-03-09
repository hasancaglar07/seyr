interface Broadcaster {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
}

export function BroadcastersGrid({ broadcasters }: { broadcasters: Broadcaster[] }) {
  return (
    <div className="relative z-30">
      <h2 className="mb-6 ml-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-800">Broadcasters</h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {broadcasters.map((person) => (
          <article key={person.id} className="group cursor-pointer text-center">
            <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-white/50 p-1 shadow-md ring-1 ring-white/60 transition-all duration-300 group-hover:ring-sky-400">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full rounded-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-2xl font-semibold text-slate-600">
                  {person.name.charAt(0)}
                </div>
              )}
            </div>

            <p className="text-xs font-medium leading-tight text-slate-800">
              {person.name}
              {person.subtitle ? <span className="block">{person.subtitle}</span> : null}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
