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
import { MovieCard, MovieCardSkeleton } from "./movie-card";
import { type CarouselApi } from "@/components/ui/carousel";
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
  }, [api]);

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
      className="select-none w-full group/carousel relative"
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
      <div className="absolute left-0 top-0 bottom-11 w-6 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />

      <div className="absolute right-0 top-0 bottom-11 w-6 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />

      <CarouselPrevious className="hidden md:flex z-20 border-none shadow-md backdrop-blur-md bg-background/70 group-hover/carousel:bg-primary! group-hover/carousel:text-primary-foreground! hover:bg-primary! hover:text-primary-foreground! transition-all duration-300" />
      <CarouselNext className="hidden md:flex z-20 border-none shadow-md backdrop-blur-md bg-background/70 group-hover/carousel:bg-primary! group-hover/carousel:text-primary-foreground! hover:bg-primary! hover:text-primary-foreground! transition-all duration-300" />
    </Carousel>
  );
}

export function MovieCarouselSkeleton() {
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
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex absolute inset-y-0 inset-s-2 xl:-inset-s-12 my-auto h-8 w-8 items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="hidden md:flex absolute inset-y-0 inset-e-2 xl:-inset-e-12 my-auto h-8 w-8 items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
