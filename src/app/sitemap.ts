import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const defaultLocale = routing.defaultLocale;

  const staticRoutes = [
    "",
    "/movies/popular",
    "/movies/now-playing",
    "/movies/upcoming",
    "/movies/top-rated",
    "/tv/popular",
    "/tv/airing-today",
    "/tv/on-the-air",
    "/tv/top-rated",
    "/people/popular",
    "/genres",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const alternatesLanguages = routing.locales.reduce(
      (acc, locale) => {
        acc[locale] = `${baseUrl}/${locale}${route}`;
        return acc;
      },
      {} as Record<string, string>,
    );

    return {
      url: `${baseUrl}/${defaultLocale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: alternatesLanguages,
      },
    };
  });

  return sitemapEntries;
}
