import { Suspense } from "react";
import { tmdb } from "@/lib/tmdb";
import MovieHero from "./_components/movie-hero";
import { TrendingMoviesContainer } from "./_components/trending-movies-container";
import { TrendingTVShowsContainer } from "./_components/trending-tv-shows-container";
import { TrendingPeopleContainer } from "./_components/trending-people-container";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";

export default async function MoviesPage() {
  const moviesResult = await tmdb.getTrendingMovies("day");

  if (!moviesResult.success || moviesResult.data.results.length === 0) {
    return null;
  }

  const heroMovie = moviesResult.data.results[0];

  return (
    <div className="w-full pb-24 bg-background">
      <MovieHero movieId={heroMovie.id} />
      <main className="container max-w-7xl mx-auto flex flex-col gap-24 px-4 md:px-8 xl:px-12">
        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingMoviesContainer />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingTVShowsContainer />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingPeopleContainer />
        </Suspense>
      </main>
    </div>
  );
}
