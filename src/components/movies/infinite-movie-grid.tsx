"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { MovieCard } from "@/components/movies/movie-card";
import { type Movie } from "@/types/movies";
import { type MovieListType } from "@/app/api/movies/route";
import { cn } from "@/lib/utils";

interface InfiniteMovieGridProps {
  initialMovies: Movie[];
  totalPages: number;
  type: MovieListType;
  query?: string;
  className?: string;
}

export function InfiniteMovieGrid({
  initialMovies,
  totalPages,
  type,
  query = "",
  className,
}: InfiniteMovieGridProps) {
  const t = useTranslations("common");

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const nextPage = page + 1;
    const params = new URLSearchParams({
      type,
      page: String(nextPage),
      ...(query ? { q: query } : {}),
    });

    const res = await fetch(`/api/movies?${params.toString()}`);

    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = (await res.json()) as {
      results: Movie[];
      total_pages: number;
    };

    setMovies((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setHasMore(nextPage < data.total_pages);
    setIsLoading(false);
  }, [isLoading, hasMore, page, type, query]);

  // Reset when initialMovies/type/query changes (e.g. navigating to a new search)
  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(totalPages > 1);
  }, [initialMovies, totalPages]);

  // IntersectionObserver — fires loadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        role="list"
        aria-busy={isLoading}
      >
        {movies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard movie={movie} variant="grid" />
          </div>
        ))}
      </div>

      {/* Sentinel + state indicators */}
      <div
        ref={sentinelRef}
        className="flex justify-center items-center py-6 min-h-12"
        aria-live="polite"
        aria-label={
          isLoading ? t("loading") : hasMore ? "" : t("noMoreResults")
        }
      >
        {isLoading && (
          <Loader2Icon
            className="size-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {!isLoading && !hasMore && movies.length > 0 && (
          <p className="text-sm text-muted-foreground">{t("noMoreResults")}</p>
        )}
      </div>
    </div>
  );
}
