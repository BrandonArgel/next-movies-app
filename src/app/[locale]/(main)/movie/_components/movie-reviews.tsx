// _components/movie-reviews.tsx
import { useTranslations } from "next-intl";
import { ReviewCard } from "@/components/movies/review-card";
import { Review } from "@/types/movies";

interface MovieReviewsProps {
  reviews: Review[];
}

export function MovieReviews({ reviews }: MovieReviewsProps) {
  const t = useTranslations("domains.movie");
  const displayReviews = reviews.slice(0, 4);

  if (displayReviews.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{t("reviews")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
