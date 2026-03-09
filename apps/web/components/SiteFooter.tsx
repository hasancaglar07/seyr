import Link from "next/link";
import { getContactSettings } from "@/lib/repository";

const LOGO_URL = "/assets/seyr-logo.png";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/yayin-akisi", label: "Yayin Akisi" },
  { href: "/programlar", label: "Programlar" },
  { href: "/programcilar", label: "Programcilar" },
  { href: "/canli-yayin", label: "Canli Yayin" },
  { href: "/iletisim", label: "Iletisim" },
];

function SocialIcon({ name }: { name: "instagram" | "facebook" | "youtube" | "whatsapp" }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zm5.2-8.6a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8A23 23 0 0 0 14.4 4c-2.4 0-4 1.5-4 4.3V11H8v3h2.4v8z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2a31.7 31.7 0 0 0 0 9.6 3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1 31.7 31.7 0 0 0 0-9.6zM9.8 15.3V8.7l5.8 3.3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M20.5 3.5A11.7 11.7 0 0 0 12 0 11.9 11.9 0 0 0 0 11.8a11.8 11.8 0 0 0 1.6 6l-1.6 5.9 6.1-1.6a12 12 0 0 0 5.9 1.5A11.9 11.9 0 0 0 24 11.8a11.7 11.7 0 0 0-3.5-8.3zM12 21.5a9.8 9.8 0 0 1-5-1.3l-.4-.2-3.6 1 1-3.4-.2-.4A9.7 9.7 0 1 1 12 21.5zm5.4-7.2c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9.2 9.2 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6a2 2 0 0 0 .3-.6.7.7 0 0 0 0-.6l-1-2.4c-.3-.7-.6-.7-.8-.7h-.7a1.4 1.4 0 0 0-1 .4A4 4 0 0 0 5 10a7 7 0 0 0 1.4 3.7 16 16 0 0 0 6.2 5.3 8.4 8.4 0 0 0 2.8.9 3.4 3.4 0 0 0 2.4-.6 2.9 2.9 0 0 0 1.1-2.1c0-.4-.2-.5-.4-.6z" />
    </svg>
  );
}

export async function SiteFooter() {
  const contact = await getContactSettings();
  const socials = [
    { key: "instagram" as const, href: contact.instagram },
    { key: "facebook" as const, href: contact.facebook },
    { key: "youtube" as const, href: contact.youtube },
    { key: "whatsapp" as const, href: contact.whatsapp },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative z-20 mt-24 px-4 pb-32 pt-12">
      <div className="mx-auto w-full max-w-7xl rounded-[34px] bg-slate-950 px-8 py-10 text-slate-200 shadow-[0_28px_60px_rgba(15,23,42,0.18)] sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Seyr FM Logo" className="h-12 w-12 rounded-full border border-white/[0.12] bg-white/95 p-1 object-contain" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Seyr Dijital</p>
                <h2 className="text-2xl font-bold tracking-tight text-white">Seyr FM</h2>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-8 text-slate-400">
              Canli yayin, programlar, programcilar ve haftalik akis tek merkezde. Daha temiz, daha kurumsal ve daha hizli bir
              deneyim icin sayfa duzeni yeniden kurgulandi.
            </p>

            <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              7/24 Dijital Yayin
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Sayfalar</p>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-transparent px-3 py-2 text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Iletisim</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {contact.phone ? <p>{contact.phone}</p> : null}
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="block transition hover:text-white">
                  {contact.email}
                </a>
              ) : null}
              {contact.address ? <p className="leading-7 text-slate-400">{contact.address}</p> : null}
            </div>

            {socials.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((item) => (
                  <a
                    key={item.key}
                    href={item.href ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    aria-label={item.key}
                  >
                    <SocialIcon name={item.key} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.14em] text-slate-500 sm:flex-row sm:items-center">
          <p>Copyright {new Date().getFullYear()} Seyr Dijital</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
