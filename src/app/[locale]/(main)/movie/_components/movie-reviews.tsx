import { useTranslations } from "next-intl";
import { ReviewCard } from "@/components/movies/review-card";
import type { Review } from "@/types/movies";

interface MovieReviewsProps {
  reviews: Review[];
}

export function MovieReviews({ reviews }: MovieReviewsProps) {
  const t = useTranslations("domains.movie");
  const displayReviews = reviews.slice(0, 4);

  if (displayReviews.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl">{t("reviews")}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
