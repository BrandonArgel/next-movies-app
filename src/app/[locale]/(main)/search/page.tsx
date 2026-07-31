import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const t = await getTranslations("search");
  return {
    title: q ? t("results", { query: q }) : t("title"),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const t = await getTranslations("search");

  if (!q.trim()) {
    return (
      <main className="flex flex-col w-full min-h-screen pb-20 bg-background">
        <div className="container mx-auto px-4 md:px-8 pt-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground">{t("placeholder")}</p>
        </div>
      </main>
    );
  }

  const data = await tmdb.searchMovies(q, 1);

  return (
    <main className="flex flex-col w-full min-h-screen pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-8 pt-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {t("results", { query: q })}
          </h1>
        </div>

        {data.results.length === 0 ? (
          <p className="text-muted-foreground">
            {t("noResults", { query: q })}
          </p>
        ) : (
          <InfiniteMovieGrid
            initialMovies={data.results}
            totalPages={data.total_pages}
            type="search"
            query={q}
          />
        )}
      </div>
    </main>
  );
}
