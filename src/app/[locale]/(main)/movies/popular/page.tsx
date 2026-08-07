import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { MovieFilters } from "@/components/movies/movie-filters";
import { parseMovieSearchParams } from "@/lib/filters";
import { discoverMovies } from "@/lib/api/movies";
import { getMovieGenres } from "@/lib/api/genres";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.movies.popular");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PopularPage({ searchParams }: PageProps) {
  const t = await getTranslations("pages.movies.popular");
  const resolvedParams = await searchParams;

  const baseCategoryFilters = {
    sort_by: "popularity.desc",
    "vote_count.gte": "300",
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
    <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">{t("description")}</p>

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
