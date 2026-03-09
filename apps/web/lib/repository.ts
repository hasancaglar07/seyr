import {
  AdminUserSchema,
  AnnouncementSchema,
  ContactMessageInputSchema,
  ContactMessageSchema,
  ContactSettingsMutationSchema,
  ContactSettingsSchema,
  HomeResponseSchema,
  LegacyExportSchema,
  PageMutationSchema,
  PageSchema,
  PresenterMutationSchema,
  PresenterSchema,
  ProgramMutationSchema,
  ProgramSchema,
  PushCampaignInputSchema,
  PushCampaignSchema,
  ScheduleEntryMutationSchema,
  ScheduleEntrySchema,
  StreamMutationSchema,
  StreamSchema,
  normalizeSlug,
  type AdminUser,
  type Announcement,
  type ContactMessage,
  type ContactSettings,
  type HomeResponse,
  type LegacyExport,
  type Page,
  type Presenter,
  type Program,
  type PushCampaign,
  type ScheduleEntry,
  type Stream,
} from "@seyir/contracts";
import {
  legacyContactSettings,
  legacyPages,
  legacyPresenters,
  legacyProgramPresenterMap,
  legacyPrograms,
  legacySchedule,
  legacyStreams,
} from "@/lib/legacy-seed";
import {
  mockAnnouncements,
  mockContactSettings,
  mockPages,
  mockPresenters,
  mockProgramPresenterMap,
  mockPrograms,
  mockSchedule,
  mockStreams,
} from "@/lib/mock-data";
import { getPublicSupabaseClient, getServiceSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";

const inMemoryStreams: Stream[] = (legacyStreams ?? mockStreams).map((item) => ({ ...item }));
const inMemoryPrograms: Program[] = (legacyPrograms ?? mockPrograms).map((item) => ({ ...item }));
const inMemoryPresenters: Presenter[] = (legacyPresenters ?? mockPresenters).map((item) => ({ ...item }));
const inMemoryPages: Page[] = (legacyPages ?? mockPages).map((item) => ({ ...item }));
const inMemorySchedule: ScheduleEntry[] = (legacySchedule ?? mockSchedule).map((item) => ({ ...item }));
const inMemoryProgramPresenterMap: Record<string, string[]> = Object.fromEntries(
  Object.entries(legacyProgramPresenterMap ?? mockProgramPresenterMap).map(([programId, presenterIds]) => [
    programId,
    [...presenterIds],
  ]),
);
const inMemoryAnnouncements: Announcement[] = mockAnnouncements.map((item) => ({ ...item }));
const inMemoryContactMessages: ContactMessage[] = [];
const inMemoryPushCampaigns: PushCampaign[] = [];
const inMemoryAdminUsers: AdminUser[] = [
  {
    id: "8245ab38-bb46-43b0-b8fc-3d87824b11a1",
    userId: "9bb6bd1c-ded3-4f16-8b9f-884ee6d918ea",
    role: "ADMIN",
    fullName: "Platform Admin",
    isActive: true,
    createdAt: "2026-03-07T00:00:00.000Z",
    updatedAt: "2026-03-07T00:00:00.000Z",
  },
  {
    id: "5feea5cc-f22d-4adb-81be-1092e3bdf0da",
    userId: "f34a2e3b-6533-4c5d-88d6-1ca7417f8742",
    role: "EDITOR",
    fullName: "Icerik Editoru",
    isActive: true,
    createdAt: "2026-03-07T00:00:00.000Z",
    updatedAt: "2026-03-07T00:00:00.000Z",
  },
];
let inMemoryContactSettings: ContactSettings = { ...(legacyContactSettings ?? mockContactSettings) };

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return crypto.randomUUID();
}

function cleanText(value?: string | null) {
  const next = value?.trim();
  return next ? next : null;
}

function cleanUrl(value?: string | null) {
  const next = value?.trim();
  return next ? next : null;
}

