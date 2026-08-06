"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useTransition } from "react";
import { Autocomplete, useFilter, type DateRange } from "react-aria-components";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectList,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeCalendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface Genre {
  id: number | string;
  name: string;
}

interface MovieFiltersProps {
  initialGenres: Genre[];
}

export function MovieFilters({ initialGenres }: MovieFiltersProps) {
  const tGlobal = useTranslations("global.states");
  const tFilters = useTranslations("components.filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { contains } = useFilter({ sensitivity: "base" });

  const GENRES = [
    { id: "all", name: tFilters("all_genres") },
    ...initialGenres.map((g) => ({ id: String(g.id), name: g.name })),
  ];

  const SORT_OPTIONS = [
    { id: "popularity.desc", name: tFilters("sort_popularity_desc") },
    { id: "popularity.asc", name: tFilters("sort_popularity_asc") },
    { id: "vote_average.desc", name: tFilters("sort_rating_desc") },
    { id: "vote_average.asc", name: tFilters("sort_rating_asc") },
    { id: "primary_release_date.desc", name: tFilters("sort_date_desc") },
    { id: "primary_release_date.asc", name: tFilters("sort_date_asc") },
    { id: "title.desc", name: tFilters("sort_title_desc") },
    { id: "title.asc", name: tFilters("sort_title_asc") },
  ];

  const [localGenre, setLocalGenre] = useState(
    searchParams.get("genre") ?? "all",
  );
  const [localSort, setLocalSort] = useState(
    searchParams.get("sort") ?? "popularity.desc",
  );

  const initialDateRange = useMemo(() => {
    const from = searchParams.get("release_from");
    const to = searchParams.get("release_to");
    return from && to
      ? { start: parseDate(from), end: parseDate(to) }
      : undefined;
  }, [searchParams]);
  const [localDate, setLocalDate] = useState<DateRange | undefined>(
    initialDateRange,
  );

  const [localRuntime, setLocalRuntime] = useState<number[]>([
    Number(searchParams.get("runtime_min") ?? 0),
    Number(searchParams.get("runtime_max") ?? 360),
  ]);

  useEffect(() => {
    setLocalGenre(searchParams.get("genre") ?? "all");
    setLocalSort(searchParams.get("sort") ?? "popularity.desc");
    setLocalDate(initialDateRange);
    setLocalRuntime([
      Number(searchParams.get("runtime_min") ?? 0),
      Number(searchParams.get("runtime_max") ?? 360),
    ]);
  }, [searchParams, initialDateRange]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localSort && localSort !== "popularity.desc")
      params.set("sort", localSort);
    else params.delete("sort");

    if (localGenre && localGenre !== "all") params.set("genre", localGenre);
    else params.delete("genre");

    if (localDate?.start && localDate?.end) {
      params.set("release_from", localDate.start.toString());
      params.set("release_to", localDate.end.toString());
    } else {
      params.delete("release_from");
      params.delete("release_to");
    }

    if (localRuntime[0] > 0) params.set("runtime_min", String(localRuntime[0]));
    else params.delete("runtime_min");

    if (localRuntime[1] < 360)
      params.set("runtime_max", String(localRuntime[1]));
    else params.delete("runtime_max");

    params.delete("page");

    params.sort();
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.sort();

    if (params.toString() === currentParams.toString()) {
      return;
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.delete("page");
    if (currentParams.size === 0) {
      return;
    }

    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border rounded-xl shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Release Dates */}
        <Field className="flex flex-col gap-1.5 w-full">
          <FieldLabel htmlFor="date-picker-range">
            {tFilters("sort_by_release_dates")}
          </FieldLabel>
          <PopoverTrigger>
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal h-10 w-full"
            >
              <CalendarIcon
                className="mr-2 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">
                {localDate?.start && localDate.end ? (
                  new Intl.DateTimeFormat(undefined, {
                    dateStyle: "short",
                  }).formatRange(
                    localDate.start.toDate(getLocalTimeZone()),
                    localDate.end.toDate(getLocalTimeZone()),
                  )
                ) : (
                  <span className="text-muted-foreground">
                    {tFilters("pick_a_date")}
                  </span>
                )}
              </span>
            </Button>
            <Popover className="w-auto p-0" placement="bottom start">
              <RangeCalendar value={localDate} onChange={setLocalDate} />
            </Popover>
          </PopoverTrigger>
        </Field>

        {/* Sort Order */}
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="sort-select">{tFilters("sort_by")}</Label>
          <Select
            aria-label={tFilters("sort_by")}
            value={localSort}
            onChange={(key) => setLocalSort(key as string)}
          >
            <SelectTrigger id="sort-select" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectPopover className="w-[--trigger-width] min-w-50">
              <SelectList>
                <SelectGroup items={SORT_OPTIONS}>
                  {(option) => (
                    <SelectItem id={option.id}>{option.name}</SelectItem>
                  )}
                </SelectGroup>
              </SelectList>
            </SelectPopover>
          </Select>
        </div>

        {/* Genres */}
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="genre-select">{tFilters("sort_by_genre")}</Label>
          <Select
            aria-label={tFilters("sort_by_genre")}
            value={localGenre}
            onChange={(key) => setLocalGenre(key as string)}
          >
            <SelectTrigger id="genre-select" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <Autocomplete filter={contains}>
              <SelectPopover className="w-[--trigger-width] min-w-50">
                <SelectInput aria-label={tFilters("sort_by_genre")} />
                <SelectList
                  renderEmptyState={() => (
                    <SelectEmpty>{tGlobal("no_items_found")}</SelectEmpty>
                  )}
                >
                  <SelectGroup items={GENRES}>
                    {(genre) => (
                      <SelectItem id={genre.id}>{genre.name}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectList>
              </SelectPopover>
            </Autocomplete>
          </Select>
        </div>

        {/* Runtime Slider */}
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="slider-runtime">
              {tFilters("sort_by_runtime_minutes")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {localRuntime.join(" - ")}
            </span>
          </div>
          <Slider
            aria-label={tFilters("sort_by_runtime_minutes")}
            id="slider-runtime"
            value={localRuntime}
            onChange={(val) => setLocalRuntime(val as number[])}
            minValue={0}
            maxValue={360}
            step={15}
            className="w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={clearFilters} isDisabled={isPending}>
          {tFilters("clear_filters")}
        </Button>
        <Button onClick={applyFilters}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {tFilters("applying_filters")}
            </span>
          ) : (
            tFilters("apply_filters")
          )}
        </Button>
      </div>
    </div>
  );
}
