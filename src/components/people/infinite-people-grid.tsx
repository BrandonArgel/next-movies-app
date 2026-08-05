"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { PersonCard } from "@/components/people/person-card";
import { type TrendingPerson } from "@/types/person";
import { type PeopleListType } from "@/app/api/people/route";
import { cn } from "@/lib/utils";

interface InfinitePeopleGridProps {
  initialPeople: TrendingPerson[];
  totalPages: number;
  type: PeopleListType;
  className?: string;
}

export function InfinitePeopleGrid({
  initialPeople,
  totalPages,
  type,
  className,
}: InfinitePeopleGridProps) {
  const t = useTranslations("common");

  const [people, setPeople] = useState<TrendingPerson[]>(initialPeople);
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
    });

    const res = await fetch(`/api/people?${params.toString()}`);

    if (!res.ok) {
      setIsLoading(false);
      return;
    }

    const data = (await res.json()) as {
      results: TrendingPerson[];
      total_pages: number;
    };

    setPeople((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setHasMore(nextPage < data.total_pages);
    setIsLoading(false);
  }, [isLoading, hasMore, page, type]);

  useEffect(() => {
    setPeople(initialPeople);
    setPage(1);
    setHasMore(totalPages > 1);
  }, [initialPeople, totalPages]);

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
        {people.map((person) => (
          <div key={person.id} role="listitem">
            <PersonCard person={person} />
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
        {!isLoading && !hasMore && people.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_more_results")}
          </p>
        )}
      </div>
    </div>
  );
}
