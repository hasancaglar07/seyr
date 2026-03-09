import Constants from "expo-constants";
import {
  ContactMessageInputSchema,
  HomeResponseSchema,
  PresenterSchema,
  ProgramSchema,
  ScheduleEntrySchema,
  StreamSchema,
} from "@seyir/contracts";

const baseUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  "http://localhost:3000";

async function request<T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  const data = await response.json();
  return schema.parse(data);
}

export function getHome() {
  return request("/api/v1/home", HomeResponseSchema);
}

export async function getStreams() {
  const response = await fetch(`${baseUrl}/api/v1/streams`);
  const json = await response.json();
  return StreamSchema.array().parse(json);
}

export async function getSchedule() {
  const response = await fetch(`${baseUrl}/api/v1/schedule`);
  const json = await response.json();
  return ScheduleEntrySchema.array().parse(json);
}

export async function getPrograms() {
  const response = await fetch(`${baseUrl}/api/v1/programs`);
  const json = await response.json();
  return ProgramSchema.array().parse(json);
}

export async function getPresenters() {
  const response = await fetch(`${baseUrl}/api/v1/presenters`);
  const json = await response.json();
  return PresenterSchema.array().parse(json);
}

export async function sendContactMessage(input: unknown) {
  const payload = ContactMessageInputSchema.parse(input);

  const response = await fetch(`${baseUrl}/api/v1/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Mesaj gönderilemedi");
  }

  return response.json();
}