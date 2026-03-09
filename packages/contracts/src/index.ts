import { z } from "zod";

const TimestampSchema = z.string();
const OptionalInputTextSchema = z.string().trim().nullable().optional();
const OptionalInputUrlSchema = z.union([z.string().url(), z.literal(""), z.null()]).optional();
const OptionalInputUuidSchema = z.union([z.string().uuid(), z.literal(""), z.null()]).optional();

export const AdminRoleSchema = z.enum(["ADMIN", "EDITOR"]);
export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().nullable(),
  startsAt: TimestampSchema.nullable(),
  endsAt: TimestampSchema.nullable(),
});

export const StreamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  key: z.string().min(1),
  streamUrl: z.string().url(),
  coverImageUrl: z.string().url().nullable(),
  isLive: z.boolean().default(false),
  orderNo: z.number().int().nonnegative(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const StreamMutationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  key: z.string().trim().optional(),
  streamUrl: z.string().url(),
  coverImageUrl: OptionalInputUrlSchema,
  isLive: z.boolean().default(false),
  orderNo: z.number().int().nonnegative().default(0),
});

export const ScheduleEntrySchema = z.object({
  id: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startsAt: z.string().regex(/^\d{2}:\d{2}$/),
  endsAt: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  title: z.string().min(1),
  presenterName: z.string().nullable(),
  programId: z.string().uuid().nullable(),
  isReplay: z.boolean().default(false),
});

export const ScheduleEntryMutationSchema = z.object({
  id: z.string().uuid().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startsAt: z.string().regex(/^\d{2}:\d{2}$/),
  endsAt: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal(""), z.null()]).optional(),
  title: z.string().trim().min(1),
  presenterName: OptionalInputTextSchema,
  programId: OptionalInputUuidSchema,
  isReplay: z.boolean().default(false),
});

export const ProgramSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable(),
  body: z.string().nullable(),
  coverImageUrl: z.string().url().nullable(),
  isPublished: z.boolean().default(true),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const ProgramMutationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().optional(),
  title: z.string().trim().min(1),
  summary: OptionalInputTextSchema,
  body: OptionalInputTextSchema,
  coverImageUrl: OptionalInputUrlSchema,
  isPublished: z.boolean().default(true),
  presenterIds: z.array(z.string().uuid()).optional(),
});

export const PresenterSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  fullName: z.string().min(1),
  bio: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  isPublished: z.boolean().default(true),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const PresenterMutationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().optional(),
  fullName: z.string().trim().min(1),
  bio: OptionalInputTextSchema,
  avatarUrl: OptionalInputUrlSchema,
  isPublished: z.boolean().default(true),
});

export const PageSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().nullable(),
  seoDescription: z.string().nullable(),
  isPublished: z.boolean().default(true),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const PageMutationSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().optional(),
  title: z.string().trim().min(1),
  content: OptionalInputTextSchema,
  seoDescription: OptionalInputTextSchema,
  isPublished: z.boolean().default(true),
});

export const ContactSettingsSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  address: z.string().nullable(),
  mapEmbedUrl: z.string().url().nullable(),
  whatsapp: z.string().nullable(),
  instagram: z.string().nullable(),
  youtube: z.string().nullable(),
  facebook: z.string().nullable(),
  updatedAt: TimestampSchema,
});

export const ContactSettingsMutationSchema = z.object({
  id: z.string().uuid().optional(),
  phone: OptionalInputTextSchema,
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  address: OptionalInputTextSchema,
  mapEmbedUrl: OptionalInputUrlSchema,
  whatsapp: OptionalInputTextSchema,
  instagram: OptionalInputTextSchema,
  youtube: OptionalInputTextSchema,
  facebook: OptionalInputTextSchema,
});

export const ContactMessageSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  status: z.enum(["NEW", "READ", "ARCHIVED"]),
  createdAt: TimestampSchema,
});

export const ContactMessageInputSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export const PushCampaignSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  channel: z.enum(["ANNOUNCEMENT", "LIVE_START"]),
  createdAt: TimestampSchema,
  sentAt: TimestampSchema.nullable(),
  scheduledAt: TimestampSchema.nullable(),
});

export const PushCampaignInputSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  channel: z.enum(["ANNOUNCEMENT", "LIVE_START"]),
  sendNow: z.boolean().default(true),
  scheduledAt: TimestampSchema.nullable(),
});

export const AdminUserSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: AdminRoleSchema,
  fullName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const HomeResponseSchema = z.object({
  streams: z.array(StreamSchema),
  featuredPrograms: z.array(ProgramSchema),
  featuredPresenters: z.array(PresenterSchema),
  announcements: z.array(AnnouncementSchema),
});

export const LegacyProgramSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  sourcePath: z.string().min(1),
  summary: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export const LegacyPresenterSchema = z.object({
  fullName: z.string().min(1),
  slug: z.string().min(1),
  sourcePath: z.string().min(1),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const LegacyScheduleHintSchema = z.object({
  day: z.string().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().min(1),
  presenterName: z.string().nullable().optional(),
  isReplay: z.boolean().optional(),
});

export const LegacyExportSchema = z.object({
  fetchedAt: TimestampSchema,
  programs: z.array(LegacyProgramSchema),
  presenters: z.array(LegacyPresenterSchema),
  scheduleHints: z.array(LegacyScheduleHintSchema),
  streams: z.array(z.string().url()),
  pages: z.record(z.string()),
  contact: z
    .object({
      phone: z.string().nullable().optional(),
      email: z.string().email().nullable().optional(),
      address: z.string().nullable().optional(),
      mapEmbedUrl: z.string().url().nullable().optional(),
      whatsapp: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      youtube: z.string().nullable().optional(),
      facebook: z.string().nullable().optional(),
    })
    .optional(),
});

export type Announcement = z.infer<typeof AnnouncementSchema>;
export type Stream = z.infer<typeof StreamSchema>;
export type StreamMutation = z.infer<typeof StreamMutationSchema>;
export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>;
export type ScheduleEntryMutation = z.infer<typeof ScheduleEntryMutationSchema>;
export type Program = z.infer<typeof ProgramSchema>;
export type ProgramMutation = z.infer<typeof ProgramMutationSchema>;
export type Presenter = z.infer<typeof PresenterSchema>;
export type PresenterMutation = z.infer<typeof PresenterMutationSchema>;
export type Page = z.infer<typeof PageSchema>;
export type PageMutation = z.infer<typeof PageMutationSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;
export type ContactSettingsMutation = z.infer<typeof ContactSettingsMutationSchema>;
export type ContactMessage = z.infer<typeof ContactMessageSchema>;
export type HomeResponse = z.infer<typeof HomeResponseSchema>;
export type ContactMessageInput = z.infer<typeof ContactMessageInputSchema>;
export type PushCampaign = z.infer<typeof PushCampaignSchema>;
export type PushCampaignInput = z.infer<typeof PushCampaignInputSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type LegacyExport = z.infer<typeof LegacyExportSchema>;

const TURKISH_REMAP: Record<string, string> = {
  "\u00e7": "c",
  "\u00c7": "c",
  "\u011f": "g",
  "\u011e": "g",
  "\u0131": "i",
  "\u0130": "i",
  "\u00f6": "o",
  "\u00d6": "o",
  "\u015f": "s",
  "\u015e": "s",
  "\u00fc": "u",
  "\u00dc": "u",
};

export function normalizeSlug(input: string): string {
  const remapped = input
    .split("")
    .map((char) => TURKISH_REMAP[char] ?? char)
    .join("");

  return remapped
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
