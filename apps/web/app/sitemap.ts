import type { MetadataRoute } from "next";

const routes = [
  "",
  "/canli-yayin",
  "/yayin-akisi",
  "/programlar",
  "/programcilar",
  "/kurumsal",
  "/iletisim",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.seyrdijital.com";
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}