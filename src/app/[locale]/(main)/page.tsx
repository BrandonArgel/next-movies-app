import { Suspense } from "react";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";
import { getTrendingMovies } from "@/lib/api/movies";
import { requireUser } from "@/lib/auth-utils";
import { MovieHero } from "./_components/movie-hero";
import { TrendingMoviesContainer } from "./_components/trending-movies-container";
import { TrendingPeopleContainer } from "./_components/trending-people-container";
import { TrendingTvShowsContainer } from "./_components/trending-tv-shows-container";

export default async function MoviesPage() {
  const { user, token } = await requireUser();
  const moviesResult = await getTrendingMovies("day");

  if (!moviesResult.success || moviesResult.data.results.length === 0) {
    throw new Error(moviesResult.error || "failed_to_load");
  }

  const heroMovie = moviesResult.data.results[0];

  return (
    <div className="w-full bg-background pb-24">
      <MovieHero movieId={heroMovie.id} userId={user?.id} token={token} />
      <div className="container mx-auto flex max-w-7xl flex-col gap-24 px-4 md:px-8 xl:px-12">
        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingMoviesContainer moviesResult={moviesResult} />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingTvShowsContainer />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TrendingPeopleContainer />
        </Suspense>
      </div>
    </div>
  );
}
