import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { SearchResultsLayout } from "@/components/search/search-results-layout";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

function normalizeQuery(query?: string | string[]) {
  return Array.isArray(query) ? query[0] : query || "";
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = normalizeQuery(resolvedParams.q)?.trim();
  const t = await getTranslations("pages.search");

  return {
    title: query ? t("results", { query }) : t("title"),
    description: query ? t("results", { query }) : t("title"),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = normalizeQuery(resolvedParams.q)?.trim();
  const t = await getTranslations("pages.search");

  if (!query) {
    return (
      <main className="flex flex-col w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {t("placeholder")}
          </p>
        </div>
      </main>
    );
  }

  const [moviesRes, tvRes, peopleRes] = await Promise.all([
    tmdb.searchMovies(query, 1),
    tmdb.searchTvShows(query, 1),
    tmdb.searchPeople(query, 1),
  ]);

  if (!moviesRes.success || !tvRes.success || !peopleRes.success) {
    throw new Error("Failed to fetch search results");
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("title", { query })}
          </h1>
          <p className="text-muted-foreground">{t("results", { query })}</p>
        </div>

        <SearchResultsLayout
          query={query}
          moviesData={moviesRes.data}
          tvData={tvRes.data}
          peopleData={peopleRes.data}
        />
      </div>
    </main>
  );
}
