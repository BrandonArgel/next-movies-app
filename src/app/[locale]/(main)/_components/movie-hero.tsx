"use client";

import Image from "next/image";
import { Star, Play, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { type DetailedMovie } from "@/types/movies";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useAppLocale } from "@/providers/locale-provider";
import { formatRuntime, formatReleaseDate } from "@/lib/utils";

interface MovieHeroProps {
  movie: DetailedMovie;
}

export default function MovieHero({ movie }: MovieHeroProps) {
  const { locale } = useAppLocale();

  const {
    adult,
    backdrop_path,
    budget,
    genres,
    homepage,
    id,
    images,
    overview,
    popularity,
    poster_path,
    release_date,
    revenue,
    runtime,
    status,
    tagline,
    title,
    videos,
    vote_average,
  } = movie;

  const t = useTranslations("home");

  const formattedRuntime = formatRuntime(runtime, locale);
  const formattedReleaseDate = formatReleaseDate(release_date, locale);

  const trailer = videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );

  const logo =
    images?.logos?.find((l) => locale.includes(l.iso_639_1)) ||
    images?.logos?.[0];

  return (
    <section
      className="relative w-full h-[80vh] min-h-150 flex items-center"
      aria-label={title}
    >
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt={title}
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={title}
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
              alt={title}
              fill
              priority
              className="object-contain object-left drop-shadow"
            />
          </div>
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-2">
            {title}
          </h1>
        )}

        {/* METADATOS PRINCIPALES (Rating, Año, Duración, Adulto, Insignia) */}
        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base font-medium text-white/90">
          <div className="flex items-center gap-1.5 text-primary">
            <Star className="w-5 h-5 fill-current" aria-hidden="true" />
            <span className="text-white">{vote_average?.toFixed(1)}</span>
          </div>

          <span className="text-white/50" aria-hidden="true">
            •
          </span>

          {formattedReleaseDate && (
            <>
              <span>{formattedReleaseDate}</span>
              <span className="text-white/50" aria-hidden="true">
                •
              </span>
            </>
          )}

          {formattedRuntime && (
            <>
              <span>{formattedRuntime}</span>
              <span className="text-white/50" aria-hidden="true">
                •
              </span>
            </>
          )}

          {adult && (
            <>
              <span className="border border-white/40 text-white/80 text-xs px-1.5 py-0.5 rounded-sm">
                18+
              </span>
              <span className="text-white/50" aria-hidden="true">
                •
              </span>
            </>
          )}

          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            {t("trending")}
          </span>
        </div>

        {genres && genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            {genres.map((genre, index) => (
              <Badge
                key={genre.id}
                className="bg-primary/50 flex items-center gap-2"
              >
                <span>{genre.name}</span>
              </Badge>
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

        <div className="flex items-center gap-4 mt-4">
          {trailer ? (
            <DialogTrigger>
              <Button
                className="gap-2 px-6 py-6 text-base font-semibold rounded-md border-none transition-colors drop-shadow-md"
                aria-label={t("playTrailer")}
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                {t("playTrailer").toUpperCase()}
              </Button>
              <Dialog
                className="sm:max-w-5xl w-full p-0 border-none bg-black overflow-hidden aspect-video shadow-2xl"
                showCloseButton={true}
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title={`${title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Dialog>
            </DialogTrigger>
          ) : (
            <Button
              isDisabled
              className="bg-gray-800 text-white/50 gap-2 px-6 py-6 text-base font-semibold rounded-md border-none opacity-70 cursor-not-allowed"
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              NO TRAILER
            </Button>
          )}

          <LinkButton
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md gap-2 px-6 py-6 text-base font-semibold rounded-md border-none transition-colors"
            aria-label={t("details")}
            href={`/movie/${id}`}
          >
            <Info className="w-5 h-5" aria-hidden="true" />
            {t("details").toUpperCase()}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
