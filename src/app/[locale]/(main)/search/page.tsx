import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { InfiniteSearchGrid } from "@/components/movies/infinite-search-grid";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

function normalizeQuery(query?: string | string[]) {
  if (!query) return "";
  return Array.isArray(query) ? query[0] : query;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = normalizeQuery(resolvedParams.q)?.trim();
  const t = await getTranslations("search");

  return {
    title: query ? t("results", { query }) : t("title"),
    description: query ? t("results", { query }) : t("title"),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = normalizeQuery(resolvedParams.q)?.trim();
  const t = await getTranslations("search");

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

  const searchResponse = await tmdb.multiSearch(query, 1);
  const initialResults = searchResponse.success
    ? searchResponse.data.results
    : [];
  const totalPages = searchResponse.success
    ? searchResponse.data.total_pages
    : 0;

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("results", { query })}</p>
        </div>

        <InfiniteSearchGrid
          query={query}
          initialResults={initialResults}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
