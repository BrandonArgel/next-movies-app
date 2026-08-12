"use client";

import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppLocale } from "@/providers/locale-provider";
import type { TvShow } from "@/types/tv-show";
import { TVShowCard, TVShowCardSkeleton } from "./tv-show-card";

interface TvShowCarouselProps {
  tvShows: TvShow[];
  active?: boolean;
  loop?: boolean;
}

export function TvShowCarousel({
  tvShows,
  active = false,
  loop = false,
}: TvShowCarouselProps) {
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
      className="group/carousel relative w-full select-none"
    >
      <CarouselContent className="-ms-4">
        {tvShows.map((tvShow) => (
          <CarouselItem
            key={tvShow.id}
            className="basis-1/2 ps-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <TVShowCard tvShow={tvShow} />
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

function TVShowCarouselSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div className="-ms-4 flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-1/2 ps-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <TVShowCardSkeleton />
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
