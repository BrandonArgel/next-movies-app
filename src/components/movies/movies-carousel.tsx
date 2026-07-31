"use client";

import { useEffect, useState, useRef } from "react";
import { useAppLocale } from "@/providers/locale-provider";
import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { MovieCard } from "./movie-card";
import { type Movie } from "@/types/movies";

interface MoviesCarouselProps {
  movies: Movie[];
  active?: boolean;
  loop?: boolean;
}

export function MovieCarousel({
  movies,
  active = false,
  loop = false,
}: MoviesCarouselProps) {
  const { direction } = useAppLocale();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pluginAutoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      active,
    }),
  );

  const pluginWheel = useRef(
    WheelGesturesPlugin({
      forceWheelAxis: "x",
    }),
  );

  if (!movies?.length) return null;

  if (!isMounted) {
    return (
      <div className="w-full space-y-4">
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div className="flex -ms-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="ps-4 basis-1/2 md:basis-1/4 lg:basis-1/5 shrink-0 grow-0 min-w-0"
                >
                  <div className="space-y-3">
                    <Skeleton className="w-full aspect-2/3 rounded-xl" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex absolute inset-y-0 -inset-s-12 my-auto h-8 w-8 items-center justify-center">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="hidden md:flex absolute inset-y-0 -inset-e-12 my-auto h-8 w-8 items-center justify-center">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        skipSnaps: false,
        dragFree: true,
        direction,
        loop,
      }}
      plugins={[pluginAutoplay.current, pluginWheel.current]}
      className="w-full"
    >
      <CarouselContent className="-ms-4">
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="ps-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
          >
            <MovieCard movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
