interface Program {
  id: string;
  title: string;
  presenter?: string;
  image?: string;
}

export function ProgramsGrid({ programs }: { programs: Program[] }) {
  return (
    <div className="relative z-30">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-800">Programs</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <article
            key={program.id}
            className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl shadow-lg transition duration-300 hover:-translate-y-1"
          >
            {program.image ? (
              <img
                src={program.image}
                alt={program.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(145deg,#0f2027,#203a43,#2c5364)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-4">
              <h3 className="text-base font-bold leading-tight text-white">{program.title}</h3>
              {program.presenter ? <p className="mt-1 text-xs text-slate-300">{program.presenter}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
