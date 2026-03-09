import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { LegacyExportSchema, normalizeSlug, type LegacyExport } from "@seyir/contracts";

const BASE_URL = "https://www.seyrdijital.com/seyr";
const BASE_ORIGIN = new URL(BASE_URL).origin;
const NAV_PAGE_SLUGS = ["seyr", "kurumsal", "yayin-akisi", "programlar", "programcilar", "canli-yayin", "iletisim"] as const;
const DAY_ORDER = ["pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi", "pazar"] as const;
const IGNORED_HEADINGS = new Set(["language selection", "login / sign in", "register / sign up"]);
const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  nbsp: " ",
  quot: '"',
  apos: "'",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  ndash: "-",
  mdash: "-",
  hellip: "...",
  uuml: "\u00fc",
  Uuml: "\u00dc",
  ouml: "\u00f6",
  Ouml: "\u00d6",
  scedil: "\u015f",
  Scedil: "\u015e",
  ccedil: "\u00e7",
  Ccedil: "\u00c7",
  acirc: "\u00e2",
  Acirc: "\u00c2",
  ecirc: "\u00ea",
  Ecirc: "\u00ca",
  icirc: "\u00ee",
  Icirc: "\u00ce",
  ucirc: "\u00fb",
  Ucirc: "\u00db",
  iuml: "\u00ef",
  Iuml: "\u00cf",
};

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function decodeSlug(input: string) {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function decodeHtmlEntities(input: string) {
  return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, value: string) => {
    if (value.startsWith("#x") || value.startsWith("#X")) {
      return String.fromCodePoint(parseInt(value.slice(2), 16));
    }

    if (value.startsWith("#")) {
      return String.fromCodePoint(parseInt(value.slice(1), 10));
    }

    return HTML_ENTITY_MAP[value] ?? entity;
  });
}

function normalizeText(input: string) {
  return input
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ *\n */g, "\n")
    .trim();
}

function stripTags(input: string) {
  return normalizeText(
    decodeHtmlEntities(
      input
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/h[1-6]>/gi, "\n")
        .replace(/<li[^>]*>/gi, "\n- ")
        .replace(/<[^>]+>/g, " "),
    ),
  );
}

function absoluteUrl(path: string | null) {
  if (!path) {
    return null;
  }

  try {
    return new URL(path, `${BASE_ORIGIN}/`).toString();
  } catch {
    return null;
  }
}

function toFetchUrl(path = "") {
  if (!path.trim()) {
    return BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized = path.trim().replace(/^\/+/, "");
  return `${BASE_ORIGIN}/${encodeURI(normalized)}`;
}

function parseCharset(value: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized.includes("utf-8")) {
    return "utf-8";
  }

  if (normalized.includes("windows-1254")) {
    return "windows-1254";
  }

  if (normalized.includes("iso-8859-9")) {
    return "iso-8859-9";
  }

  if (normalized.includes("iso-8859-1")) {
    return "iso-8859-1";
  }

  return normalized;
}

function getMetaCharset(markup: string) {
  const match = markup.match(/<meta[^>]+charset=["']?([a-z0-9\-_]+)["']?/i);
  return match?.[1] ?? null;
}

function scoreDecodedHtml(markup: string) {
  const replacement = (markup.match(/\uFFFD/g) ?? []).length;
  const mojibake = (markup.match(/[ÃÄÅÂ][\x80-\xBFA-Za-z]/g) ?? []).length;
  const turkish = (markup.match(/[ÇĞİÖŞÜçğıöşü]/g) ?? []).length;
  return turkish * 3 - mojibake * 4 - replacement * 8;
}

function decodeBuffer(buffer: ArrayBuffer, hintedCharset: string | null) {
  const candidates = unique(
    [hintedCharset, "utf-8", "windows-1254", "iso-8859-9", "iso-8859-1"].filter(Boolean) as string[],
  );

  const decoded = candidates
    .map((charset) => {
      try {
        const value = new TextDecoder(charset).decode(buffer);
        return { charset, value, score: scoreDecodedHtml(value) };
      } catch {
        return null;
      }
    })
    .filter((entry): entry is { charset: string; value: string; score: number } => Boolean(entry));

  if (decoded.length === 0) {
    return new TextDecoder("utf-8").decode(buffer);
  }

  decoded.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (left.charset === "utf-8") {
      return -1;
    }

    if (right.charset === "utf-8") {
      return 1;
    }

    return 0;
  });

  return decoded[0]?.value ?? new TextDecoder("utf-8").decode(buffer);
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 SeyrDijital Rebuild Bot",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const headerCharset = parseCharset(response.headers.get("content-type")?.match(/charset=([^;]+)/i)?.[1] ?? null);
  const firstPass = new TextDecoder("utf-8").decode(buffer);
  const metaCharset = parseCharset(getMetaCharset(firstPass));
  const hintedCharset = headerCharset ?? metaCharset;
  return decodeBuffer(buffer, hintedCharset);
}

