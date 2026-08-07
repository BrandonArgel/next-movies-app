import { getTranslations } from "next-intl/server";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { getRecommendedTvShows } from "@/lib/api/tv-shows";

interface TvRecommendationsProps {
  showId: number;
}

export async function TvRecommendations({ showId }: TvRecommendationsProps) {
  const response = await getRecommendedTvShows(showId);

  if (!response.success) return null;

  const shows = response.data.results;

  if (!shows?.length) return null;

  const t = await getTranslations("domains.tv");

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
      <TvShowCarousel tvShows={shows} active />
    </section>
  );
}
