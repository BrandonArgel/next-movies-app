"use client";

import { useTranslations } from "next-intl";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import type { Movie } from "@/types/movies";

export function MovieSimilar({ movies }: { movies: Movie[] }) {
  const t = useTranslations("movie");

  if (movies.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="flex flex-col gap-4">
      <h2 id="similar-heading" className="font-bold text-xl md:text-2xl">
        {t("similar")}
      </h2>

      <MovieCarousel movies={movies} />
    </section>
  );
}