function extractById(html: string, id: string) {
  const expression = new RegExp(`<([a-z0-9]+)[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "i");
  return expression.exec(html)?.[2] ?? null;
}

function extractImage(html: string) {
  return absoluteUrl(/<img[^>]*id=["']ctl00_cphBody_Detayresim["'][^>]*src=["']([^"']+)["']/i.exec(html)?.[1] ?? null);
}

function extractHeadings(html: string, tagName: "h1" | "h2" | "h3") {
  const expression = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  return unique(
    [...html.matchAll(expression)]
      .map((match) => normalizeText(stripTags(match[1] ?? "")))
      .filter((value) => Boolean(value)),
  );
}

function extractIframeUrls(html: string) {
  const matches = [...html.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  return unique(
    matches
      .map((value) => decodeHtmlEntities(value).trim())
      .map((value) => absoluteUrl(value) ?? value)
      .filter((value): value is string => Boolean(value)),
  );
}

function extractAppLinks(html: string) {
  return unique(
    [...html.matchAll(/https?:\/\/[^"'\s<>]+/gi)]
      .map((match) => decodeHtmlEntities(match[0] ?? "").replace(/[),;]+$/, ""))
      .filter((value) => /play\.google|apps\.apple|appstore|itunes/i.test(value)),
  );
}

function extractSocialLinks(html: string) {
  return {
    whatsapp: html.match(/https:\/\/wa\.me\/[^"'\s<>]+/i)?.[0] ?? null,
    instagram: html.match(/https:\/\/(?:www\.)?instagram\.com\/[^"'\s<>]+/i)?.[0] ?? null,
    youtube: html.match(/https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^"'\s<>]+/i)?.[0] ?? null,
    facebook: html.match(/https:\/\/(?:tr-tr\.)?facebook\.com\/[^"'\s<>]+/i)?.[0] ?? null,
  };
}

function parseProgramLinks(html: string) {
  const matches = [...html.matchAll(/href="(program-[^"]+)"/gi)].map((match) => match[1]);
  return unique(matches).map((path) => {
    const text = decodeSlug(path.replace(/^program-/, ""));
    const title = text.replace(/-\d+$/, "").replace(/-/g, " ").trim();
    return {
      title,
      slug: normalizeSlug(title),
      sourcePath: path,
    };
  });
}

function parsePresenterLinks(html: string) {
  const matches = [...html.matchAll(/href="(programci-[^"]+)"/gi)].map((match) => match[1]);
  return unique(matches)
    .filter((path) => path.length > "programci-".length)
    .map((path) => {
      const text = decodeSlug(path.replace(/^programci-/, ""));
      const fullName = text.replace(/-\d+$/, "").replace(/-/g, " ").trim();
      return {
        fullName,
        slug: normalizeSlug(fullName),
        sourcePath: path,
      };
    });
}

function buildSummary(body: string | null, title: string) {
  if (!body) {
    return `${title} arsiv icerigi SeyrDijital eski sitesinden aktarildi.`;
  }

  return body.length > 180 ? `${body.slice(0, 177).trim()}...` : body;
}

async function parseProgramDetail(path: string, fallbackTitle: string) {
  const html = await fetchHtml(toFetchUrl(path));
  const titleRaw = stripTags(extractById(html, "ctl00_cphBody_lblbaslik") ?? extractById(html, "ctl00_cphBody_lblozet") ?? "");
  const title = titleRaw || fallbackTitle || "Program";
  const rawBody = stripTags(extractById(html, "ctl00_cphBody_lbldetay") ?? "");
  const body = rawBody || null;

  return {
    title,
    slug: normalizeSlug(title),
    sourcePath: path,
    summary: buildSummary(body, title),
    body,
    imageUrl: extractImage(html),
  };
}

async function parsePresenterDetail(path: string, fallbackName: string) {
  const html = await fetchHtml(toFetchUrl(path));
  const fullNameRaw = stripTags(extractById(html, "ctl00_cphBody_lblbaslik") ?? extractById(html, "ctl00_cphBody_lblozet") ?? "");
  const fullName = fullNameRaw || fallbackName || "Programci";
  const rawBio = stripTags(extractById(html, "ctl00_cphBody_lbldetay") ?? "");

  return {
    fullName,
    slug: normalizeSlug(fullName),
    sourcePath: path,
    bio: rawBio || null,
    avatarUrl: extractImage(html),
  };
}

function parseScheduleTitle(raw: string) {
  const cleaned = normalizeText(stripTags(raw));
  const parts = cleaned.split(/\s+-\s+/);

  if (parts.length >= 2) {
    return {
      title: parts[0]?.trim() || cleaned,
      presenterName: parts[1]?.trim() || null,
      isReplay: /tekrari/i.test(cleaned),
    };
  }

  return {
    title: cleaned,
    presenterName: null,
    isReplay: /tekrari/i.test(cleaned),
  };
}

function parseScheduleHints(html: string) {
  const results: LegacyExport["scheduleHints"] = [];
  const daySections = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>([\s\S]*?)(?=<h1[^>]*>|$)/gi)];

  for (const [, dayLabel, sectionHtml] of daySections) {
    const day = normalizeText(stripTags(dayLabel));
    if (!DAY_ORDER.includes(normalizeSlug(day) as (typeof DAY_ORDER)[number])) {
      continue;
    }

    const entries = [
      ...sectionHtml.matchAll(
        /top_list_tract_time"><p>(\d{2}:\d{2})<\/p><\/div><\/div>[\s\S]{0,240}?top_list_tract_view"><p>([\s\S]*?)<\/p>/gi,
      ),
    ];

    for (const match of entries) {
      const parsedTitle = parseScheduleTitle(match[2] ?? "");
      results.push({
        day,
        time: match[1] ?? "00:00",
        title: parsedTitle.title,
        presenterName: parsedTitle.presenterName,
        isReplay: parsedTitle.isReplay,
      });
    }
  }

  if (results.length > 0) {
    return results;
  }

  return [...html.matchAll(/<p>(\d{2}:\d{2})<\/p>[\s\S]{0,220}?<p>([^<]{2,120})<\/p>/gi)].map((match) => ({
    time: match[1] ?? "00:00",
    title: normalizeText(stripTags(match[2] ?? "")),
    presenterName: null,
    isReplay: false,
  }));
}

function parseStreams(html: string) {
  const streamLike = (value: string) =>
    /netyayin|\/stream\b|stream\?|\.m3u8|icecast|shoutcast|:\d{4,5}\/|tvyayini_embed/i.test(value);
  const streamRank = (value: string) =>
    /netyayin|\/stream\b|stream\?|\.m3u8|icecast|shoutcast|:\d{4,5}\//i.test(value)
      ? 0
      : /tvyayini_embed/i.test(value)
        ? 1
        : 2;

  const fromAttributes = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
  const fromScript = [...html.matchAll(/(?:streamurl|stream_url)\s*[:=]\s*['"]([^'"]+)['"]/gi)].map((match) => match[1]);
  const fromRaw = [...html.matchAll(/https?:\/\/[^'"\s<>]+/gi)].map((match) => match[0]);

  return unique([...fromAttributes, ...fromScript, ...fromRaw])
    .map((value) => decodeHtmlEntities(value).replace(/[),;]+$/, "").trim())
    .filter((value) => value.startsWith("http") && streamLike(value))
    .map((value) => absoluteUrl(value) ?? value)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => streamRank(left) - streamRank(right) || left.localeCompare(right));
}

function parseCorporateContent(html: string) {
  const title = stripTags(extractById(html, "ctl00_cphBody_lblbaslik") ?? "Kurumsal");
  const body = stripTags(extractById(html, "ctl00_cphBody_lbldetay") ?? "");
  const image = extractImage(html);
  const lines = [title, body];

  if (image) {
    lines.push(`Gorsel: ${image}`);
  }

  return normalizeText(lines.filter(Boolean).join("\n\n"));
}

function parseSchedulePageContent(scheduleHints: LegacyExport["scheduleHints"]) {
  const grouped = new Map<string, LegacyExport["scheduleHints"]>();

  for (const entry of scheduleHints) {
    const day = normalizeText(entry.day ?? "Diger");
    grouped.set(day, [...(grouped.get(day) ?? []), entry]);
  }

  const orderedDays = [...grouped.keys()].sort((left, right) => {
    const leftIndex = DAY_ORDER.indexOf(normalizeSlug(left) as (typeof DAY_ORDER)[number]);
    const rightIndex = DAY_ORDER.indexOf(normalizeSlug(right) as (typeof DAY_ORDER)[number]);
    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
  });

  const lines: string[] = ["Yayin Akisi"];
  for (const day of orderedDays) {
    lines.push("", day);
    for (const entry of grouped.get(day) ?? []) {
      const suffix = [entry.presenterName ? `(${entry.presenterName})` : "", entry.isReplay ? "[Tekrar]" : ""]
        .filter(Boolean)
        .join(" ");
      lines.push(`${entry.time} - ${entry.title}${suffix ? ` ${suffix}` : ""}`);
    }
  }

  return normalizeText(lines.join("\n"));
}

function parseProgramListPageContent(programs: LegacyExport["programs"]) {
  const lines = ["Programlar", ...programs.map((item) => item.title)];
  return normalizeText(lines.join("\n"));
}

function parsePresenterListPageContent(presenters: LegacyExport["presenters"]) {
  const lines = ["Programcilar", ...presenters.map((item) => item.fullName)];
  return normalizeText(lines.join("\n"));
}

function parseHomeContent(html: string) {
  const headings = extractHeadings(html, "h1").filter((heading) => !IGNORED_HEADINGS.has(heading.toLowerCase()));
  const streamUrls = parseStreams(html);
  const iframeUrls = extractIframeUrls(html);
  const appLinks = extractAppLinks(html);

  const lines: string[] = ["Anasayfa", ...headings];
  if (streamUrls.length > 0) {
    lines.push("", "Canli Yayin Linkleri:", ...streamUrls);
  }

  if (iframeUrls.length > 0) {
    lines.push("", "Canli TV Embedleri:", ...iframeUrls);
  }

  if (appLinks.length > 0) {
    lines.push("", "Uygulama Linkleri:", ...appLinks);
  }

  return normalizeText(lines.join("\n"));
}

function parseLiveContent(html: string) {
  const headings = [...extractHeadings(html, "h1"), ...extractHeadings(html, "h2")].filter(
    (heading) => !IGNORED_HEADINGS.has(heading.toLowerCase()),
  );
  const iframeUrls = extractIframeUrls(html);
  const appLinks = extractAppLinks(html);
  const promoImages = unique(
    [...html.matchAll(/<img[^>]*src=["']([^"']*(?:seyrreklam|youtube)[^"']*)["'][^>]*>/gi)]
      .map((match) => absoluteUrl(decodeHtmlEntities(match[1] ?? "")))
      .filter((value): value is string => Boolean(value)),
  );

  const lines: string[] = ["Canli Yayin", ...headings];
  if (iframeUrls.length > 0) {
    lines.push("", "Canli TV Embedleri:", ...iframeUrls);
  }

  if (appLinks.length > 0) {
    lines.push("", "Uygulama Linkleri:", ...appLinks);
  }

  if (promoImages.length > 0) {
    lines.push("", "Canli Yayin Gorselleri:", ...promoImages);
  }

  return normalizeText(lines.join("\n"));
}

function parseContactContent(html: string) {
  const rowEntries = [...html.matchAll(/<h4>([^<]+)<\/h4>\s*<\/div>\s*<div[^>]*>\s*<h5[^>]*>([\s\S]*?)<\/h5>/gi)]
    .map((match) => ({
      label: normalizeText(stripTags(match[1] ?? "")),
      value: normalizeText(stripTags(match[2] ?? "")),
    }))
    .filter((entry) => Boolean(entry.label) && Boolean(entry.value));

  const cardEntries = [...html.matchAll(/<h4>([^<]{2,50})<\/h4>\s*<p>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({
      label: normalizeText(stripTags(match[1] ?? "")),
      value: normalizeText(stripTags(match[2] ?? "")),
    }))
    .filter((entry) => ["iletisim", "e-posta", "eposta", "konum"].includes(normalizeSlug(entry.label)));

  const rowMap = new Map(rowEntries.map((entry) => [normalizeSlug(entry.label), entry.value]));
  const stripped = stripTags(html);
  const phone = stripped.match(/0\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}/)?.[0] ?? null;
  const emails = unique((stripped.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []).map((entry) => entry.toLowerCase()));
  const addressFromRows = rowMap.get("yazisma-adresi") ?? null;
  const addressFromCards = cardEntries.find((entry) => normalizeSlug(entry.label) === "konum")?.value ?? null;
  const addressFromLines =
    stripped
      .split("\n")
      .map((line) => normalizeText(line))
      .find((line) => {
        const normalized = normalizeSlug(line);
        return normalized.includes("fatih") && normalized.includes("istanbul");
      }) ?? null;
  const mapEmbedUrl = absoluteUrl(html.match(/<iframe[^>]*src=["']([^"']*google\.com\/maps\/embed[^"']*)["'][^>]*>/i)?.[1] ?? null);
  const social = extractSocialLinks(html);

  const lines: string[] = ["Iletisim"];
  if (rowEntries.length > 0) {
    lines.push("", "Seyr Radyo Kunye");
    for (const row of rowEntries) {
      lines.push(`${row.label}: ${row.value}`);
    }
  }

  if (cardEntries.length > 0) {
    lines.push("", "Iletisim Kartlari");
    for (const card of cardEntries) {
      lines.push(`${card.label}: ${card.value}`);
    }
  }

  if (mapEmbedUrl) {
    lines.push("", `Harita: ${mapEmbedUrl}`);
  }

  if (social.whatsapp || social.instagram || social.youtube || social.facebook) {
    lines.push("", "Sosyal Linkler");
    if (social.whatsapp) {
      lines.push(`WhatsApp: ${social.whatsapp}`);
    }
    if (social.instagram) {
      lines.push(`Instagram: ${social.instagram}`);
    }
    if (social.youtube) {
      lines.push(`YouTube: ${social.youtube}`);
    }
    if (social.facebook) {
      lines.push(`Facebook: ${social.facebook}`);
    }
  }

  return {
    page: normalizeText(lines.join("\n")),
    contact: {
      phone,
      email: emails.find((entry) => /seyriletisim/i.test(entry)) ?? emails.find((entry) => /seyrtv/i.test(entry)) ?? emails[0] ?? null,
      address: addressFromRows ?? addressFromCards ?? addressFromLines,
      mapEmbedUrl,
      whatsapp: social.whatsapp,
      instagram: social.instagram,
      youtube: social.youtube,
      facebook: social.facebook,
    },
  };
}

async function run() {
  const fetchedPages = await Promise.all(
    NAV_PAGE_SLUGS.map(async (slug) => {
      const html = await fetchHtml(toFetchUrl(slug));
      return [slug, html] as const;
    }),
  );

  const pagesBySlug = Object.fromEntries(fetchedPages) as Record<(typeof NAV_PAGE_SLUGS)[number], string>;
  const programLinks = parseProgramLinks(pagesBySlug.programlar);
  const presenterLinks = parsePresenterLinks(pagesBySlug.programcilar);
  const [programs, presenters] = await Promise.all([
    Promise.all(programLinks.map((item) => parseProgramDetail(item.sourcePath, item.title))),
    Promise.all(presenterLinks.map((item) => parsePresenterDetail(item.sourcePath, item.fullName))),
  ]);

  const scheduleHints = parseScheduleHints(pagesBySlug["yayin-akisi"]);
  const contactData = parseContactContent(pagesBySlug.iletisim);
  const streams = unique([...parseStreams(pagesBySlug.seyr), ...parseStreams(pagesBySlug["canli-yayin"])]);

  const payload: LegacyExport = LegacyExportSchema.parse({
    fetchedAt: new Date().toISOString(),
    programs,
    presenters,
    scheduleHints,
    streams,
    pages: {
      seyr: parseHomeContent(pagesBySlug.seyr),
      kurumsal: parseCorporateContent(pagesBySlug.kurumsal),
      "yayin-akisi": parseSchedulePageContent(scheduleHints),
      programlar: parseProgramListPageContent(programs),
      programcilar: parsePresenterListPageContent(presenters),
      "canli-yayin": parseLiveContent(pagesBySlug["canli-yayin"]),
      iletisim: contactData.page,
    },
    contact: contactData.contact,
  });

  const outputPath = resolve(process.cwd(), "scripts", "legacy-export.json");
  await writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");

  console.log(`Legacy export generated: ${outputPath}`);
  console.log(`Programs: ${payload.programs.length}`);
  console.log(`Presenters: ${payload.presenters.length}`);
  console.log(`Schedule rows: ${payload.scheduleHints.length}`);
  console.log(`Streams: ${payload.streams.length}`);
  console.log(`Pages: ${Object.keys(payload.pages).length}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
