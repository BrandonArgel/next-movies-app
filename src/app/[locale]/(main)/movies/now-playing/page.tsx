import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { MovieFilters } from "@/components/movies/movie-filters";
import { getMovieGenres } from "@/lib/api/genres";
import { discoverMovies } from "@/lib/api/movies";
import { parseMovieSearchParams } from "@/lib/filters";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.movies.now_playing");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function NowPlayingPage({ searchParams }: PageProps) {
  const t = await getTranslations("pages.movies.now_playing");
  const resolvedParams = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const baseCategoryFilters = {
    sort_by: "popularity.desc",
    "primary_release_date.gte": thirtyDaysAgo,
    "primary_release_date.lte": today,
    with_release_type: "2|3",
  };

  const userFilters = parseMovieSearchParams(resolvedParams);

  const finalFilters = { ...baseCategoryFilters, ...userFilters };

  const [response, genresResponse] = await Promise.all([
    discoverMovies(finalFilters, 1),
    getMovieGenres(),
  ]);

  if (!response.success || !genresResponse.success) {
    throw new Error(response.error || genresResponse.error);
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-8 xl:px-12">
      <h1 className="font-bold text-4xl tracking-tight">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("description")}</p>

      <MovieFilters initialGenres={genresResponse.data.genres} />

      <div className="mt-8">
        <InfiniteMovieGrid
          initialMovies={response.data.results}
          totalPages={response.data.total_pages}
          type="discover"
          filters={finalFilters}
        />
      </div>
    </div>
  );
}
