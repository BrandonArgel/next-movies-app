import TrendingMoviesSection from "./trending-movies-section";
import { SectionState } from "./section-state";
import { type Result, type PaginatedResponse } from "@/types/api";
import { Movie } from "@/types/movies";

interface TrendingMoviesContainer {
  moviesResult: Result<PaginatedResponse<Movie>>;
}

export async function TrendingMoviesContainer({
  moviesResult,
}: TrendingMoviesContainer) {
  if (!moviesResult.success) {
    return (
      <SectionState type="error" entity="movies" error={moviesResult.error} />
    );
  }

  if (!moviesResult.data.results || moviesResult.data.results.length === 0) {
    return <SectionState type="empty" entity="movies" />;
  }

  return <TrendingMoviesSection initialMovies={moviesResult.data.results} />;
}
