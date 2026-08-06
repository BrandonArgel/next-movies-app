"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { MovieCard } from "@/components/movies/movie-card";
import { type Movie } from "@/types/movies";
import { cn } from "@/lib/utils";
import { useGridColumns } from "@/hooks/use-grid-columns";

interface InfiniteMovieGridProps {
  initialMovies: Movie[];
  totalPages: number;
  type?: "discover" | "search";
  searchQuery?: string;
  filters?: Record<string, string>;
  className?: string;
}

export function InfiniteMovieGrid({
  initialMovies,
  totalPages,
  type = "discover",
  searchQuery = "",
  filters = {},
  className,
}: InfiniteMovieGridProps) {
  const t = useTranslations("global.states");
  const columns = useGridColumns();

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [scrollMargin, setScrollMargin] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setScrollMargin(containerRef.current.offsetTop);
    }
  }, []);

  const movieRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < movies.length; i += columns) {
      rows.push(movies.slice(i, i + columns));
    }
    return rows;
  }, [movies, columns]);

  const virtualizer = useWindowVirtualizer({
    count: movieRows.length,
    estimateSize: () => {
      if (typeof window === "undefined") return 350;
      const cardWidth = window.innerWidth / columns;
      return cardWidth * 1.5 + 60;
    },
    overscan: 2,
    scrollMargin,
  });

  const measureElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        queueMicrotask(() => {
          virtualizer.measureElement(node);
        });
      }
    },
    [virtualizer],
  );

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const nextPage = page + 1;

    // Construct dynamic parameters based on the prop
    const params = new URLSearchParams({
      type,
      page: String(nextPage),
    });

    if (type === "search" && searchQuery) {
      params.append("q", searchQuery);
    } else {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    try {
      const res = await fetch(`/api/movies?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = (await res.json()) as {
        results: Movie[];
        total_pages: number;
      };

      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = data.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });

      setPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, type, searchQuery, filters]);

  // Deeply watch filter changes by stringifying them to prevent infinite loops
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(totalPages > 1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initialMovies, totalPages, type, searchQuery, filterKey]);

  const virtualItems = virtualizer.getVirtualItems();
  const lastItemIndex = virtualItems[virtualItems.length - 1]?.index;

  useEffect(() => {
    if (lastItemIndex === undefined) return;

    if (lastItemIndex >= movieRows.length - 1 && hasMore && !isLoading) {
      void loadMore();
    }
  }, [lastItemIndex, hasMore, isLoading, movieRows.length, loadMore]);

  return (
    <div className={cn("flex flex-col gap-8", className)} ref={containerRef}>
      <div
        role="list"
        aria-busy={isLoading}
        suppressHydrationWarning
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualRow) => {
          const rowMovies = movieRows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: "1rem",
                paddingBottom: "1.5rem",
              }}
            >
              {rowMovies.map((movie) => (
                <div key={movie.id} role="listitem">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div
        className="flex justify-center items-center py-6 min-h-12"
        aria-live="polite"
      >
        {isLoading && (
          <Spinner
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {!isLoading && !hasMore && movies.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_more_results")}
          </p>
        )}
      </div>
    </div>
  );
}
