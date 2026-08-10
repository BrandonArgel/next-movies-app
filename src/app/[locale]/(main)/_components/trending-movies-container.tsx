import type { PaginatedResponse, Result } from "@/types/api";
import type { Movie } from "@/types/movies";
import { SectionState } from "./section-state";
import TrendingMoviesSection from "./trending-movies-section";

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
