"use client";

import { useTranslations } from "next-intl";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { type Movie } from "@/types/movies";

interface MovieRecommendationsProps {
  movies: Movie[];
}

export function MovieRecommendations({ movies }: MovieRecommendationsProps) {
  const t = useTranslations("movie");

  if (movies.length === 0) return null;

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

      <MovieCarousel movies={movies} active loop />
    </section>
  );
}
