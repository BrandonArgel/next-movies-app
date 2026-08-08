import { Suspense } from "react";
import { getTrendingMovies } from "@/lib/api/movies";
import { MovieHero } from "./_components/movie-hero";
import { TrendingMoviesContainer } from "./_components/trending-movies-container";
import { TrendingTvShowsContainer } from "./_components/trending-tv-shows-container";
import { TrendingPeopleContainer } from "./_components/trending-people-container";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";

export default async function MoviesPage() {
  const moviesResult = await getTrendingMovies("day");

  if (!moviesResult.success || moviesResult.data.results.length === 0) {
    throw new Error(moviesResult.error || "failed_to_load");
  }

  const heroMovie = moviesResult.data.results[0];

  return (
    <div className="w-full pb-24 bg-background">
      <MovieHero movieId={heroMovie.id} />
      <main className="container max-w-7xl mx-auto flex flex-col gap-24 px-4 md:px-8 xl:px-12">
        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingMoviesContainer moviesResult={moviesResult} />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingTvShowsContainer />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingPeopleContainer />
        </Suspense>
      </main>
    </div>
  );
}
