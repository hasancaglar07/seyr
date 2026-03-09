import type { ScheduleEntry } from "@seyir/contracts";

export const DAY_LABELS = ["Pazar", "Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi"] as const;

export function splitParagraphs(text?: string | null) {
  return (text ?? "")
    .split(/\n{2,}|\r\n\r\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function summarizeText(text: string | null | undefined, fallback: string, limit = 180) {
  const value = text?.trim();
  if (!value) {
    return fallback;
  }

  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trim()}...`;
}

export function groupScheduleByDay(entries: ScheduleEntry[]) {
  return DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek,
    label,
    entries: entries.filter((entry) => entry.dayOfWeek === dayOfWeek),
  })).filter((day) => day.entries.length > 0);
}

export function getCurrentOrNextSchedule(entries: ScheduleEntry[]) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const ranked = [...entries].sort((left, right) => {
    if (left.dayOfWeek !== right.dayOfWeek) {
      return left.dayOfWeek - right.dayOfWeek;
    }

    return left.startsAt.localeCompare(right.startsAt);
  });

  return (
    ranked.find((entry) => {
      if (entry.dayOfWeek !== currentDay) {
        return false;
      }

      const [hours, minutes] = entry.startsAt.split(":").map(Number);
      return hours * 60 + minutes >= currentMinutes;
    }) ?? ranked[0] ?? null
  );
}
