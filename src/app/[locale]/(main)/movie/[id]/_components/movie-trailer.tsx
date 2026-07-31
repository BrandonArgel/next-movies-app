"use client";

import { useTranslations } from "next-intl";
import type { VideoResult } from "@/types/movies";

interface MovieTrailerProps {
  videos: VideoResult[];
}

export function MovieTrailer({ videos }: MovieTrailerProps) {
  const t = useTranslations("movie");

  const trailer =
    videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official,
    ) ??
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
    videos.find((v) => v.site === "YouTube");

  return (
    <section aria-labelledby="trailer-heading" className="flex flex-col gap-4">
      <h2 id="trailer-heading" className="text-xl md:text-2xl font-bold">
        {t("trailer")}
      </h2>

      {trailer ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-border bg-muted">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full aspect-video rounded-xl bg-muted text-muted-foreground text-sm">
          {t("noTrailer")}
        </div>
      )}
    </section>
  );
}
