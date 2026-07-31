// app/[locale]/tv/_components/tv-detail-hero.tsx
"use client";

import Image from "next/image";
import { Star, Play, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { type DetailedShow } from "@/types/show";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";

interface TvHeroProps {
  show: DetailedShow;
}

export function TvDetailHero({ show }: TvHeroProps) {
  const {
    backdrop_path,
    genres,
    images,
    overview,
    poster_path,
    first_air_date,
    number_of_seasons,
    tagline,
    name, // Usamos name en lugar de title
    videos,
    vote_average,
  } = show;

  const t = useTranslations("home");

  const startYear = first_air_date
    ? new Date(first_air_date).getFullYear()
    : null;
  const trailer = videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );

  const logo =
    images?.logos?.find((l) => l.iso_639_1 === "en") || images?.logos?.[0];

  return (
    <section
      className="relative w-full h-[80vh] min-h-150 flex items-center"
      aria-label={name}
    >
      {/* IMAGEN MÓVIL */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt={name}
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={name}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

      <div className="relative z-20 container mx-auto px-4 md:px-8 flex flex-col items-start gap-4 max-w-3xl">
        {logo ? (
          <div className="relative w-70 h-25 md:w-112.5 md:h-40 mb-2">
            <Image
              src={`https://image.tmdb.org/t/p/w500${logo.file_path}`}
              alt={name}
              fill
              priority
              className="object-contain object-left drop-shadow-lg"
            />
          </div>
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-2">
            {name}
          </h1>
        )}

        {/* METADATOS: Año y Temporadas */}
        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base font-medium text-white/90">
          <div className="flex items-center gap-1.5 text-red-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-white">{vote_average?.toFixed(1)}</span>
          </div>

          <span className="text-white/50">•</span>

          {startYear && (
            <>
              <span>{startYear}</span>
              <span className="text-white/50">•</span>
            </>
          )}

          {number_of_seasons && (
            <>
              <span>
                {number_of_seasons} Temporada{number_of_seasons > 1 ? "s" : ""}
              </span>
              <span className="text-white/50">•</span>
            </>
          )}

          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            SERIE
          </span>
        </div>

        {/* GÉNEROS */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            {genres.map((genre, index) => (
              <div key={genre.id} className="flex items-center gap-2">
                <span>{genre.name}</span>
                {index < genres.length - 1 && (
                  <span className="text-white/30 text-[10px]">●</span>
                )}
              </div>
            ))}
          </div>
        )}

        {tagline && (
          <p className="text-lg md:text-xl text-white/90 italic font-light mt-2">
            "{tagline}"
          </p>
        )}

        <p className="text-white/80 text-base md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl mt-1">
          {overview}
        </p>
      </div>
    </section>
  );
}
