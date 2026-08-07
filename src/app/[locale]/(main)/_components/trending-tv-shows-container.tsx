import TrendingTVShowsSection from "./trending-tv-shows-section";
import { SectionState } from "./section-state";
import { getTrendingTvShows } from "@/lib/api/tv-shows";

export async function TrendingTvShowsContainer() {
  const result = await getTrendingTvShows("day");

  if (!result.success) {
    return <SectionState type="error" entity="tv_shows" error={result.error} />;
  }

  if (!result.data.results || result.data.results.length === 0) {
    return <SectionState type="empty" entity="tv_shows" />;
  }

  return <TrendingTVShowsSection initialTVShows={result.data.results} />;
}
