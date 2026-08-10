"use client";

import {
  AlertCircleIcon,
  ArrowRightIcon,
  FilmIcon,
  LayoutGridIcon,
  TvIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { CategoryState } from "@/app/[locale]/(main)/search/page";

import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { MovieCard } from "@/components/movies/movie-card";
import { InfinitePeopleGrid } from "@/components/people/infinite-people-grid";
import { PersonCard } from "@/components/people/person-card";
import { InfiniteTvShowGrid } from "@/components/tv-show/infinite-tv-grid";
import { TVShowCard } from "@/components/tv-show/tv-show-card";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types/movies";
import type { Person } from "@/types/person";
import type { TvShow } from "@/types/tv-show";

type FilterType = "all" | "movie" | "tv" | "person";

interface SearchResultsLayoutProps {
  query: string;
  moviesState: CategoryState<Movie>;
  tvState: CategoryState<TvShow>;
  peopleState: CategoryState<Person>;
}

export function SearchResultsLayout({
  query,
  moviesState,
  tvState,
  peopleState,
}: SearchResultsLayoutProps) {
  const tGlobal = useTranslations("global.entities");
  const tSearch = useTranslations("pages.search");
  const tErrors = useTranslations("errors");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const moviesCount = moviesState.success ? moviesState.data.total_results : 0;
  const tvCount = tvState.success ? tvState.data.total_results : 0;
  const peopleCount = peopleState.success ? peopleState.data.total_results : 0;

  const totalResults = moviesCount + tvCount + peopleCount;

  const FILTER_CONFIG = [
    {
      id: "all",
      count: totalResults,
      icon: LayoutGridIcon,
      label: tSearch("filter_all"),
      hasError: false,
    },
    {
      id: "movie",
      count: moviesCount,
      icon: FilmIcon,
      label: tSearch("filter_movies"),
      hasError: !moviesState.success,
    },
    {
      id: "tv",
      count: tvCount,
      icon: TvIcon,
      label: tSearch("filter_tv"),
      hasError: !tvState.success,
    },
    {
      id: "person",
      count: peopleCount,
      icon: UsersIcon,
      label: tSearch("filter_people"),
      hasError: !peopleState.success,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div
        role="toolbar"
        aria-label="Filter search results"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTER_CONFIG.map((filter) => (
          <FilterPill
            key={filter.id}
            active={activeFilter === filter.id}
            count={filter.count}
            icon={<filter.icon className="size-4" />}
            label={filter.label}
            hasError={filter.hasError}
            onClick={() => setActiveFilter(filter.id as FilterType)}
          />
        ))}
      </div>

      {activeFilter === "all" && (
        <div className="flex flex-col gap-12">
          {/* Movies Section */}
          {!moviesState.success ? (
            <PartialError errorMessage={tErrors("load_movies_failed")} />
          ) : moviesState.data.total_results > 0 ? (
            <PreviewSection
              title={tGlobal("movies")}
              icon={<FilmIcon className="size-5 shrink-0 text-primary" />}
              onViewAll={() => setActiveFilter("movie")}
              total={moviesState.data.total_results}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {moviesState.data.results.slice(0, 5).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </PreviewSection>
          ) : null}

          {/* TV Shows Section */}
          {!tvState.success ? (
            <PartialError errorMessage={tErrors("load_tv_failed")} />
          ) : tvState.data.total_results > 0 ? (
            <PreviewSection
              title={tGlobal("tv_shows")}
              icon={<TvIcon className="size-5 shrink-0 text-primary" />}
              onViewAll={() => setActiveFilter("tv")}
              total={tvState.data.total_results}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tvState.data.results.slice(0, 5).map((show) => (
                  <TVShowCard key={show.id} tvShow={show} />
                ))}
              </div>
            </PreviewSection>
          ) : null}

          {/* People Section */}
          {!peopleState.success ? (
            <PartialError errorMessage={tErrors("load_people_failed")} />
          ) : peopleState.data.total_results > 0 ? (
            <PreviewSection
              title={tGlobal("people")}
              icon={<UsersIcon className="size-5 shrink-0 text-primary" />}
              onViewAll={() => setActiveFilter("person")}
              total={peopleState.data.total_results}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {peopleState.data.results.slice(0, 5).map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </PreviewSection>
          ) : null}
        </div>
      )}

      {/* Infinite Grids */}
      {activeFilter === "movie" &&
        (!moviesState.success ? (
          <PartialError errorMessage={tErrors("load_movies_failed")} />
        ) : (
          <InfiniteMovieGrid
            type="search"
            searchQuery={query}
            initialMovies={moviesState.data.results}
            totalPages={moviesState.data.total_pages}
          />
        ))}

      {activeFilter === "tv" &&
        (!tvState.success ? (
          <PartialError errorMessage={tErrors("load_tv_failed")} />
        ) : (
          <InfiniteTvShowGrid
            type="search"
            searchQuery={query}
            initialTvShows={tvState.data.results}
            totalPages={tvState.data.total_pages}
          />
        ))}

      {activeFilter === "person" &&
        (!peopleState.success ? (
          <PartialError errorMessage={tErrors("load_people_failed")} />
        ) : (
          <InfinitePeopleGrid
            searchQuery={query}
            initialPeople={peopleState.data.results}
            totalPages={peopleState.data.total_pages}
          />
        ))}
    </div>
  );
}

function PartialError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-destructive">
      <div className="flex items-center gap-2">
        <AlertCircleIcon className="size-5" />
        <p className="font-semibold text-lg">{errorMessage}</p>
      </div>
    </div>
  );
}

interface PreviewSectionProps {
  title: string;
  icon: React.ReactNode;
  onViewAll: () => void;
  total: number;
  children: React.ReactNode;
}

function PreviewSection({
  title,
  icon,
  onViewAll,
  total,
  children,
}: PreviewSectionProps) {
  const tSearch = useTranslations("pages.search");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="font-semibold text-xl">{title}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
            {total}
          </span>
        </div>
        {total > 5 && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 font-medium text-primary text-sm hover:underline"
          >
            {tSearch("view_all_results")} <ArrowRightIcon className="size-3" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

interface FilterPillProps {
  active: boolean;
  count: number;
  icon: React.ReactNode;
  label: string;
  hasError: boolean;
  onClick: () => void;
}

function FilterPill({
  active,
  count,
  icon,
  label,
  hasError,
  onClick,
}: FilterPillProps) {
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
        count === 0 && !active && !hasError && "pointer-events-none opacity-40",
        hasError &&
          "border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20",
      )}
    >
      {hasError ? <AlertCircleIcon className="size-4" /> : icon}
      {label}
      {count > 0 && !hasError && (
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
