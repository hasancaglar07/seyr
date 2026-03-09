import { ContactForm } from "@/components/ContactForm";
import { getContactSettings } from "@/lib/repository";

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <main className="pb-24 pt-[120px] sm:pt-[160px]">
      <section className="relative z-30 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          İletişim
        </h1>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-6">
            {contact.phone ? (
              <article className="flex items-start gap-4 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.5 4.5a1 1 0 0 1-.5 1.2l-2.26 1.13a11 11 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.2-.5l4.5 1.5a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Telefon</h2>
                  <p className="mt-1 text-slate-600">{contact.phone}</p>
                </div>
              </article>
            ) : null}

            {contact.email ? (
              <article className="flex items-start gap-4 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="m4 6 8 5 8-5" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">E-Posta</h2>
                  <p className="mt-1 text-slate-600">{contact.email}</p>
                </div>
              </article>
            ) : null}

            {contact.address ? (
              <article className="flex items-start gap-4 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" /><circle cx="12" cy="11" r="2.5" /></svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Adres</h2>
                  <p className="mt-1 text-slate-600">{contact.address}</p>
                </div>
              </article>
            ) : null}
          </div>

          <article className="rounded-3xl border border-white/50 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold text-slate-800">Bize Ulasin</h2>
            <ContactForm />
          </article>
        </div>
      </section>
    </main>
  );
}
