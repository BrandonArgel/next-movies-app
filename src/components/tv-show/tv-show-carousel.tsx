"use client";

import { useState, useEffect, useRef } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { TVShowCard, TVShowCardSkeleton } from "./tv-show-card";
import { type TVShow } from "@/types/tv-show";

interface ShowCarouselProps {
  tvShows: TVShow[];
  active?: boolean;
  loop?: boolean;
}

export function TVShowCarousel({
  tvShows,
  active = false,
  loop = false,
}: ShowCarouselProps) {
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

  if (!tvShows?.length) return null;

  if (!isMounted) {
    return <TVShowCarouselSkeleton />;
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
      className="select-none w-full group/carousel relative"
    >
      <CarouselContent className="-ms-4">
        {tvShows.map((tvShow) => (
          <CarouselItem
            key={tvShow.id}
            className="ps-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <TVShowCard tvShow={tvShow} />
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

export function TVShowCarouselSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div className="flex -ms-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="ps-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 shrink-0 grow-0 min-w-0"
              >
                <TVShowCardSkeleton />
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
