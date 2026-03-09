import { describe, expect, it } from "vitest";
import { ContactMessageInputSchema, LegacyExportSchema, ProgramMutationSchema, normalizeSlug } from "../src/index";

describe("normalizeSlug", () => {
  it("normalizes Turkish characters", () => {
    expect(normalizeSlug("HAD\u0130SLERLE \u0130SLAM")).toBe("hadislerle-islam");
    expect(normalizeSlug("\u00c7a\u011fr\u0131 \u015euur")).toBe("cagri-suur");
  });
});

describe("ContactMessageInputSchema", () => {
  it("validates input", () => {
    const parsed = ContactMessageInputSchema.parse({
      fullName: "Ahmet Yilmaz",
      email: "ahmet@example.com",
      subject: "Selam",
      message: "Bu platform harika gorunuyor, basarilar.",
    });

    expect(parsed.fullName).toBe("Ahmet Yilmaz");
  });
});

describe("ProgramMutationSchema", () => {
  it("does not require presenter ids", () => {
    const parsed = ProgramMutationSchema.parse({
      title: "Yeni Program",
      summary: null,
      body: null,
      coverImageUrl: null,
      isPublished: true,
    });

    expect(parsed.presenterIds).toBeUndefined();
  });
});

describe("LegacyExportSchema", () => {
  it("parses a valid export payload", () => {
    const parsed = LegacyExportSchema.parse({
      fetchedAt: "2026-03-07T02:02:30.626Z",
      programs: [{ title: "Program", slug: "program", sourcePath: "program-1" }],
      presenters: [{ fullName: "Sunucu", slug: "sunucu", sourcePath: "programci-1" }],
      scheduleHints: [{ time: "10:00", title: "Program" }],
      streams: ["https://example.com/stream"],
      pages: { kurumsal: "<p>icerik</p>" },
    });

    expect(parsed.programs).toHaveLength(1);
    expect(parsed.scheduleHints[0]?.time).toBe("10:00");
  });
});
