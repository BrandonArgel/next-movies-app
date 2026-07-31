"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Movie } from "@/tyoes/movies";

interface MovieCarouselProps {
  movies: Movie[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 mt-12">
      <h2 className="text-2xl font-bold mb-6">Películas Populares</h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie: Movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
            >
              <article className="flex flex-col gap-3 group">
                <div className="relative aspect-2/3 overflow-hidden rounded-lg">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
                <h3
                  className="font-semibold text-sm line-clamp-2"
                  title={movie.title}
                >
                  {movie.title}
                </h3>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
