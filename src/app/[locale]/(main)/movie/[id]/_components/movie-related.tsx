"use client";

import { useTranslations } from "next-intl";
import { MovieCard } from "@/components/movies/movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Movie } from "@/types/movies";

interface MovieRelatedProps {
  movies: Movie[];
}

export function MovieRelated({ movies }: MovieRelatedProps) {
  const t = useTranslations("movie");

  if (movies.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <h2 id="related-heading" className="text-xl md:text-2xl font-bold">
        {t("related")}
      </h2>

      <Carousel
        opts={{ align: "start", loop: false, dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ms-4">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="ps-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
