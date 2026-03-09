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
    <footer className="relative mt-24 w-full pt-10">
      <div className="mx-auto max-w-[1140px] px-6">
        {/* HYPER-PREMIUM CTA CARD */}
        <div className="relative -mb-32 z-30 overflow-hidden rounded-[40px] bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.22)] group">
          {/* Full Image Background with Subtle Zoom on Hover */}
          <img src="/assets/6giNjxR6OgghmjjphzMa2EDcM.avif" alt="Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors duration-500" />

          <div className="relative z-10 p-12 sm:p-24 text-center flex flex-col items-center">
            <h3 className="text-[34px] sm:text-[54px] font-[600] tracking-[-0.05em] text-white leading-[1.05] mb-8 max-w-[640px] text-balance">
              Duygulara hitap eden bir deneyimle tanışın.
            </h3>

            {/* Refined Control Group */}
            <div className="w-full max-w-[520px] flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-3xl p-2 rounded-[26px] border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/15">
              <div className="flex-1 px-7 py-4 text-white/80 text-[15px] font-medium text-left">
                Seyr FM Dünyası...
              </div>
              <button className="h-[58px] px-10 rounded-[20px] bg-[#FFD666] text-[#0A3D39] font-bold text-[14px] transition-all hover:bg-white hover:shadow-xl active:scale-95 whitespace-nowrap outline-none">
                Canlı Dinle →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Solidroad Ultra-Dark Green Footer Area */}
      <div className="bg-[#0A3D39] pt-60 pb-16 rounded-t-[60px] sm:rounded-t-[100px] relative z-20">
        <div className="mx-auto max-w-[1140px] px-10">
          <div className="flex flex-col lg:flex-row gap-20 justify-between items-start border-b border-white/5 pb-24">

            {/* Massive White Logo on Left (Solidroad Bird-style placement) */}
            <div className="flex-shrink-0">
              <img src={LOGO_URL} alt="Seyr FM" className="h-[50px] sm:h-[60px] w-auto brightness-0 invert opacity-90 transition-opacity hover:opacity-100" />
              <p className="mt-8 text-white/20 text-[11px] font-bold uppercase tracking-[0.4em] leading-relaxed">
                Huzurun Adresi <br /> Sesin Merhemi
              </p>
            </div>

            {/* Triple Grid Columns on Right */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24 lg:pt-10">
              <div>
                <h4 className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Menü</h4>
                <ul className="flex flex-col gap-5">
                  {links.slice(0, 4).map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-white/40 hover:text-white text-[14px] font-medium transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Kurumsal</h4>
                <ul className="flex flex-col gap-5">
                  <li><Link href="/kurumsal" className="text-white/40 hover:text-white text-[14px] font-medium transition-colors">Hakkımızda</Link></li>
                  <li><Link href="/iletisim" className="text-white/40 hover:text-white text-[14px] font-medium transition-colors">İletişim</Link></li>
                  <li><Link href="/programlar" className="text-white/40 hover:text-white text-[14px] font-medium transition-colors">Programlar</Link></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Sosyal</h4>
                <ul className="flex flex-col gap-5">
                  {socials.map(s => (
                    <li key={s.key}>
                      <a href={s.href ?? "#"} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-[14px] font-medium transition-colors capitalize">{s.key}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.4em]">
                © {new Date().getFullYear()} SEYR DİJİTAL
              </p>
              <span className="h-4 w-[1px] bg-white/5 hidden sm:block" />
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.4em]">HER HAKKI SAKLIDIR</p>
            </div>
            <div className="flex gap-12">
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-white/40 transition-colors">YASAL</p>
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-white/40 transition-colors">GİZLİLİK</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
