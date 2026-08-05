import { getTranslations } from "next-intl/server";
import { TVShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { tmdb } from "@/lib/tmdb";
import { type TVShow } from "@/types/tv-show";

interface TvRecommendationsProps {
  showId: number;
}

export async function TvRecommendations({ showId }: TvRecommendationsProps) {
  const response = await tmdb.getTVShowRecommendations(showId);

  if (!response.success) return null;

  const shows = response.data.results;

  if (!shows?.length) return null;

  const t = await getTranslations("movie");

  return (
    <section
      aria-labelledby="recommendations-heading"
      className="flex flex-col gap-4"
    >
      <h2
        id="recommendations-heading"
        className="text-xl md:text-2xl font-bold"
      >
        {t("recommendations")}
      </h2>
      <TVShowCarousel tvShows={shows} active />
    </section>
  );
}
