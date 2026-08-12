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
import { PersonCard, PersonCardSkeleton, type PersonData } from "./person-card";

interface PeopleCarouselProps {
  people: PersonData[];
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
    return <PeopleCarouselSkeleton />;
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
      <CarouselContent className="-ms-3">
        {people.map((person) => (
          <CarouselItem
            key={person.id}
            className="basis-1/3 ps-3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
          >
            <PersonCard person={person} />
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

function PeopleCarouselSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div className="-ms-3 flex">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-1/3 ps-3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
              >
                <PersonCardSkeleton />
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
