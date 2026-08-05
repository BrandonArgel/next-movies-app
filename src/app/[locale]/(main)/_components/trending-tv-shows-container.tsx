import { tmdb } from "@/lib/tmdb";
import { getTranslations } from "next-intl/server";
import TrendingTVShowsSection from "./trending-tv-shows-section";
import { SectionState } from "./section-state";

export async function TrendingTVShowsContainer() {
  const result = await tmdb.getTrendingTVShows("day");

  if (!result.success) {
    return <SectionState type="error" entity="tv_shows" error={result.error} />;
  }

  if (!result.data.results || result.data.results.length === 0) {
    return <SectionState type="empty" entity="tv_shows" />;
  }

  return <TrendingTVShowsSection initialTVShows={result.data.results} />;
}
