"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CastMember } from "@/types/movies";

interface MovieCastProps {
  cast: CastMember[];
}

const CAST_LIMIT = 20;

export function MovieCast({ cast }: MovieCastProps) {
  const t = useTranslations("movie");

  const displayCast = cast.slice(0, CAST_LIMIT);

  if (displayCast.length === 0) return null;

  return (
    <section aria-labelledby="cast-heading" className="flex flex-col gap-4">
      <h2 id="cast-heading" className="text-xl md:text-2xl font-bold">
        {t("cast")}
      </h2>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ms-3">
          {displayCast.map((member) => (
            <CarouselItem
              key={member.id}
              className="ps-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
            >
              <article className="flex flex-col gap-2">
                <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
                  {member.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 15vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground text-2xl">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-0.5">
                  <p className="text-xs font-semibold line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {member.character}
                  </p>
                </div>
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
