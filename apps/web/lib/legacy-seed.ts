import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import type { ContactSettings, Page, Presenter, Program, ScheduleEntry, Stream } from "@seyir/contracts";
import { LegacyExportSchema, normalizeSlug } from "@seyir/contracts";
import { resolveWorkspacePath } from "@/lib/workspace-path";

const now = "2026-03-07T00:00:00.000Z";
const LOCAL_LOGO_PATH = "/assets/seyr-logo.png";

function stableUuid(input: string) {
  const hex = createHash("sha1").update(input).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function readLegacyExport() {
  try {
    const path = resolveWorkspacePath("scripts", "legacy-export.json");
    if (!existsSync(path)) {
      return null;
    }

    const raw = readFileSync(path, "utf8");
    return LegacyExportSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

function dayToIndex(day?: string) {
  const value = normalizeSlug(day ?? "");
  const map: Record<string, number> = {
    pazar: 0,
    pazartesi: 1,
    sali: 2,
    carsamba: 3,
    persembe: 4,
    cuma: 5,
    cumartesi: 6,
  };

  return map[value] ?? 0;
}

const legacy = readLegacyExport();
const legacyLiveCover =
  legacy?.pages?.["canli-yayin"]?.match(/https?:\/\/\S*seyrreklam\S*/i)?.[0]?.replace(/[),.;]+$/, "") ?? null;

const legacyPrograms: Program[] | null = legacy
  ? legacy.programs.map((program) => ({
      id: stableUuid(`program:${program.slug}`),
      slug: program.slug,
      title: program.title,
      summary:
        program.summary ??
        `Seyr arsivinden aktarilan ${program.title.toLocaleLowerCase("tr-TR")} program icerigi.`,
      body: program.body ?? program.summary ?? null,
      coverImageUrl: program.imageUrl ?? null,
      isPublished: true,
      createdAt: now,
      updatedAt: legacy.fetchedAt,
    }))
  : null;

const legacyPresenters: Presenter[] | null = legacy
  ? legacy.presenters.map((presenter) => ({
      id: stableUuid(`presenter:${presenter.slug}`),
      slug: presenter.slug,
      fullName: presenter.fullName,
      bio: presenter.bio ?? `${presenter.fullName} icin arsiv biyografi icerigi henuz zenginlestiriliyor.`,
      avatarUrl: presenter.avatarUrl ?? null,
      isPublished: true,
      createdAt: now,
      updatedAt: legacy.fetchedAt,
    }))
  : null;

const legacyPages: Page[] | null = legacy
  ? Object.entries(legacy.pages).map(([slug, content]) => ({
      id: stableUuid(`page:${slug}`),
      slug,
      title:
        slug === "kurumsal"
          ? "Seyr FM"
          : slug === "iletisim"
            ? "Iletisim"
            : slug
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" "),
      content,
      seoDescription: `${slug} sayfasi arsiv icerigi`,
      isPublished: true,
      createdAt: now,
      updatedAt: legacy.fetchedAt,
    }))
  : null;

const legacyStreams: Stream[] | null = legacy
  ? legacy.streams.map((streamUrl, index) => ({
      id: stableUuid(`stream:${streamUrl}`),
      name: index === 0 ? "Seyr FM" : `Seyr Stream ${index + 1}`,
      key: index === 0 ? "seyr-fm" : `seyr-stream-${index + 1}`,
      streamUrl,
      coverImageUrl: index === 0 ? legacyLiveCover ?? LOCAL_LOGO_PATH : LOCAL_LOGO_PATH,
      isLive: index === 0,
      orderNo: index + 1,
      createdAt: now,
      updatedAt: legacy.fetchedAt,
    }))
  : null;

const presenterIdBySlug = new Map((legacyPresenters ?? []).map((presenter) => [presenter.slug, presenter.id]));
const programIdBySlug = new Map((legacyPrograms ?? []).map((program) => [program.slug, program.id]));

const legacyProgramPresenterMap: Record<string, string[]> | null = legacy
  ? legacy.scheduleHints.reduce<Record<string, string[]>>((acc, entry) => {
      if (!entry.presenterName) {
        return acc;
      }

      const programId = programIdBySlug.get(normalizeSlug(entry.title));
      const presenterId = presenterIdBySlug.get(normalizeSlug(entry.presenterName));

      if (!programId || !presenterId) {
        return acc;
      }

      acc[programId] = acc[programId] ?? [];
      if (!acc[programId].includes(presenterId)) {
        acc[programId].push(presenterId);
      }

      return acc;
    }, {})
  : null;

const legacySchedule: ScheduleEntry[] | null = legacy
  ? legacy.scheduleHints.map((entry, index) => ({
      id: stableUuid(`schedule:${entry.day ?? index}:${entry.time}:${entry.title}`),
      dayOfWeek: dayToIndex(entry.day),
      startsAt: entry.time,
      endsAt: null,
      title: entry.title,
      presenterName: entry.presenterName ?? null,
      programId: programIdBySlug.get(normalizeSlug(entry.title)) ?? null,
      isReplay: entry.isReplay ?? false,
    }))
  : null;

const legacyContactSettings: ContactSettings | null = legacy?.contact
  ? {
      id: stableUuid("contact:legacy"),
      phone: legacy.contact.phone ?? null,
      email: legacy.contact.email ?? null,
      address: legacy.contact.address ?? null,
      mapEmbedUrl:
        legacy.contact.mapEmbedUrl ??
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7570192590106!2d28.934807115277817!3d41.03057157929845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caabe852281827%3A0xa663a57ef12365a4!2sSeyr%20Fm!5e0!3m2!1str!2str!4v1600703896700!5m2!1str!2str",
      whatsapp: legacy.contact.whatsapp ?? null,
      instagram: legacy.contact.instagram ?? null,
      youtube: legacy.contact.youtube ?? null,
      facebook: legacy.contact.facebook ?? null,
      updatedAt: legacy.fetchedAt,
    }
  : null;

export const legacySeed = legacy;
export {
  legacyPrograms,
  legacyPresenters,
  legacyPages,
  legacyStreams,
  legacyProgramPresenterMap,
  legacySchedule,
  legacyContactSettings,
};
