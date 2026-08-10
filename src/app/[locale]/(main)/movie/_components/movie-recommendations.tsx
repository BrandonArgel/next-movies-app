import { getTranslations } from "next-intl/server";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { getRecommendedMovies } from "@/lib/api/movies";

interface MovieRecommendationsProps {
  movieId: number;
}

export async function MovieRecommendations({
  movieId,
}: MovieRecommendationsProps) {
  const response = await getRecommendedMovies(movieId);

  if (!response.success) return null;

  const movies = response.data.results;
  if (movies.length === 0) return null;

  const t = await getTranslations("domains.movie");

  return (
    <section
      aria-labelledby="recommendations-heading"
      className="flex flex-col gap-4"
    >
      <h2
        id="recommendations-heading"
        className="font-bold text-xl md:text-2xl"
      >
        {t("recommendations")}
      </h2>

      <MovieCarousel movies={movies} active />
    </section>
  );
}
