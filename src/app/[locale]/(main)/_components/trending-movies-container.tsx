import { tmdb } from "@/lib/tmdb";
import { getTranslations } from "next-intl/server";
import TrendingMoviesSection from "./trending-movies-section";
import { SectionState } from "./section-state";

export async function TrendingMoviesContainer() {
  const result = await tmdb.getTrendingMovies("day");

  if (!result.success) {
    return <SectionState type="error" entity="movies" error={result.error} />;
  }

  if (!result.data.results || result.data.results.length === 0) {
    return <SectionState type="empty" entity="movies" />;
  }

  return <TrendingMoviesSection initialMovies={result.data.results} />;
}