function cleanUuid(value?: string | null) {
  const next = value?.trim();
  return next ? next : null;
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function sortSchedule(entries: ScheduleEntry[]) {
  return [...entries].sort((left, right) => {
    if (left.dayOfWeek !== right.dayOfWeek) {
      return left.dayOfWeek - right.dayOfWeek;
    }

    return left.startsAt.localeCompare(right.startsAt);
  });
}

function mapStreamRow(row: any): Stream {
  return StreamSchema.parse({
    id: row.id,
    name: row.name,
    key: row.key,
    streamUrl: row.stream_url,
    coverImageUrl: row.cover_image_url,
    isLive: row.is_live,
    orderNo: row.order_no,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapProgramRow(row: any): Program {
  return ProgramSchema.parse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapPresenterRow(row: any): Presenter {
  return PresenterSchema.parse({
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapPageRow(row: any): Page {
  return PageSchema.parse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    seoDescription: row.seo_description,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapScheduleRow(row: any): ScheduleEntry {
  return ScheduleEntrySchema.parse({
    id: row.id,
    dayOfWeek: row.day_of_week,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    title: row.title,
    presenterName: row.presenter_name,
    programId: row.program_id,
    isReplay: row.is_replay,
  });
}

function mapAnnouncementRow(row: any): Announcement {
  return AnnouncementSchema.parse({
    id: row.id,
    title: row.title,
    body: row.body,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  });
}

function mapContactMessageRow(row: any): ContactMessage {
  return ContactMessageSchema.parse({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  });
}

function mapPushCampaignRow(row: any): PushCampaign {
  return PushCampaignSchema.parse({
    id: row.id,
    title: row.title,
    body: row.body,
    channel: row.channel,
    createdAt: row.created_at,
    sentAt: row.sent_at,
    scheduledAt: row.scheduled_at,
  });
}

function mapAdminUserRow(row: any): AdminUser {
  return AdminUserSchema.parse({
    id: row.id,
    userId: row.user_id,
    role: row.role,
    fullName: row.full_name,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

async function fetchPrograms(includeUnpublished: boolean): Promise<Program[]> {
  if (!hasSupabaseConfig()) {
    const items = includeUnpublished ? inMemoryPrograms : inMemoryPrograms.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    const items = includeUnpublished ? inMemoryPrograms : inMemoryPrograms.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  let query = client
    .from("programs")
    .select("id,slug,title,summary,body,cover_image_url,is_published,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) {
    const items = includeUnpublished ? inMemoryPrograms : inMemoryPrograms.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  return data.map(mapProgramRow);
}

async function fetchPresenters(includeUnpublished: boolean): Promise<Presenter[]> {
  if (!hasSupabaseConfig()) {
    const items = includeUnpublished ? inMemoryPresenters : inMemoryPresenters.filter((item) => item.isPublished);
    return [...items].sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    const items = includeUnpublished ? inMemoryPresenters : inMemoryPresenters.filter((item) => item.isPublished);
    return [...items].sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  let query = client
    .from("presenters")
    .select("id,slug,full_name,bio,avatar_url,is_published,created_at,updated_at")
    .order("full_name", { ascending: true });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) {
    const items = includeUnpublished ? inMemoryPresenters : inMemoryPresenters.filter((item) => item.isPublished);
    return [...items].sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  return data.map(mapPresenterRow);
}

async function fetchPages(includeUnpublished: boolean): Promise<Page[]> {
  if (!hasSupabaseConfig()) {
    const items = includeUnpublished ? inMemoryPages : inMemoryPages.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    const items = includeUnpublished ? inMemoryPages : inMemoryPages.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  let query = client
    .from("pages")
    .select("id,slug,title,content,seo_description,is_published,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) {
    const items = includeUnpublished ? inMemoryPages : inMemoryPages.filter((item) => item.isPublished);
    return sortByUpdatedAt(items);
  }

  return data.map(mapPageRow);
}

async function syncProgramPresenters(programId: string, presenterIds: string[]) {
  const nextPresenterIds = Array.from(new Set(presenterIds));

  if (!hasSupabaseConfig()) {
    inMemoryProgramPresenterMap[programId] = nextPresenterIds;
    return;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    inMemoryProgramPresenterMap[programId] = nextPresenterIds;
    return;
  }

  const { error: deleteError } = await client.from("program_presenters").delete().eq("program_id", programId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (nextPresenterIds.length === 0) {
    return;
  }

  const { error: insertError } = await client.from("program_presenters").insert(
    nextPresenterIds.map((presenterId) => ({
      program_id: programId,
      presenter_id: presenterId,
    })),
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

async function getProgramPresenterIds(programId: string) {
  if (!hasSupabaseConfig()) {
    return inMemoryProgramPresenterMap[programId] ?? [];
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return inMemoryProgramPresenterMap[programId] ?? [];
  }

  const { data, error } = await client.from("program_presenters").select("presenter_id").eq("program_id", programId);
  if (error || !data) {
    return inMemoryProgramPresenterMap[programId] ?? [];
  }

  return data.map((row) => row.presenter_id);
}

function ensureUniqueSlug(items: Array<{ id: string; slug: string }>, baseSlug: string, currentId?: string) {
  const initialSlug = baseSlug || "icerik";
  let slug = initialSlug;
  let counter = 2;

  while (items.some((item) => item.slug === slug && item.id !== currentId)) {
    slug = `${initialSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function getAnnouncements() {
  if (!hasSupabaseConfig()) {
    return [...inMemoryAnnouncements];
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return [...inMemoryAnnouncements];
  }

  const { data, error } = await client
    .from("announcements")
    .select("id,title,body,starts_at,ends_at")
    .order("starts_at", { ascending: false })
    .limit(8);

  if (error || !data) {
    return [...inMemoryAnnouncements];
  }

  return data.map(mapAnnouncementRow);
}

export async function getStreams(): Promise<Stream[]> {
  if (!hasSupabaseConfig()) {
    return [...inMemoryStreams].sort((left, right) => left.orderNo - right.orderNo);
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return [...inMemoryStreams].sort((left, right) => left.orderNo - right.orderNo);
  }

  const { data, error } = await client
    .from("streams")
    .select("id,name,key,stream_url,cover_image_url,is_live,order_no,created_at,updated_at")
    .order("order_no", { ascending: true });

  if (error || !data) {
    return [...inMemoryStreams].sort((left, right) => left.orderNo - right.orderNo);
  }

  return data.map(mapStreamRow);
}

export async function listAdminStreams() {
  return getStreams();
}

export async function saveStream(payload: unknown) {
  const parsed = StreamMutationSchema.parse(payload);
  const timestamp = nowIso();
  const fallbackInput = {
    name: parsed.name.trim(),
    key: normalizeSlug(parsed.key?.trim() || parsed.name),
    streamUrl: parsed.streamUrl,
    coverImageUrl: cleanUrl(parsed.coverImageUrl),
    isLive: parsed.isLive,
    orderNo: parsed.orderNo,
  };

  if (!hasSupabaseConfig()) {
    const existingIndex = parsed.id ? inMemoryStreams.findIndex((item) => item.id === parsed.id) : -1;
    const nextRecord: Stream = StreamSchema.parse({
      id: parsed.id ?? createId(),
      createdAt: existingIndex >= 0 ? inMemoryStreams[existingIndex].createdAt : timestamp,
      updatedAt: timestamp,
      ...fallbackInput,
    });

    if (existingIndex >= 0) {
      inMemoryStreams[existingIndex] = nextRecord;
    } else {
      inMemoryStreams.push(nextRecord);
    }

    return nextRecord;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const writePayload = {
    name: fallbackInput.name,
    key: fallbackInput.key,
    stream_url: fallbackInput.streamUrl,
    cover_image_url: fallbackInput.coverImageUrl,
    is_live: fallbackInput.isLive,
    order_no: fallbackInput.orderNo,
  };

  const query = parsed.id
    ? client.from("streams").update(writePayload).eq("id", parsed.id)
    : client.from("streams").insert(writePayload);

  const { data, error } = await query
    .select("id,name,key,stream_url,cover_image_url,is_live,order_no,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Stream save failed.");
  }

  return mapStreamRow(data);
}

export async function deleteStream(id: string) {
  if (!hasSupabaseConfig()) {
    const index = inMemoryStreams.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Stream not found.");
    }

    inMemoryStreams.splice(index, 1);
    return { ok: true as const };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const { error } = await client.from("streams").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}

export async function getSchedule(): Promise<ScheduleEntry[]> {
  if (!hasSupabaseConfig()) {
    return sortSchedule(inMemorySchedule);
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return sortSchedule(inMemorySchedule);
  }

  const { data, error } = await client
    .from("schedule_entries")
    .select("id,day_of_week,starts_at,ends_at,title,presenter_name,program_id,is_replay")
    .order("day_of_week", { ascending: true })
    .order("starts_at", { ascending: true });

  if (error || !data) {
    return sortSchedule(inMemorySchedule);
  }

  return data.map(mapScheduleRow);
}

export async function listAdminSchedule() {
  return getSchedule();
}

export async function saveScheduleEntry(payload: unknown) {
  const parsed = ScheduleEntryMutationSchema.parse(payload);
  const fallbackInput = {
    dayOfWeek: parsed.dayOfWeek,
    startsAt: parsed.startsAt,
    endsAt: cleanText(parsed.endsAt),
    title: parsed.title.trim(),
    presenterName: cleanText(parsed.presenterName),
    programId: cleanUuid(parsed.programId),
    isReplay: parsed.isReplay,
  };

  if (!hasSupabaseConfig()) {
    const existingIndex = parsed.id ? inMemorySchedule.findIndex((item) => item.id === parsed.id) : -1;
    const nextRecord: ScheduleEntry = ScheduleEntrySchema.parse({
      id: parsed.id ?? createId(),
      ...fallbackInput,
    });

    if (existingIndex >= 0) {
      inMemorySchedule[existingIndex] = nextRecord;
    } else {
      inMemorySchedule.push(nextRecord);
    }

    return nextRecord;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const writePayload = {
    day_of_week: fallbackInput.dayOfWeek,
    starts_at: fallbackInput.startsAt,
    ends_at: fallbackInput.endsAt,
    title: fallbackInput.title,
    presenter_name: fallbackInput.presenterName,
    program_id: fallbackInput.programId,
    is_replay: fallbackInput.isReplay,
  };

  const query = parsed.id
    ? client.from("schedule_entries").update(writePayload).eq("id", parsed.id)
    : client.from("schedule_entries").insert(writePayload);

  const { data, error } = await query
    .select("id,day_of_week,starts_at,ends_at,title,presenter_name,program_id,is_replay")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Schedule save failed.");
  }

  return mapScheduleRow(data);
}

export async function deleteScheduleEntry(id: string) {
  if (!hasSupabaseConfig()) {
    const index = inMemorySchedule.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Schedule entry not found.");
    }

    inMemorySchedule.splice(index, 1);
    return { ok: true as const };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const { error } = await client.from("schedule_entries").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}

export async function getPrograms(): Promise<Program[]> {
  return fetchPrograms(false);
}

export async function listAdminPrograms() {
  return fetchPrograms(true);
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug) ?? null;
}

export async function saveProgram(payload: unknown) {
  const parsed = ProgramMutationSchema.parse(payload);
  const timestamp = nowIso();
  const slugBase = normalizeSlug(parsed.slug?.trim() || parsed.title);
  const presenterIds = parsed.presenterIds
    ? Array.from(new Set(parsed.presenterIds))
    : parsed.id
      ? await getProgramPresenterIds(parsed.id)
      : [];

  if (!hasSupabaseConfig()) {
    const existingIndex = parsed.id ? inMemoryPrograms.findIndex((item) => item.id === parsed.id) : -1;
    const slug = ensureUniqueSlug(inMemoryPrograms, slugBase, parsed.id);
    const nextRecord: Program = ProgramSchema.parse({
      id: parsed.id ?? createId(),
      slug,
      title: parsed.title.trim(),
      summary: cleanText(parsed.summary),
      body: cleanText(parsed.body),
      coverImageUrl: cleanUrl(parsed.coverImageUrl),
      isPublished: parsed.isPublished,
      createdAt: existingIndex >= 0 ? inMemoryPrograms[existingIndex].createdAt : timestamp,
      updatedAt: timestamp,
    });

    if (existingIndex >= 0) {
      inMemoryPrograms[existingIndex] = nextRecord;
    } else {
      inMemoryPrograms.unshift(nextRecord);
    }

    inMemoryProgramPresenterMap[nextRecord.id] = presenterIds;
    return nextRecord;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const existingPrograms = await listAdminPrograms();
  const slug = ensureUniqueSlug(existingPrograms, slugBase, parsed.id);
  const writePayload = {
    slug,
    title: parsed.title.trim(),
    summary: cleanText(parsed.summary),
    body: cleanText(parsed.body),
    cover_image_url: cleanUrl(parsed.coverImageUrl),
    is_published: parsed.isPublished,
  };

  const query = parsed.id
    ? client.from("programs").update(writePayload).eq("id", parsed.id)
    : client.from("programs").insert(writePayload);

  const { data, error } = await query
    .select("id,slug,title,summary,body,cover_image_url,is_published,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Program save failed.");
  }

  await syncProgramPresenters(data.id, presenterIds);
  return mapProgramRow(data);
}

export async function deleteProgram(id: string) {
  if (!hasSupabaseConfig()) {
    const index = inMemoryPrograms.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Program not found.");
    }

    inMemoryPrograms.splice(index, 1);
    delete inMemoryProgramPresenterMap[id];
    inMemorySchedule.forEach((entry, entryIndex) => {
      if (entry.programId === id) {
        inMemorySchedule[entryIndex] = { ...entry, programId: null };
      }
    });

    return { ok: true as const };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const { error } = await client.from("programs").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}

export async function getPresenters(): Promise<Presenter[]> {
  return fetchPresenters(false);
}

export async function listAdminPresenters() {
  return fetchPresenters(true);
}

export async function getPresenterBySlug(slug: string): Promise<Presenter | null> {
  const presenters = await getPresenters();
  return presenters.find((presenter) => presenter.slug === slug) ?? null;
}

export async function savePresenter(payload: unknown) {
  const parsed = PresenterMutationSchema.parse(payload);
  const timestamp = nowIso();
  const slugBase = normalizeSlug(parsed.slug?.trim() || parsed.fullName);

  if (!hasSupabaseConfig()) {
    const existingIndex = parsed.id ? inMemoryPresenters.findIndex((item) => item.id === parsed.id) : -1;
    const slug = ensureUniqueSlug(inMemoryPresenters, slugBase, parsed.id);
    const nextRecord: Presenter = PresenterSchema.parse({
      id: parsed.id ?? createId(),
      slug,
      fullName: parsed.fullName.trim(),
      bio: cleanText(parsed.bio),
      avatarUrl: cleanUrl(parsed.avatarUrl),
      isPublished: parsed.isPublished,
      createdAt: existingIndex >= 0 ? inMemoryPresenters[existingIndex].createdAt : timestamp,
      updatedAt: timestamp,
    });

    if (existingIndex >= 0) {
      inMemoryPresenters[existingIndex] = nextRecord;
    } else {
      inMemoryPresenters.unshift(nextRecord);
    }

    return nextRecord;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const existingPresenters = await listAdminPresenters();
  const slug = ensureUniqueSlug(existingPresenters, slugBase, parsed.id);
  const writePayload = {
    slug,
    full_name: parsed.fullName.trim(),
    bio: cleanText(parsed.bio),
    avatar_url: cleanUrl(parsed.avatarUrl),
    is_published: parsed.isPublished,
  };

  const query = parsed.id
    ? client.from("presenters").update(writePayload).eq("id", parsed.id)
    : client.from("presenters").insert(writePayload);

  const { data, error } = await query
    .select("id,slug,full_name,bio,avatar_url,is_published,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Presenter save failed.");
  }

  return mapPresenterRow(data);
}

export async function deletePresenter(id: string) {
  if (!hasSupabaseConfig()) {
    const index = inMemoryPresenters.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Presenter not found.");
    }

    inMemoryPresenters.splice(index, 1);
    Object.entries(inMemoryProgramPresenterMap).forEach(([programId, presenterIds]) => {
      inMemoryProgramPresenterMap[programId] = presenterIds.filter((presenterId) => presenterId !== id);
    });

    return { ok: true as const };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const { error } = await client.from("presenters").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}

export async function listPages() {
  return fetchPages(true);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pages = await fetchPages(false);
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function savePage(payload: unknown) {
  const parsed = PageMutationSchema.parse(payload);
  const timestamp = nowIso();
  const slugBase = normalizeSlug(parsed.slug?.trim() || parsed.title);

  if (!hasSupabaseConfig()) {
    const existingIndex = parsed.id ? inMemoryPages.findIndex((item) => item.id === parsed.id) : -1;
    const slug = ensureUniqueSlug(inMemoryPages, slugBase, parsed.id);
    const nextRecord: Page = PageSchema.parse({
      id: parsed.id ?? createId(),
      slug,
      title: parsed.title.trim(),
      content: cleanText(parsed.content),
      seoDescription: cleanText(parsed.seoDescription),
      isPublished: parsed.isPublished,
      createdAt: existingIndex >= 0 ? inMemoryPages[existingIndex].createdAt : timestamp,
      updatedAt: timestamp,
    });

    if (existingIndex >= 0) {
      inMemoryPages[existingIndex] = nextRecord;
    } else {
      inMemoryPages.unshift(nextRecord);
    }

    return nextRecord;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const existingPages = await listPages();
  const slug = ensureUniqueSlug(existingPages, slugBase, parsed.id);
  const writePayload = {
    slug,
    title: parsed.title.trim(),
    content: cleanText(parsed.content),
    seo_description: cleanText(parsed.seoDescription),
    is_published: parsed.isPublished,
  };

  const query = parsed.id
    ? client.from("pages").update(writePayload).eq("id", parsed.id)
    : client.from("pages").insert(writePayload);

  const { data, error } = await query
    .select("id,slug,title,content,seo_description,is_published,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Page save failed.");
  }

  return mapPageRow(data);
}

export async function deletePage(id: string) {
  if (!hasSupabaseConfig()) {
    const index = inMemoryPages.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Page not found.");
    }

    inMemoryPages.splice(index, 1);
    return { ok: true as const };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const { error } = await client.from("pages").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}

export async function getContactSettings() {
  if (!hasSupabaseConfig()) {
    return { ...inMemoryContactSettings };
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return { ...inMemoryContactSettings };
  }

  const { data, error } = await client
    .from("contact_settings")
    .select("id,phone,email,address,map_embed_url,whatsapp,instagram,youtube,facebook,updated_at")
    .limit(1)
    .single();

  if (error || !data) {
    return { ...inMemoryContactSettings };
  }

  return ContactSettingsSchema.parse({
    id: data.id,
    phone: data.phone,
    email: data.email,
    address: data.address,
    mapEmbedUrl: data.map_embed_url,
    whatsapp: data.whatsapp,
    instagram: data.instagram,
    youtube: data.youtube,
    facebook: data.facebook,
    updatedAt: data.updated_at,
  });
}

export async function updateContactSettings(payload: unknown) {
  const parsed = ContactSettingsMutationSchema.parse(payload);
  const timestamp = nowIso();

  if (!hasSupabaseConfig()) {
    inMemoryContactSettings = ContactSettingsSchema.parse({
      id: parsed.id ?? inMemoryContactSettings.id,
      phone: cleanText(parsed.phone),
      email: cleanText(parsed.email),
      address: cleanText(parsed.address),
      mapEmbedUrl: cleanUrl(parsed.mapEmbedUrl),
      whatsapp: cleanText(parsed.whatsapp),
      instagram: cleanText(parsed.instagram),
      youtube: cleanText(parsed.youtube),
      facebook: cleanText(parsed.facebook),
      updatedAt: timestamp,
    });

    return inMemoryContactSettings;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured.");
  }

  const current = await getContactSettings();
  const id = parsed.id ?? current.id;
  const writePayload = {
    id,
    phone: cleanText(parsed.phone),
    email: cleanText(parsed.email),
    address: cleanText(parsed.address),
    map_embed_url: cleanUrl(parsed.mapEmbedUrl),
    whatsapp: cleanText(parsed.whatsapp),
    instagram: cleanText(parsed.instagram),
    youtube: cleanText(parsed.youtube),
    facebook: cleanText(parsed.facebook),
    updated_at: timestamp,
  };

  const { data, error } = await client
    .from("contact_settings")
    .upsert(writePayload, { onConflict: "id" })
    .select("id,phone,email,address,map_embed_url,whatsapp,instagram,youtube,facebook,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Contact settings save failed.");
  }

  return ContactSettingsSchema.parse({
    id: data.id,
    phone: data.phone,
    email: data.email,
    address: data.address,
    mapEmbedUrl: data.map_embed_url,
    whatsapp: data.whatsapp,
    instagram: data.instagram,
    youtube: data.youtube,
    facebook: data.facebook,
    updatedAt: data.updated_at,
  });
}

export async function getHomeData(): Promise<HomeResponse> {
  const [streams, featuredPrograms, featuredPresenters, announcements] = await Promise.all([
    getStreams(),
    getPrograms(),
    getPresenters(),
    getAnnouncements(),
  ]);

  return HomeResponseSchema.parse({
    streams,
    featuredPrograms: featuredPrograms.slice(0, 6),
    featuredPresenters: featuredPresenters.slice(0, 6),
    announcements,
  });
}

export async function createContactMessage(payload: unknown) {
  const parsed = ContactMessageInputSchema.parse(payload);
  const row = ContactMessageSchema.parse({
    id: createId(),
    fullName: parsed.fullName,
    email: parsed.email,
    subject: parsed.subject,
    message: parsed.message,
    status: "NEW",
    createdAt: nowIso(),
  });

  if (!hasSupabaseConfig()) {
    inMemoryContactMessages.unshift(row);
    return row;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    inMemoryContactMessages.unshift(row);
    return row;
  }

  const { error } = await client.from("contact_messages").insert({
    id: row.id,
    full_name: row.fullName,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    created_at: row.createdAt,
  });

  if (error) {
    inMemoryContactMessages.unshift(row);
  }

  return row;
}

export async function listContactMessages() {
  if (!hasSupabaseConfig()) {
    return [...inMemoryContactMessages];
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    return [...inMemoryContactMessages];
  }

  const { data, error } = await client
    .from("contact_messages")
    .select("id,full_name,email,subject,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) {
    return [...inMemoryContactMessages];
  }

  return data.map(mapContactMessageRow);
}

export async function createPushCampaign(payload: unknown) {
  const parsed = PushCampaignInputSchema.parse(payload);
  const sentAt = parsed.sendNow ? nowIso() : null;
  const row = PushCampaignSchema.parse({
    id: createId(),
    title: parsed.title,
    body: parsed.body,
    channel: parsed.channel,
    createdAt: nowIso(),
    sentAt,
    scheduledAt: parsed.sendNow ? null : parsed.scheduledAt,
  });

  if (!hasSupabaseConfig()) {
    inMemoryPushCampaigns.unshift(row);
    return row;
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    inMemoryPushCampaigns.unshift(row);
    return row;
  }

  const { error } = await client.from("push_campaigns").insert({
    id: row.id,
    title: row.title,
    body: row.body,
    channel: row.channel,
    created_at: row.createdAt,
    scheduled_at: row.scheduledAt,
    sent_at: row.sentAt,
  });

  if (error) {
    inMemoryPushCampaigns.unshift(row);
  }

  return row;
}

export async function listPushCampaigns() {
  if (!hasSupabaseConfig()) {
    return [...inMemoryPushCampaigns];
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    return [...inMemoryPushCampaigns];
  }

  const { data, error } = await client
    .from("push_campaigns")
    .select("id,title,body,channel,created_at,scheduled_at,sent_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) {
    return [...inMemoryPushCampaigns];
  }

  return data.map(mapPushCampaignRow);
}

export async function listAdminUsers() {
  if (!hasSupabaseConfig()) {
    return [...inMemoryAdminUsers];
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    return [...inMemoryAdminUsers];
  }

  const { data, error } = await client
    .from("admin_users")
    .select("id,user_id,role,full_name,is_active,created_at,updated_at")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [...inMemoryAdminUsers];
  }

  return data.map(mapAdminUserRow);
}

export async function getProgramPresenters(programId: string): Promise<Presenter[]> {
  const [presenterIds, presenters] = await Promise.all([getProgramPresenterIds(programId), getPresenters()]);
  return presenters.filter((presenter) => presenterIds.includes(presenter.id));
}

export async function getPresenterPrograms(presenterId: string): Promise<Program[]> {
  const programs = await getPrograms();

  if (!hasSupabaseConfig()) {
    return programs.filter((program) => (inMemoryProgramPresenterMap[program.id] ?? []).includes(presenterId));
  }

  const client = getPublicSupabaseClient();
  if (!client) {
    return programs.filter((program) => (inMemoryProgramPresenterMap[program.id] ?? []).includes(presenterId));
  }

  const { data, error } = await client.from("program_presenters").select("program_id").eq("presenter_id", presenterId);
  if (error || !data) {
    return programs.filter((program) => (inMemoryProgramPresenterMap[program.id] ?? []).includes(presenterId));
  }

  const programIds = new Set(data.map((row) => row.program_id));
  return programs.filter((program) => programIds.has(program.id));
}

function deriveLegacyDayIndex(hint: LegacyExport["scheduleHints"][number], index: number) {
  const normalizedDay = normalizeSlug(hint.day ?? "");
  const byName: Record<string, number> = {
    pazar: 0,
    pazartesi: 1,
    sali: 2,
    carsamba: 3,
    persembe: 4,
    cuma: 5,
    cumartesi: 6,
  };

  if (normalizedDay in byName) {
    return byName[normalizedDay];
  }

  return index % 7;
}

export async function importLegacySnapshot(payload: unknown) {
  const parsed = LegacyExportSchema.parse(payload);
  const savedPrograms = new Map((await listAdminPrograms()).map((program) => [program.slug, program]));
  const savedPresenters = new Map((await listAdminPresenters()).map((presenter) => [presenter.slug, presenter]));
  const existingPages = new Map((await listPages()).map((page) => [page.slug, page]));
  const streamList = await listAdminStreams();

  let programCount = 0;
  let presenterCount = 0;
  let scheduleCount = 0;
  let streamCount = 0;
  let pageCount = 0;

  for (const item of parsed.presenters) {
    const saved = await savePresenter({
      id: savedPresenters.get(item.slug)?.id,
      slug: item.slug,
      fullName: item.fullName,
      bio: item.bio ?? null,
      avatarUrl: item.avatarUrl ?? null,
      isPublished: true,
    });

    savedPresenters.set(saved.slug, saved);
    presenterCount += 1;
  }

  const programPresenterSlugMap = parsed.scheduleHints.reduce<Record<string, Set<string>>>((acc, entry) => {
    if (!entry.presenterName) {
      return acc;
    }

    const programSlug = normalizeSlug(entry.title);
    const presenterSlug = normalizeSlug(entry.presenterName);
    acc[programSlug] = acc[programSlug] ?? new Set<string>();
    acc[programSlug].add(presenterSlug);
    return acc;
  }, {});

  for (const item of parsed.programs) {
    const presenterIds = [...(programPresenterSlugMap[item.slug] ?? new Set<string>())]
      .map((presenterSlug) => savedPresenters.get(presenterSlug)?.id)
      .filter((value): value is string => Boolean(value));

    const saved = await saveProgram({
      id: savedPrograms.get(item.slug)?.id,
      slug: item.slug,
      title: item.title,
      summary: item.summary ?? null,
      body: item.body ?? item.summary ?? null,
      coverImageUrl: item.imageUrl ?? null,
      isPublished: true,
      presenterIds,
    });

    savedPrograms.set(saved.slug, saved);
    programCount += 1;
  }

  for (const [index, item] of parsed.scheduleHints.entries()) {
    const normalizedTitle = normalizeSlug(item.title);
    const program = savedPrograms.get(normalizedTitle);
    const presenter =
      (item.presenterName
        ? [...savedPresenters.values()].find((entry) => entry.slug === normalizeSlug(item.presenterName ?? ""))
        : null) ?? [...savedPresenters.values()].find((entry) => normalizedTitle.includes(entry.slug));

    await saveScheduleEntry({
      dayOfWeek: deriveLegacyDayIndex(item, index),
      startsAt: item.time,
      endsAt: null,
      title: item.title,
      presenterName: item.presenterName ?? presenter?.fullName ?? null,
      programId: program?.id ?? null,
      isReplay: item.isReplay ?? false,
    });

    scheduleCount += 1;
  }

  for (const [index, streamUrl] of parsed.streams.entries()) {
    const existing = streamList[index];
    await saveStream({
      id: existing?.id,
      name: existing?.name ?? `Legacy Stream ${index + 1}`,
      key: existing?.key ?? `legacy-stream-${index + 1}`,
      streamUrl,
      coverImageUrl: existing?.coverImageUrl ?? null,
      isLive: index === 0,
      orderNo: index + 1,
    });

    streamCount += 1;
  }

  for (const [slug, content] of Object.entries(parsed.pages)) {
    await savePage({
      id: existingPages.get(slug)?.id,
      slug,
      title:
        slug === "kurumsal"
          ? "Seyr FM"
          : slug === "iletisim"
            ? "İletişim"
            : slug
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" "),
      content,
      seoDescription: `${slug} arşiv içeriği`,
      isPublished: true,
    });

    pageCount += 1;
  }

  if (parsed.contact) {
    await updateContactSettings({
      phone: parsed.contact.phone ?? null,
      email: parsed.contact.email ?? null,
      address: parsed.contact.address ?? null,
      mapEmbedUrl: parsed.contact.mapEmbedUrl ?? null,
      whatsapp: parsed.contact.whatsapp ?? null,
      instagram: parsed.contact.instagram ?? null,
      youtube: parsed.contact.youtube ?? null,
      facebook: parsed.contact.facebook ?? null,
    });
  }

  return {
    fetchedAt: parsed.fetchedAt,
    programs: programCount,
    presenters: presenterCount,
    scheduleEntries: scheduleCount,
    streams: streamCount,
    pages: pageCount,
  };
}
