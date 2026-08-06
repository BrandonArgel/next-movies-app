import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { InfiniteTvShowGrid } from "@/components/tv-show/infinite-tv-grid";
import { TvShowFilters } from "@/components/tv-show/tv-show-filters";
import { parseTvSearchParams } from "@/lib/filters";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.tv.on_tv");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OnTVPage({ searchParams }: PageProps) {
  const t = await getTranslations("pages.tv.airing_today");
  const resolvedParams = await searchParams;

  const today = new Date().toISOString().split("T")[0];

  const baseCategoryFilters: Record<string, string> = {
    "air_date.gte": today,
    "air_date.lte": today,
    sort_by: "popularity.desc",
  };

  const userFilters = parseTvSearchParams(resolvedParams);

  const finalFilters = { ...baseCategoryFilters, ...userFilters };

  if (finalFilters.sort_by?.includes("vote_average")) {
    finalFilters["vote_count.gte"] = "300";
  }

  const [response, genresResponse] = await Promise.all([
    tmdb.discoverTVShows(finalFilters, 1),
    tmdb.getTVShowGenres(),
  ]);

  if (!response.success || !genresResponse.success) {
    throw new Error(response.error || genresResponse.error);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">{t("description")}</p>

      <TvShowFilters initialGenres={genresResponse.data.genres} />

      <div className="mt-8">
        <InfiniteTvShowGrid
          initialTvShows={response.data.results}
          totalPages={response.data.total_pages}
          type="discover_tv"
          filters={finalFilters}
        />
      </div>
    </div>
  );
}
