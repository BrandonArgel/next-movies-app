"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { TVShowCard } from "@/components/tv-show/tv-show-card";
import { type TVShow } from "@/types/tv-show";
import { type TVListType } from "@/app/api/tv/route";
import { cn } from "@/lib/utils";

interface InfiniteTVGridProps {
  initialShows: TVShow[];
  totalPages: number;
  type: TVListType;
  genreId?: string;
  className?: string;
}

export function InfiniteTVGrid({
  initialShows,
  totalPages,
  type,
  genreId = "",
  className,
}: InfiniteTVGridProps) {
  const t = useTranslations("common");

  const [shows, setShows] = useState<TVShow[]>(initialShows);
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
      ...(genreId ? { genre: genreId } : {}),
    });

    const res = await fetch(`/api/tv?${params.toString()}`);

    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = (await res.json()) as {
      results: TVShow[];
      total_pages: number;
    };

    setShows((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setHasMore(nextPage < data.total_pages);
    setIsLoading(false);
  }, [isLoading, hasMore, page, type, genreId]);

  useEffect(() => {
    setShows(initialShows);
    setPage(1);
    setHasMore(totalPages > 1);
  }, [initialShows, totalPages]);

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
        {shows.map((show) => (
          <div key={show.id} role="listitem">
            <TVShowCard tvShow={show} />
          </div>
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="flex justify-center items-center py-6 min-h-12"
        aria-live="polite"
        aria-label={
          isLoading ? t("loading") : hasMore ? "" : t("no_more_results")
        }
      >
        {isLoading && (
          <Loader2Icon
            className="size-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {!isLoading && !hasMore && shows.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_more_results")}
          </p>
        )}
      </div>
    </div>
  );
}
