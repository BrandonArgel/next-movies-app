import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { SearchResultsLayout } from "@/components/search/search-results-layout";
import { searchMovies, searchPeople, searchTvShows } from "@/lib/api/search";

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

const defaultEmptyResult = { results: [], total_pages: 0, total_results: 0 };

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

  const [moviesSettled, tvSettled, peopleSettled] = await Promise.allSettled([
    searchMovies(query, 1),
    searchTvShows(query, 1),
    searchPeople(query, 1),
  ]);

  const moviesData =
    moviesSettled.status === "fulfilled" && moviesSettled.value.success
      ? moviesSettled.value.data
      : defaultEmptyResult;

  const tvData =
    tvSettled.status === "fulfilled" && tvSettled.value.success
      ? tvSettled.value.data
      : defaultEmptyResult;

  const peopleData =
    peopleSettled.status === "fulfilled" && peopleSettled.value.success
      ? peopleSettled.value.data
      : defaultEmptyResult;

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
          moviesData={moviesData}
          tvData={tvData}
          peopleData={peopleData}
        />
      </div>
    </main>
  );
}
