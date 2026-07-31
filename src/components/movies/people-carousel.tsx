"use client";

import { useEffect, useRef, useState } from "react";
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
import { PersonCard } from "./person-card";
import { type CastMember } from "@/types/credits";

interface PeopleCarouselProps {
  people: CastMember[];
  active?: boolean;
  loop?: boolean;
}

export function PeopleCarousel({
  people,
  active = false,
  loop = false,
}: PeopleCarouselProps) {
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

  if (!people?.length) return null;

  if (!isMounted) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex -ms-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="ps-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 shrink-0 grow-0 min-w-0"
            >
              <div className="space-y-2">
                <Skeleton className="w-full aspect-2/3 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
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
      plugins={[pluginAutoplay.current, pluginWheel.current]}
      className="w-full"
    >
      <CarouselContent className="-ms-3">
        {people.map((person) => (
          <CarouselItem
            key={person.id}
            className="ps-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
          >
            <PersonCard person={person} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
