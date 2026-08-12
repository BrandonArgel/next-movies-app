"use client";

import { useTranslations } from "next-intl";
import { PeopleCarousel } from "@/components/people/people-carousel";
import type { CastMember } from "@/types/credits";

interface MovieCastProps {
  cast: CastMember[];
}

export function MovieCast({ cast }: MovieCastProps) {
  const t = useTranslations("domains.movie");

  if (!cast || cast.length === 0) return;

  return (
    <section aria-labelledby="cast-heading" className="flex flex-col gap-4">
      <h2 id="cast-heading" className="font-bold text-xl md:text-2xl">
        {t("cast")}
      </h2>

      <PeopleCarousel people={cast} loop />
    </section>
  );
}
