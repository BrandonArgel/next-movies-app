"use client";

import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAppLocale } from "@/providers/locale-provider";
import type { Movie } from "@/types/movies";
import { Skeleton } from "../ui/skeleton";
import { MovieCard, MovieCardSkeleton } from "./movie-card";

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
  const [api, setApi] = useState<CarouselApi>();
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

  useEffect(() => {
    if (!api || !active) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const autoplayPlugin = api.plugins().autoplay;

          if (!autoplayPlugin) return;

          try {
            if (entry.isIntersecting) {
              autoplayPlugin.play();
            } else {
              autoplayPlugin.stop();
            }
          } catch (error) {
            console.debug("The Embla Autoplay plugin wasn't ready:", error);
          }
        });
      },
      { threshold: 0.5 },
    );

    const rootNode = api.rootNode();
    if (rootNode) {
      observer.observe(rootNode);
    }

    return () => {
      if (rootNode) observer.unobserve(rootNode);
      observer.disconnect();
    };
  }, [api, active]);

  if (!movies?.length) return null;

  if (!isMounted) {
    return <MovieCarouselSkeleton />;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        skipSnaps: false,
        dragFree: true,
        direction,
        loop,
      }}
      plugins={[pluginAutoplay.current, pluginWheel.current]}
      className="group/carousel relative w-full select-none"
    >
      <CarouselContent className="-ms-4">
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="basis-1/2 ps-4 md:basis-1/4 lg:basis-1/5"
          >
            <MovieCard movie={movie} subtitle={movie.job} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="pointer-events-none absolute top-0 bottom-11 left-0 z-10 w-6 bg-linear-to-r from-background to-transparent" />

      <div className="pointer-events-none absolute top-0 right-0 bottom-11 z-10 w-6 bg-linear-to-l from-background to-transparent" />

      <CarouselPrevious className="z-20 hidden border-none bg-background/70 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-primary! hover:text-primary-foreground! group-hover/carousel:bg-primary! group-hover/carousel:text-primary-foreground! md:flex" />
      <CarouselNext className="z-20 hidden border-none bg-background/70 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-primary! hover:text-primary-foreground! group-hover/carousel:bg-primary! group-hover/carousel:text-primary-foreground! md:flex" />
    </Carousel>
  );
}

export function MovieCarouselSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div className="-ms-4 flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-1/2 ps-4 md:basis-1/4 lg:basis-1/5"
              >
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        <div className="xl:-inset-s-12 absolute inset-s-2 inset-y-0 my-auto hidden h-8 w-8 items-center justify-center md:flex">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="xl:-inset-e-12 absolute inset-e-2 inset-y-0 my-auto hidden h-8 w-8 items-center justify-center md:flex">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
