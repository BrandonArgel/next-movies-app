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
import { ShowCard } from "./show-card";
import { type Show } from "@/types/show";

interface ShowCarouselProps {
  shows: Show[];
  active?: boolean;
  loop?: boolean;
}

export function ShowCarousel({
  shows,
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

  if (!shows?.length) return null;

  if (!isMounted) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex -ms-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="ps-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 shrink-0 grow-0 min-w-0"
            >
              <div className="space-y-2">
                <Skeleton className="w-full aspect-2/3 rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
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
      plugins={[pluginWheel.current]}
      className="w-full"
    >
      <CarouselContent className="-ms-4">
        {shows.map((show) => (
          <CarouselItem
            key={show.id}
            className="ps-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <ShowCard show={show} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
