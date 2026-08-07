"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FilmIcon,
  TvIcon,
  UsersIcon,
  LayoutGridIcon,
  ArrowRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { InfiniteTvShowGrid } from "@/components/tv-show/infinite-tv-grid";
import { InfinitePeopleGrid } from "@/components/people/infinite-people-grid";
import { MovieCard } from "@/components/movies/movie-card";
import { TVShowCard } from "@/components/tv-show/tv-show-card";
import { PersonCard } from "@/components/people/person-card";

type FilterType = "all" | "movie" | "tv" | "person";

interface SearchData<T> {
  results: T[];
  total_pages: number;
  total_results: number;
}

interface SearchResultsLayoutProps {
  query: string;
  moviesData: SearchData<any>;
  tvData: SearchData<any>;
  peopleData: SearchData<any>;
}

export function SearchResultsLayout({
  query,
  moviesData,
  tvData,
  peopleData,
}: SearchResultsLayoutProps) {
  const tGlobal = useTranslations("global.entities");
  const tSearch = useTranslations("pages.search");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const totalResults =
    moviesData.total_results + tvData.total_results + peopleData.total_results;

  if (totalResults === 0) {
    return (
      <div className="rounded-3xl border border-border bg-muted p-10 text-center">
        <p className="text-lg font-medium">
          {tSearch("no_results", { query })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Filters Toolbar */}
      <div
        role="toolbar"
        aria-label="Filter search results"
        className="flex flex-wrap items-center gap-2"
      >
        <FilterPill
          active={activeFilter === "all"}
          count={totalResults}
          icon={<LayoutGridIcon className="size-4" />}
          label={tSearch("filter_all")}
          onClick={() => setActiveFilter("all")}
        />
        <FilterPill
          active={activeFilter === "movie"}
          count={moviesData.total_results}
          icon={<FilmIcon className="size-4" />}
          label={tSearch("filter_movies")}
          onClick={() => setActiveFilter("movie")}
        />
        <FilterPill
          active={activeFilter === "tv"}
          count={tvData.total_results}
          icon={<TvIcon className="size-4" />}
          label={tSearch("filter_tv")}
          onClick={() => setActiveFilter("tv")}
        />
        <FilterPill
          active={activeFilter === "person"}
          count={peopleData.total_results}
          icon={<UsersIcon className="size-4" />}
          label={tSearch("filter_people")}
          onClick={() => setActiveFilter("person")}
        />
      </div>

      {/* Render All Preview */}
      {activeFilter === "all" && (
        <div className="flex flex-col gap-12">
          {moviesData.total_results > 0 && (
            <PreviewSection
              title={tGlobal("movies")}
              icon={<FilmIcon className="size-5 text-primary shrink-0" />}
              onViewAll={() => setActiveFilter("movie")}
              total={moviesData.total_results}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {moviesData.results.slice(0, 5).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </PreviewSection>
          )}

          {tvData.total_results > 0 && (
            <PreviewSection
              title={tGlobal("tv_shows")}
              icon={<TvIcon className="size-5 text-primary shrink-0" />}
              onViewAll={() => setActiveFilter("tv")}
              total={tvData.total_results}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tvData.results.slice(0, 5).map((show) => (
                  <TVShowCard key={show.id} tvShow={show} />
                ))}
              </div>
            </PreviewSection>
          )}

          {peopleData.total_results > 0 && (
            <PreviewSection
              title={tGlobal("people")}
              icon={<UsersIcon className="size-5 text-primary shrink-0" />}
              onViewAll={() => setActiveFilter("person")}
              total={peopleData.total_results}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {peopleData.results.slice(0, 5).map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </PreviewSection>
          )}
        </div>
      )}

      {/* Render Infinite Grids based on Active Filter */}
      {activeFilter === "movie" && (
        <InfiniteMovieGrid
          type="search"
          searchQuery={query}
          initialMovies={moviesData.results}
          totalPages={moviesData.total_pages}
        />
      )}

      {activeFilter === "tv" && (
        <InfiniteTvShowGrid
          type="search"
          searchQuery={query}
          initialTvShows={tvData.results}
          totalPages={tvData.total_pages}
        />
      )}

      {activeFilter === "person" && (
        <InfinitePeopleGrid
          initialPeople={peopleData.results}
          totalPages={peopleData.total_pages}
        />
      )}
    </div>
  );
}

function PreviewSection({ title, icon, onViewAll, total, children }: any) {
  const tSearch = useTranslations("pages.search");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {total}
          </span>
        </div>
        {total > 5 && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
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
  onClick: () => void;
}

function FilterPill({ active, count, icon, label, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 select-none",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        count === 0 && !active && "opacity-40 pointer-events-none",
      )}
    >
      {icon}
      {label}
      {count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px text-xs font-semibold tabular-nums",
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
