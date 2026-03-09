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
      <section className="relative w-full mb-4 sm:mb-6">
        <div className="relative flex min-h-[85vh] sm:min-h-[880px] w-full flex-col items-center justify-between rounded-[24px] sm:rounded-[48px] overflow-hidden bg-slate-100 pb-20 sm:pb-24">
          {/* Fullscreen Background Image Slider */}
          <HeroSlider />

          {/* Title removed per user request */}

          {/* Glass Card Removed intentionally to make room for the Dynamic Player */}

          {/* 3. LOGO MARQUEE OVERLAY (Inside the Hero) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 w-full pb-6 sm:pb-10 overflow-hidden">
            {/* Removed side mask gradients for full brightness */}

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
                      className="group flex mx-4 sm:mx-8 shrink-0 transition-transform duration-500 hover:-translate-y-1 active:scale-95 cursor-pointer relative z-40 bg-transparent border-none outline-none"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-7 sm:h-9 w-auto object-contain brightness-0 invert opacity-100"
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
      <section id="programlar" className="bg-white pt-2 sm:pt-4 pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mx-auto max-w-[750px] text-center mb-12 sm:mb-16 flex flex-col items-center">
              {/* Large Solidroad-style Sans-serif Title */}
              <h2 className="text-[2.25rem] sm:text-[3rem] md:text-[3.25rem] font-[500] tracking-[-0.04em] text-slate-900 leading-[1] text-balance">
                Yayın akışından dinleyici deneyimine kadar her anı yakalayın
              </h2>
            </div>
          </FadeInUp>

          <div className="mx-auto max-w-[940px] grid gap-5 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
            {programs.slice(0, 3).map((program, index) => {
              const pastelColors = ['bg-[#FFF6CD]', 'bg-[#D2EFF1]', 'bg-[#D5EED9]'];
              const bgColor = pastelColors[index % pastelColors.length];

              return (
                <FadeInUp key={program.id} delay={index * 0.1} className="h-full">
                  <article className={cn("group flex h-full flex-col overflow-hidden rounded-[24px] transition-all duration-500 hover:-translate-y-1.5 p-5 sm:p-7 min-h-[380px] sm:min-h-[480px]", bgColor)}>

                    {/* Floating Graphic Area at Top */}
                    <div className="relative mb-5 sm:mb-8 w-full aspect-[4/5] shrink-0 transition-transform duration-500 group-hover:scale-[1.03]">
                      <img
                        src={program.coverImageUrl ?? LOGO_URL}
                        alt={program.title}
                        className="absolute inset-0 h-full w-full rounded-[14px] object-cover object-top shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)]"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Text Content at Bottom */}
                    <div className="mt-auto mb-1 relative z-10 shrink-0">
                      <h3 className="mb-2 text-[16px] sm:text-[19px] font-[700] tracking-[-0.015em] text-slate-900 leading-[1.2] line-clamp-2">
                        {program.title}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] font-[500] leading-[1.5] text-slate-700/80 line-clamp-3">
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
            <div className="mt-12 sm:mt-16 flex justify-center px-4">
              <Link
                href="/programlar"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
              >
                Tüm Programları İncele
                <ArrowUpRightIcon />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section >

      {/* 4.5 ABOUT / INFO SECTION (Solidroad Case Study Style) */}
      <section className="bg-[#CEEBCB] py-8 sm:py-12 w-full flex justify-center overflow-hidden">
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
      <section id="programcilar" className="bg-white pt-10 pb-14 overflow-hidden">
        <FadeInUp className="mx-auto max-w-[850px] px-6 text-center mb-10 flex justify-center">
          <h2 className="text-[22px] sm:text-[32px] md:text-[38px] font-[500] leading-[1.2] text-[#0A3D39] tracking-[-0.035em] text-balance">
            Seyr FM yayıncıları, her dinleyici etkileşiminde kalite çıtasını yükselterek tüm ruhsal deneyimleri sürekli iyileştirir.
          </h2>
        </FadeInUp>

        {/* Marquee Container */}
        <div className="relative w-full max-w-[2000px] mx-auto flex items-center">
          {/* Left/Right Fade Gradients for smooth entering/leaving */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-48 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-48 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

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

      {/* 6. WEEKLY SCHEDULE SECTION (Solidroad Bento Grid Style) */}
      <section id="akis" className="bg-white py-10 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-[1100px] px-6">

          {/* Bento Grid Layout - Solidroad Style */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

            {/* 1. Large Feature Card: NOW PLAYING */}
            <FadeInUp delay={0.1} className="md:col-span-7">
              <div className="group relative h-full min-h-[420px] sm:min-h-[480px] overflow-hidden rounded-[40px] bg-white border border-slate-100 p-8 sm:p-12 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">

                {/* Floating 3D Graphic (AVIF) */}
                <div className="absolute right-[-20px] top-4 w-[280px] sm:w-[360px] opacity-90 transition-transform duration-700 group-hover:translate-y-[-10px] group-hover:rotate-[-2deg] pointer-events-none">
                  <img src="/assets/5pYqX7l5zApovaOAAc9NILbFBi4.avif" alt="Graphic" className="w-full h-auto drop-shadow-2xl" />
                </div>

                <div className="relative z-10 w-full max-w-[320px]">
                  <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600 mb-8 w-max">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Şu An Yayında
                  </div>

                  <h3 className="text-[34px] sm:text-[44px] font-[600] tracking-[-0.04em] text-slate-900 leading-[1.05] mb-6">
                    {nextEntry?.title ?? "Ruhun Sesi"}
                  </h3>

                  <div className="p-5 rounded-[24px] bg-slate-50/80 backdrop-blur-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <PlayIcon />
                      </div>
                      <div>
                        <p className="text-[14px] font-[700] text-slate-900 leading-none mb-1">{nextEntry?.presenterName ?? "Seyr FM"}</p>
                        <p className="text-[11px] font-[600] text-indigo-500 uppercase tracking-widest">{nextEntry?.startsAt ?? "00:00"} — Canlı</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-slate-400 text-[13px] font-medium tracking-tight">
                    Sesin, sözün ve gönlün buluşma noktası.
                  </p>
                </div>
              </div>
            </FadeInUp>

            {/* 2. Secondary Card: VIBRANT SCENERY */}
            <FadeInUp delay={0.2} className="md:col-span-5">
              <div className="relative h-full min-h-[340px] overflow-hidden rounded-[40px] group">
                <img
                  src="/assets/fpFXRHq19ovCpz7xW9BVkwlyEuA.avif"
                  alt="Scenery"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
                <div className="absolute top-8 left-8">
                  <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest">
                    Kapak
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* 3. Small Clean Feature: SECURE/CLEAN */}
            <FadeInUp delay={0.3} className="md:col-span-5 lg:col-span-4">
              <div className="relative h-full min-h-[220px] rounded-[40px] bg-[#FFF8E6] p-10 flex flex-col justify-end overflow-hidden group">
                <div className="absolute right-[-10px] top-[-10px] w-[180px] opacity-90 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
                  <img src="/assets/oKEHiwQ5owkmLzr70ZtHeP3HA.avif" alt="Clean Graphic" className="w-full h-auto" />
                </div>
                <div className="relative z-10">
                  <div className="text-[44px] font-serif text-amber-600 leading-none mb-1">
                    {todayEntries.length}
                  </div>
                  <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-widest leading-none">Bugün Planlanan Yayın</p>
                </div>
              </div>
            </FadeInUp>

            {/* 4. Upcoming List Card: DATA-DRIVEN */}
            <FadeInUp delay={0.4} className="md:col-span-12 lg:col-span-8">
              <div className="h-full rounded-[40px] bg-white border border-slate-100 p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-10">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[20px] font-[600] text-slate-900 tracking-tight">Akışın Devamı</h4>
                    <span className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>

                  <div className="space-y-6">
                    {todayEntries.slice(1, 4).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-5">
                          <div className="w-[50px] text-[12px] font-bold text-slate-300 group-hover:text-indigo-400 transition-colors uppercase">{entry.startsAt}</div>
                          <div>
                            <p className="text-[16px] font-[600] text-slate-800 tracking-tight leading-none mb-1">{entry.title}</p>
                            <p className="text-[12px] text-slate-400 font-medium">{entry.presenterName ?? "Seyr FM"}</p>
                          </div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all scale-0 group-hover:scale-100">
                          <ArrowUpRightIcon />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:flex flex-col justify-end">
                  <Link href="/yayin-akisi" className="inline-flex h-[50px] items-center gap-3 rounded-2xl bg-slate-950 px-6 text-[13px] font-bold text-white transition-all hover:bg-indigo-600 active:scale-95 whitespace-nowrap">
                    Tümünü Gör
                    <ArrowUpRightIcon />
                  </Link>
                </div>
              </div>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.5} className="mt-16 flex justify-center">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 px-4 max-w-full">
              {DAY_LABELS.map((day, idx) => (
                <div
                  key={day}
                  className={cn(
                    "whitespace-nowrap rounded-full px-5 py-2 text-[11px] font-[600] uppercase tracking-widest transition-all",
                    idx === currentDay ? "bg-slate-900 text-white shadow-md scale-105" : "text-slate-400 bg-white border border-slate-100"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </FadeInUp>

        </div>
      </section >
    </main >
  );
}
