import { tmdb } from "@/lib/tmdb";
import MovieHero from "./_components/movie-hero";
import MovieCarousel from "./_components/movie-carousel";
import { type Movie } from "@/types/movies";

export default async function MoviesPage() {
  const { results } = await tmdb.getTrending("day");
  const trendingMovies: Movie[] = results;

  if (!trendingMovies || trendingMovies.length === 0) {
    return <div className="p-8 text-center">No hay películas disponibles.</div>;
  }

  const [basicHeroMovie, ...carouselMovies] = trendingMovies;
  const { id } = basicHeroMovie;

  const heroMovieDetails = await tmdb.getMovieDetails(id);

  return (
    <main className="flex flex-col w-full pb-20 bg-background">
      <MovieHero movie={heroMovieDetails} />
      <MovieCarousel movies={carouselMovies} />
    </main>
  );
}
