import { getPageBySlug } from "@/lib/repository";
import { splitParagraphs } from "@/lib/content";

const cards = [
  {
    title: "Misyon",
    body: "Topluma faydali, dogru ve guvenilir icerikler ureterek kulturel mirasi gelecege tasimak.",
  },
  {
    title: "Vizyon",
    body: "Dijital yayincilikta oncu, yenilikci ve tercih edilen platform olmak.",
  },
  {
    title: "Degerler",
    body: "Tarafsizlik, kalite, samimiyet ve dinleyici odakli yayin anlayisi.",
  },
];

export default async function CorporatePage() {
  const page = await getPageBySlug("kurumsal");
  const paragraphs = splitParagraphs(page?.content).slice(0, 2);

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          Seyr Dijital
          <br />
          Geleceğe Ses
        </h1>

        <article className="mt-10 rounded-3xl border border-white/50 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
          {(paragraphs.length > 0 ? paragraphs : ["Seyr FM; kultur, sanat, tasavvuf ve sohbet iceriklerini dinleyiciye duzenli bir yayin akisiyla sunar."])
            .map((text) => (
              <p key={text.slice(0, 24)} className="text-base leading-8 text-slate-700 sm:text-lg">
                {text}
              </p>
            ))}
        </article>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 9 9" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">{card.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
