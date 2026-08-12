import { Film } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SearchResultsLayout } from "@/components/search/search-results-layout";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { searchMovies, searchPeople, searchTvShows } from "@/lib/api/search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export type CategoryState<T> =
  | {
      success: true;
      data: { results: T[]; total_pages: number; total_results: number };
    }
  | { success: false; error: string };

function normalizeQuery(query?: string | string[]) {
  return Array.isArray(query) ? query[0] : query || "";
}

function extractState<T>(settled: PromiseSettledResult<any>): CategoryState<T> {
  if (settled.status === "fulfilled") {
    if (settled.value.success) {
      return { success: true, data: settled.value.data };
    }
    return { success: false, error: settled.value.error };
  }
  return { success: false, error: settled.reason?.message };
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "components.nav" });
  return { title: t("search") || "Search" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = normalizeQuery(resolvedParams.q)?.trim();
  const t = await getTranslations("pages.search");

  if (!query) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="container mx-auto px-4 py-16 md:px-8 xl:px-12">
          <h1 className="font-bold text-4xl tracking-tight">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {t("placeholder")}
          </p>
        </div>
      </div>
    );
  }

  const [moviesSettled, tvSettled, peopleSettled] = await Promise.allSettled([
    searchMovies(query, 1),
    searchTvShows(query, 1),
    searchPeople(query, 1),
  ]);

  const moviesState = extractState<any>(moviesSettled);
  const tvState = extractState<any>(tvSettled);
  const peopleState = extractState<any>(peopleSettled);

  if (!moviesState.success && !tvState.success && !peopleState.success) {
    throw new Error("search_unavailable");
  }

  const totalResults =
    (moviesState.success ? moviesState.data.total_results : 0) +
    (tvState.success ? tvState.data.total_results : 0) +
    (peopleState.success ? peopleState.data.total_results : 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="container mx-auto px-4 py-16 md:px-8 xl:px-12">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="font-bold text-4xl tracking-tight">
            {t("title", { query })}
          </h1>
          <p className="text-muted-foreground">{t("results", { query })}</p>
        </div>

        {totalResults === 0 &&
        moviesState.success &&
        tvState.success &&
        peopleState.success ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <Film className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>{t("no_results", { query })}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <SearchResultsLayout
            query={query}
            moviesState={moviesState}
            tvState={tvState}
            peopleState={peopleState}
          />
        )}
      </div>
    </div>
  );
}
