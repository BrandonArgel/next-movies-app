"use client";

import {
  FilmIcon,
  LayoutGridIcon,
  Loader2Icon,
  TvIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { MovieCard } from "@/components/movies/movie-card";
import { PersonCard } from "@/components/people/person-card";
import { TVShowCard } from "@/components/tv-show/tv-show-card";
import { cn } from "@/lib/utils";
import type { MultiSearchResult } from "@/types/api";
import type { Movie } from "@/types/movies";
import type { Person } from "@/types/person";
import type { TvShow } from "@/types/tv-show";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "all" | "movie" | "tv" | "person";

type FilteredMovies = (Movie & { media_type: "movie" })[];
type FilteredTvShows = (TvShow & { media_type: "tv" })[];
type FilteredPeople = (Person & { media_type: "person" })[];

interface InfiniteSearchGridProps {
  query: string;
  initialResults: MultiSearchResult[];
  totalPages: number;
  className?: string;
}

// ─── Filter pill component ────────────────────────────────────────────────────

interface FilterPillProps {
  active: boolean;
  count: number;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function FilterPill({ active, count, icon, label, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex select-none items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        count === 0 && !active && "pointer-events-none opacity-40",
      )}
    >
      {icon}
      {label}
      {count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px font-semibold text-xs tabular-nums",
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-foreground/10 text-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InfiniteSearchGrid({
  query,
  initialResults,
  totalPages,
  className,
}: InfiniteSearchGridProps) {
  const t = useTranslations("common");
  const tSearch = useTranslations("search");

  const [results, setResults] = useState<MultiSearchResult[]>(initialResults);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Reset when query changes (SSR provides new initialResults) ──────────────
  useEffect(() => {
    setResults(initialResults);
    setPage(1);
    setHasMore(totalPages > 1);
    setActiveFilter("all");
  }, [initialResults, totalPages]);

  // ── Fetch next page from multi-search API ───────────────────────────────────
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({ q: query, page: String(nextPage) });

    const res = await fetch(`/api/search?${params.toString()}`);
    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = (await res.json()) as {
      results: MultiSearchResult[];
      total_pages: number;
    };

    setResults((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setHasMore(nextPage < data.total_pages);
    setIsLoading(false);
  }, [isLoading, hasMore, page, query]);

  // ── IntersectionObserver sentinel ───────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // ── Partition results by media_type ─────────────────────────────────────────
  const movies = results.filter(
    (item): item is Movie & { media_type: "movie" } =>
      item.media_type === "movie",
  ) as FilteredMovies;

  const tvShows = results.filter(
    (item): item is TvShow & { media_type: "tv" } => item.media_type === "tv",
  ) as FilteredTvShows;

  const people = results.filter(
    (item): item is Person & { media_type: "person" } =>
      item.media_type === "person",
  ) as FilteredPeople;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (results.length === 0 && !isLoading) {
    return (
      <div className="mt-12 rounded-3xl border border-border bg-muted p-10 text-center">
        <p className="font-medium text-lg">
          {tSearch("no_results", { query })}
        </p>
      </div>
    );
  }

  // ── Filtered subsets to render ──────────────────────────────────────────────
  const showMovies = activeFilter === "all" || activeFilter === "movie";
  const showTV = activeFilter === "all" || activeFilter === "tv";
  const showPeople = activeFilter === "all" || activeFilter === "person";

  // Show sentinel when there are more pages AND the active filter type has
  // results (or we're on "all") — avoids loading spinner when e.g. only
  // "movies" is selected but there are no more movies in future pages.
  const shouldShowSentinel =
    hasMore &&
    (activeFilter === "all" ||
      (activeFilter === "movie" && movies.length > 0) ||
      (activeFilter === "tv" && tvShows.length > 0) ||
      (activeFilter === "person" && people.length > 0));

  return (
    <div className={cn("mt-8 flex flex-col gap-8", className)}>
      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div
        role="toolbar"
        aria-label="Filter search results"
        className="flex flex-wrap items-center gap-2"
      >
        <FilterPill
          active={activeFilter === "all"}
          count={results.length}
          icon={<LayoutGridIcon className="size-4" />}
          label={tSearch("filter_all")}
          onClick={() => setActiveFilter("all")}
        />
        <FilterPill
          active={activeFilter === "movie"}
          count={movies.length}
          icon={<FilmIcon className="size-4" />}
          label={tSearch("filter_movies")}
          onClick={() => setActiveFilter("movie")}
        />
        <FilterPill
          active={activeFilter === "tv"}
          count={tvShows.length}
          icon={<TvIcon className="size-4" />}
          label={tSearch("filter_tv")}
          onClick={() => setActiveFilter("tv")}
        />
        <FilterPill
          active={activeFilter === "person"}
          count={people.length}
          icon={<UsersIcon className="size-4" />}
          label={tSearch("filter_people")}
          onClick={() => setActiveFilter("person")}
        />
      </div>

      {/* ── Result sections ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        {showMovies && movies.length > 0 && (
          <section
            className="space-y-5"
            id="search-movies"
            aria-label={tSearch("filter_movies")}
          >
            {activeFilter === "all" && (
              <div className="flex items-center gap-3">
                <FilmIcon className="size-5 shrink-0 text-primary" />
                <h2 className="font-semibold text-xl">
                  {t("entities.movies")}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                  {movies.length}+
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {showTV && tvShows.length > 0 && (
          <section
            className="space-y-5"
            id="search-tv"
            aria-label={tSearch("filter_tv")}
          >
            {activeFilter === "all" && (
              <div className="flex items-center gap-3">
                <TvIcon className="size-5 shrink-0 text-primary" />
                <h2 className="font-semibold text-xl">
                  {t("entities.tv_shows")}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                  {tvShows.length}+
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {tvShows.map((show) => (
                <TVShowCard key={show.id} tvShow={show} />
              ))}
            </div>
          </section>
        )}

        {showPeople && people.length > 0 && (
          <section
            className="space-y-5"
            id="search-people"
            aria-label={tSearch("filter_people")}
          >
            {activeFilter === "all" && (
              <div className="flex items-center gap-3">
                <UsersIcon className="size-5 shrink-0 text-primary" />
                <h2 className="font-semibold text-xl">
                  {t("entities.people")}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                  {people.length}+
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {people.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state for active filter */}
        {activeFilter !== "all" &&
          ((activeFilter === "movie" && movies.length === 0) ||
            (activeFilter === "tv" && tvShows.length === 0) ||
            (activeFilter === "person" && people.length === 0)) &&
          !isLoading && (
            <div className="rounded-2xl border border-border bg-muted p-8 text-center">
              <p className="text-muted-foreground text-sm">
                {tSearch("no_results", { query })}
              </p>
            </div>
          )}
      </div>

      {/* ── Infinite scroll sentinel ─────────────────────────────────────── */}
      <div
        ref={sentinelRef}
        className="flex min-h-12 items-center justify-center py-6"
        aria-live="polite"
      >
        {isLoading && (
          <Loader2Icon
            className="size-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {!isLoading && !shouldShowSentinel && results.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {t("no_more_results")}
          </p>
        )}
      </div>
    </div>
  );
}
