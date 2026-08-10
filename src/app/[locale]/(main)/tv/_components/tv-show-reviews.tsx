import { getTranslations } from "next-intl/server";
import { ReviewCard } from "@/components/movies/review-card";
import type { Review } from "@/types/movies";

interface TvShowReviewsProps {
  reviews: Review[];
}

export async function TvShowReviews({ reviews }: TvShowReviewsProps) {
  const displayReviews = reviews?.slice(0, 4);
  if (!displayReviews || displayReviews.length === 0) return null;

  const t = await getTranslations("domains.tv");

  return (
    <section
      aria-labelledby="tv-reviews-heading"
      className="flex flex-col gap-6"
    >
      <h2 id="tv-reviews-heading" className="font-bold text-xl md:text-2xl">
        {t("reviews")}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
