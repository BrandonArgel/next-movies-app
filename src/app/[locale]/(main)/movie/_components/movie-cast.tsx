"use client";

import { useTranslations } from "next-intl";
import { PeopleCarousel } from "@/components/people/people-carousel";
import { type CastMember } from "@/types/credits";

interface MovieCastProps {
  cast: CastMember[];
}

export function MovieCast({ cast }: MovieCastProps) {
  if (!cast || cast.length === 0) return;

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
