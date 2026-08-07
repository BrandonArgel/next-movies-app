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
import { PersonCard } from "@/components/people/person-card";
import { cn } from "@/lib/utils";
import { useGridColumns } from "@/hooks/use-grid-columns";
import { type Person } from "@/types/person";

interface InfinitePeopleGridProps {
  initialPeople: Person[];
  totalPages: number;
  className?: string;
}

export function InfinitePeopleGrid({
  initialPeople,
  totalPages,
  className,
}: InfinitePeopleGridProps) {
  const t = useTranslations("global.states");
  const columns = useGridColumns();

  const [people, setPeople] = useState<Person[]>(initialPeople);
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

  const personRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < people.length; i += columns) {
      rows.push(people.slice(i, i + columns));
    }
    return rows;
  }, [people, columns]);

  const virtualizer = useWindowVirtualizer({
    count: personRows.length,
    estimateSize: () => {
      if (typeof window === "undefined") return 350;
      const cardWidth = window.innerWidth / columns;
      return cardWidth * 1.5 + 60; // Adjust multiplier if person cards have a different aspect ratio than posters
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

    try {
      const res = await fetch(`/api/people?page=${nextPage}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = (await res.json()) as {
        results: Person[];
        total_pages: number;
      };

      setPeople((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPeople = data.results.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPeople];
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
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    setPeople(initialPeople);
    setPage(1);
    setHasMore(totalPages > 1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initialPeople, totalPages]);

  const virtualItems = virtualizer.getVirtualItems();
  const lastItemIndex = virtualItems[virtualItems.length - 1]?.index;

  useEffect(() => {
    if (lastItemIndex === undefined) return;

    if (lastItemIndex >= personRows.length - 1 && hasMore && !isLoading) {
      void loadMore();
    }
  }, [lastItemIndex, hasMore, isLoading, personRows.length, loadMore]);

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
          const rowPeople = personRows[virtualRow.index];

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
              {rowPeople.map((person) => (
                <div key={person.id} role="listitem">
                  <PersonCard person={person} />
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
        {!isLoading && !hasMore && people.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_more_results")}
          </p>
        )}
      </div>
    </div>
  );
}
