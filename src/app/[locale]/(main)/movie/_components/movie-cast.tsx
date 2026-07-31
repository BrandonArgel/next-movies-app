"use client";

import { useTranslations } from "next-intl";
import { PeopleCarousel } from "@/components/movies/people-carousel";
import { type CastMember } from "@/types/credits";

interface MovieCastProps {
  cast: CastMember[];
}

const CAST_LIMIT = 20;

export function MovieCast({ cast }: MovieCastProps) {
  const t = useTranslations("movie");

  return (
    <section aria-labelledby="cast-heading" className="flex flex-col gap-4">
      <h2 id="cast-heading" className="text-xl md:text-2xl font-bold">
        {t("cast")}
      </h2>

      <PeopleCarousel people={cast} loop />
    </section>
  );
}
