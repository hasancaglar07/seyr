import Link from "next/link";
import { FadeInUp } from "@/components/FadeInUp";
import { DAY_LABELS, getCurrentOrNextSchedule, splitParagraphs } from "@/lib/content";
import { getPageBySlug, getPresenters, getPrograms, getSchedule, getStreams } from "@/lib/repository";
import { cn } from "@/lib/utils";
import { HeroSlider } from "@/components/HeroSlider";

const LOGO_URL = "/assets/seyr-logo.png";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M10 17v4M14 17v4" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function RadioIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M8 9 16 5" />
      <circle cx="8" cy="14" r="2.2" />
      <path d="M14 14h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <path d="M8 3v3M16 3v3M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M4 20a5 5 0 0 1 10 0" />
      <path d="M14.5 20a4 4 0 0 1 5.5-3.7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default async function HomePage() {
  const [programs, presenters, schedule, streams, homePage, corporatePage] = await Promise.all([
    getPrograms(),
    getPresenters(),
    getSchedule(),
    getStreams(),
    getPageBySlug("seyr"),
    getPageBySlug("kurumsal"),
  ]);

  const currentDay = new Date().getDay();
  const nextEntry = getCurrentOrNextSchedule(schedule);
  const mainStream = streams.find((stream) => !/tvyayini_embed/i.test(stream.streamUrl)) ?? streams[0];
  const tvStream = streams.find((stream) => /tvyayini_embed/i.test(stream.streamUrl));
  const spotlightProgram = programs[0];
  const spotlightImage = spotlightProgram?.coverImageUrl ?? mainStream?.coverImageUrl ?? LOGO_URL;
  const appLinks = [...new Set(homePage?.content?.match(/https?:\/\/\S*(?:play\.google|apps\.apple)\S*/gi) ?? [])];

  const homeText = splitParagraphs(homePage?.content)
    .filter((line) => !/^https?:\/\//i.test(line) && line.length > 14)
    .slice(0, 4);
  const corporateText = splitParagraphs(corporatePage?.content)
    .filter((line) => !line.startsWith("Gorsel:") && line.length > 14)
    .slice(0, 3);

  const todayEntries = schedule
    .filter((item) => item.dayOfWeek === currentDay)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 5);

  const weekGroups = DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek,
    label,
    entries: schedule
      .filter((item) => item.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
  })).filter((group) => group.entries.length > 0);

  const presenterShows = schedule.reduce<Record<string, string[]>>((acc, item) => {
    if (!item.presenterName) {
      return acc;
    }

    acc[item.presenterName] = acc[item.presenterName] ?? [];
    if (!acc[item.presenterName].includes(item.title)) {
      acc[item.presenterName].push(item.title);
    }

    return acc;
  }, {});

  const metrics = [
    {
      label: "Canlı Yayın",
      value: mainStream?.name ?? "Seyr FM",
      icon: <RadioIcon />,
    },
    {
      label: "Programlar",
      value: `${programs.length}+`,
      icon: <CalendarIcon />,
    },
    {
      label: "Yayıncı Kadrosu",
      value: `${presenters.length}+`,
      icon: <UsersIcon />,
    },
    {
      label: "Haftalık Akış",
      value: `${schedule.length} Slot`,
      icon: <ClockIcon />,
    },
  ];

  return (
    <main className="bg-white">
      {/* 1. HERO SECTION (Solidroad padding style) */}
      <section className="relative w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 mb-16 sm:mb-20">
        <div className="relative flex min-h-[85vh] sm:min-h-[900px] w-full flex-col items-center justify-between rounded-[40px] sm:rounded-[64px] overflow-hidden bg-slate-950 pb-24 sm:pb-36">
          {/* Fullscreen Background Image Slider */}
          <HeroSlider />

          {/* Top Centered Title (Pushed down a bit to match the reference) */}
          <div className="relative z-10 w-full px-4 text-center mt-[18vh] sm:mt-[22vh]">
            <FadeInUp>
              <h1 className="mx-auto max-w-4xl font-serif text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.1] tracking-tight text-white drop-shadow-2xl">
                Seyr FM
              </h1>
            </FadeInUp>
          </div>

          {/* Glass Card Removed intentionally to make room for the Dynamic Player */}

          {/* 3. LOGO MARQUEE OVERLAY (Inside the Hero) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 w-full pb-6 sm:pb-10 overflow-hidden">
            {/* Left/Right Fade Gradients for smooth entering/leaving over the image */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 z-30 bg-gradient-to-r from-slate-900/80 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 z-30 bg-gradient-to-l from-slate-900/80 to-transparent pointer-events-none" />

            <div className="flex w-[300%] sm:w-[200%] animate-infinite-scroll hover:[animation-play-state:paused] items-center">
              {/* Double the logos so the loop is seamless */}
              {[...Array(2)].map((_, idx) => (
                <div key={`marquee-group-${idx}`} className="flex w-1/2 justify-around items-center px-2 sm:px-4">
                  {[
                    { id: "seyr-fm", src: "/assets/syrfm.png", alt: "Seyr FM" },
                    { id: "seyr-kuran", src: "/assets/kuranikerim.png", alt: "Seyr Kur'an" },
                    { id: "seyr-ilahi", src: "/assets/ilahi.png", alt: "Seyr İlahi" },
                    { id: "seyr-sohbet", src: "/assets/sohbet.png", alt: "Seyr Sohbet" },
                    { id: "seyr-cocuk", src: "/assets/cocuk.png", alt: "Seyr Çocuk" },
                    { id: "seyr-ezgi", src: "/assets/ezgi.png", alt: "Seyr Ezgi" },
                  ].map((logo) => (
                    <button
                      key={`${idx}-${logo.id}`}
                      className="group flex mx-4 sm:mx-8 shrink-0 transition-transform duration-500 hover:-translate-y-1.5 active:scale-95 cursor-pointer relative z-40"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-7 sm:h-9 w-auto object-contain brightness-0 invert opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAMS SECTION (Solidroad Minimalist Cards) */}
      <section id="programlar" className="bg-white pt-8 sm:pt-10 pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mx-auto max-w-[750px] text-center mb-12 sm:mb-16 flex flex-col items-center">
              {/* Large Solidroad-style Sans-serif Title */}
              <h2 className="text-[2.25rem] sm:text-[3rem] md:text-[3.25rem] font-[500] tracking-[-0.04em] text-slate-900 leading-[1] text-balance">
                Yayın akışından dinleyici deneyimine kadar her anı yakalayın
              </h2>
            </div>
          </FadeInUp>

          <div className="mx-auto max-w-[940px] grid gap-6 md:gap-8 md:grid-cols-3">
            {programs.slice(0, 3).map((program, index) => {
              const pastelColors = ['bg-[#FFF6CD]', 'bg-[#D2EFF1]', 'bg-[#D5EED9]'];
              const bgColor = pastelColors[index % pastelColors.length];

              return (
                <FadeInUp key={program.id} delay={index * 0.1} className="h-full">
                  <article className={cn("group flex h-full flex-col overflow-hidden rounded-[24px] transition-transform duration-500 hover:-translate-y-1.5 p-6 sm:p-7 min-h-[420px] sm:min-h-[480px]", bgColor)}>

                    {/* Floating Graphic Area at Top */}
                    <div className="relative mb-6 sm:mb-8 w-full aspect-[4/5] shrink-0 transition-transform duration-500 group-hover:scale-[1.03]">
                      <img
                        src={program.coverImageUrl ?? LOGO_URL}
                        alt={program.title}
                        className="absolute inset-0 h-full w-full rounded-[14px] object-cover object-top shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)]"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Text Content at Bottom */}
                    <div className="mt-auto mb-2 relative z-10 shrink-0">
                      <h3 className="mb-2 text-[17px] sm:text-[19px] font-[700] tracking-[-0.015em] text-slate-900 leading-[1.2] line-clamp-2">
                        {program.title}
                      </h3>
                      <p className="text-[12.5px] sm:text-[13px] font-[500] leading-[1.5] text-slate-700/80 line-clamp-3">
                        {program.summary && program.summary.length > 0
                          ? program.summary
                          : "Bu programla ilgili detaylı yayın saatleri ve zengin arşiv içeriklerine doğrudan erişin."}
                      </p>
                    </div>

                  </article>
                </FadeInUp>
              );
            })}
          </div>

          <FadeInUp delay={0.3}>
            <div className="mt-16 flex justify-center">
              <Link
                href="/programlar"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-slate-800"
              >
                Tüm Programları İncele
                <ArrowUpRightIcon />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section >

      {/* 4.5 ABOUT / INFO SECTION (Solidroad Case Study Style) */}
      <section className="bg-[#CEEBCB] py-16 sm:py-24 w-full flex justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1050px] px-6 sm:px-8 grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 md:gap-16 items-center">

          {/* Left Side: Large Rounded Image */}
          <FadeInUp className="relative aspect-[4/5] w-full max-w-[340px] mx-auto md:mx-0 order-2 md:order-1 flex-shrink-0">
            <img
              src="/assets/168202115298862.jpg"
              alt="Seyr FM"
              className="rounded-2xl w-full h-full object-cover shadow-[0_16px_40px_-8px_rgba(0,0,0,0.2)]"
              referrerPolicy="no-referrer"
            />
          </FadeInUp>

          {/* Right Side: Content Area */}
          <FadeInUp delay={0.2} className="flex flex-col order-1 md:order-2 items-start justify-center py-4 lg:py-0">

            {/* Top Navigation Row */}
            <div className="flex items-center justify-end w-full mb-6 relative">
              {/* Decorative Quote Mark */}
              <div className="absolute left-0 top-0 text-[#FFD756] opacity-40 text-[80px] font-serif leading-none h-[40px] select-none">
                "
              </div>

              {/* Decorative Yellow Arrows */}
              <div className="hidden sm:flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 transition-all hover:scale-105 hover:bg-[#FFD756] hover:text-slate-900 hover:border-[#FFD756]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 transition-all hover:scale-105 hover:bg-[#FFD756] hover:text-slate-900 hover:border-[#FFD756]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>

            {/* Main Description */}
            <h3 className="text-[17px] sm:text-[20px] leading-[1.6] text-slate-800 font-[450] tracking-[-0.01em] mb-8 pr-2 sm:pr-6 relative z-10 text-balance">
              Yüreğinizin Sesi.. 2007 yılında kurulan radyomuz tematik yayın alanında; tasavvuf müziği, kültür sanat ve İslâmi sohbet yayınlarını büyük bir titizlikle dinleyicilerine ulaştırmaktadır. İstanbul'da 102.2 frekansından, Türksat 4A uydusu üzerinden ve tüm dijital kanallardan kesintisiz olarak dinleyebilirsiniz.
            </h3>

            {/* Divider */}
            <div className="w-full h-[1px] bg-slate-900/5 mb-6 sm:mb-8" />

            {/* Bottom Stats Grid */}
            <div className="flex items-center gap-8 sm:gap-12">
              <div className="flex flex-col">
                <div className="text-[28px] sm:text-[36px] tracking-[-0.03em] font-[600] leading-none mb-1 text-slate-900">
                  102.2
                </div>
                <div className="text-[10px] font-[600] text-slate-500 tracking-[0.04em] uppercase">
                  Frekans
                </div>
              </div>

              <div className="w-[1px] h-[36px] bg-slate-900/10" />

              <div className="flex flex-col">
                <div className="text-[28px] sm:text-[36px] tracking-[-0.03em] font-[600] leading-none mb-1 text-slate-900">
                  2007
                </div>
                <div className="text-[10px] font-[600] text-slate-500 tracking-[0.04em] uppercase">
                  Kuruluş
                </div>
              </div>
            </div>

          </FadeInUp>
        </div>
      </section>

      {/* 5. PRESENTERS SECTION (Solidroad Marquee Collage Style) */}
      <section id="programcilar" className="bg-[#FEFCF8] pt-24 pb-32 overflow-hidden border-b border-slate-100">
        <FadeInUp className="mx-auto max-w-[850px] px-6 text-center mb-24 flex justify-center">
          <h2 className="text-[22px] sm:text-[32px] md:text-[38px] font-[500] leading-[1.2] text-[#0A3D39] tracking-[-0.035em] text-balance">
            Seyr FM yayıncıları, her dinleyici etkileşiminde kalite çıtasını yükselterek tüm ruhsal deneyimleri sürekli iyileştirir.
          </h2>
        </FadeInUp>

        {/* Marquee Container */}
        <div className="relative w-full max-w-[2000px] mx-auto flex items-center">
          {/* Left/Right Fade Gradients for smooth entering/leaving */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-48 z-10 bg-gradient-to-r from-[#FEFCF8] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-48 z-10 bg-gradient-to-l from-[#FEFCF8] to-transparent pointer-events-none" />

          <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused] items-center gap-4 sm:gap-6 px-4 py-8">
            {/* Repeat 3 times for infinite scroll illusion */}
            {[...Array(3)].map((_, groupIdx) => (
              <div key={`marquee-group-${groupIdx}`} className="flex gap-4 sm:gap-6 items-center shrink-0">
                {presenters.slice(0, 10).map((presenter, i) => {
                  // Random-looking but deterministic styles based on index for collage effect
                  const isTall = i % 4 === 0;
                  const isSquare = i % 4 === 1;
                  const isWide = i % 4 === 2;
                  const isSmall = i % 4 === 3;

                  const shapeClass = isTall ? "h-[320px] sm:h-[400px] w-[200px] sm:w-[280px] -translate-y-6 sm:-translate-y-10"
                    : isSquare ? "h-[240px] sm:h-[300px] w-[240px] sm:w-[300px] translate-y-4 sm:translate-y-8"
                      : isWide ? "h-[180px] sm:h-[220px] w-[280px] sm:w-[360px] -translate-y-12 sm:-translate-y-16"
                        : "h-[160px] sm:h-[200px] w-[160px] sm:w-[200px] translate-y-8 sm:translate-y-12";

                  return (
                    <div
                      key={`${groupIdx}-${presenter.id}-${i}`}
                      className={cn("relative overflow-hidden rounded-[18px] sm:rounded-[24px] shrink-0 transition-transform duration-700 hover:scale-[1.03] shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-slate-100", shapeClass)}
                    >
                      <img
                        src={presenter.avatarUrl ?? LOGO_URL}
                        alt={presenter.fullName}
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle overlay on hover with name */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A3D39]/90 to-transparent p-5 opacity-0 transition-opacity duration-300 hover:opacity-100 flex items-end h-[60%]">
                        <p className="text-white text-[15px] font-[600] tracking-tight truncate">{presenter.fullName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WEEKLY SCHEDULE SECTION */}
      < section id="akis" className="bg-[#F7F9FB] py-16 sm:py-20" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mx-auto max-w-4xl text-center mb-10 flex flex-col items-center">
              {/* Top Calendar Icon */}
              <div className="mb-6 flex justify-center text-slate-800">
                <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {/* Large Serif Title */}
              <h2 className="text-[2.5rem] sm:text-5xl lg:text-[4rem] font-serif font-normal tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm mb-4">
                Haftalık Yayın Akışı
              </h2>
            </div>

            {/* Day Selector Pills */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {DAY_LABELS.map((day, index) => (
                <span
                  key={day}
                  className={cn(
                    "cursor-default rounded-full px-6 py-2.5 text-[11px] font-[600] uppercase tracking-widest transition-all",
                    index === currentDay
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
          </FadeInUp>

          <div className="mx-auto max-w-4xl space-y-4">
            {weekGroups.filter(g => g.dayOfWeek === currentDay).map((group) => (
              <FadeInUp key={group.dayOfWeek}>
                <div className="rounded-[40px] border border-slate-200 bg-white p-4 sm:p-8 shadow-sm">
                  <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 px-4">
                    <h3 className="font-serif text-[1.75rem] font-normal tracking-tight text-slate-900">{group.label} <span className="text-slate-400">Akışı</span></h3>
                    <div className="rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-[600] uppercase tracking-widest text-slate-500">
                      {group.entries.length} Yayın
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.entries.map((entry, idx) => (
                      <article
                        key={entry.id}
                        className={cn(
                          "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[24px] p-5 transition-all hover:bg-slate-50",
                          idx === 0 ? "bg-slate-50 border border-slate-100" : "bg-transparent"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[20px] bg-white border border-slate-100 shadow-sm text-slate-900 group-hover:border-slate-200">
                            <p className="text-sm font-black">{entry.startsAt.split(':')[0]}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.startsAt.split(':')[1]}</p>
                          </div>
                          <div>
                            <h4 className="text-[17px] font-[600] tracking-tight text-slate-900 mb-1">{entry.title}</h4>
                            <p className="text-[13px] font-[500] text-slate-500">{entry.presenterName ?? "Seyr FM"} {entry.isReplay && <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600">Tekrar</span>}</p>
                          </div>
                        </div>
                        {idx === 0 && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 sm:self-center w-max">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(52,211,153,0.2)]"></span>
                            Aktif
                          </span>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={0.2}>
            <div className="mt-12 text-center">
              <Link href="/yayin-akisi" className="inline-flex items-center gap-2 text-[13px] font-[600] uppercase tracking-widest text-slate-900 hover:text-sky-600 transition-colors group">
                Haftalık Tam Liste <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section >
    </main >
  );
}
