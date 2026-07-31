import { tmdb } from "@/lib/tmdb";

import MovieHero from "./_components/movie-hero";
import { type Movie } from "@/tyoes/movies";
import MovieCarousel from "./_components/movie-carousel";

export default async function MoviesPage() {
  const data = await tmdb.getTrending("day");
  const trendingMovies: Movie[] = data.results;

  if (!trendingMovies || trendingMovies.length === 0) {
    return <div className="p-8 text-center">No hay películas disponibles.</div>;
  }

  const [heroMovie, ...carouselMovies] = trendingMovies;
  console.log(heroMovie);

  return (
    <main className="flex flex-col w-full min-h-screen pb-20 bg-background">
      <MovieHero movie={heroMovie} />
      <MovieCarousel movies={carouselMovies} />
    </main>
  );
}
