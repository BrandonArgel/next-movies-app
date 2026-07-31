"use client";

import Image from "next/image";
// Agregamos un par de iconos más para las estadísticas
import {
  Star,
  ExternalLink,
  Info,
  Activity,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { useAppLocale } from "@/providers/locale-provider";
import { formatRuntime, formatReleaseDate } from "@/lib/utils";
import type { DetailedMovie } from "@/types/movies";

const formatCurrency = (amount: number, locale: string) => {
  if (!amount || amount === 0) return "-";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number, locale: string) => {
  if (!num) return "-";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    num,
  );
};

interface MovieDetailHeroProps {
  movie: DetailedMovie;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const { locale } = useAppLocale();

  const {
    adult,
    backdrop_path,
    budget,
    genres,
    homepage,
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
    vote_average,
  } = movie;

  const t = useTranslations("movie");

  const formattedRuntime = formatRuntime(runtime, locale);
  const formattedReleaseDate = formatReleaseDate(release_date, locale);

  const logo =
    images?.logos?.find((l) => locale.includes(l.iso_639_1)) ||
    images?.logos?.[0];

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-end md:items-center"
      aria-label={title}
    >
      {backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover object-top absolute inset-0 z-0"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-black/20 z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

      <div className="relative z-20 container mx-auto px-4 md:px-8 pb-10 md:py-16 flex flex-col md:flex-row items-start gap-8 max-w-6xl">
        {poster_path && (
          <div className="hidden md:block w-48 lg:w-56 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              width={224}
              height={336}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="flex flex-col gap-4 max-w-2xl">
          {/* Metadatos principales (Rating, Fecha, Duración, Adulto) */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            {/* BADGE ADULTO */}
            {adult && (
              <Badge
                variant="destructive"
                className="bg-red-600 px-1.5 py-0 text-[10px] font-black uppercase tracking-wider"
              >
                +18
              </Badge>
            )}

            <div className="flex items-center gap-1.5 text-yellow-400">
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              <span className="font-semibold text-white">
                {vote_average.toFixed(1)}
              </span>
            </div>

            {formattedReleaseDate && <span className="text-white/50">•</span>}
            {formattedReleaseDate && <span>{formattedReleaseDate}</span>}

            {runtime > 0 && (
              <>
                <span className="text-white/50">•</span>
                <span>{formattedRuntime}</span>
              </>
            )}
          </div>

          {/* Géneros */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label={t("genres")}>
              {genres.map((g) => (
                <Badge
                  key={g.id}
                  variant="secondary"
                  className="bg-primary/50 flex items-center gap-2"
                >
                  {g.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Título o Logo */}
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

          {/* Tagline */}
          {tagline && (
            <p className="text-white/60 italic text-base md:text-lg">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {/* Resumen */}
          <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-5">
            {overview}
          </p>

          {/* BOTÓN HOMEPAGE Y/O TRAILER */}
          {homepage && (
            <div className="mt-2">
              <LinkButton
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="bg-black/20 hover:bg-white/10 text-white border-white/20"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("official_website")}
              </LinkButton>
            </div>
          )}

          {/* CUADRÍCULA DE ESTADÍSTICAS (Status, Popularity, Budget, Revenue) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-white/50 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                <Info className="w-3 h-3" /> {t("status")}
              </span>
              <span className="text-white text-sm font-semibold">{status}</span>
            </div>

            {/* Popularity */}
            <div className="flex flex-col gap-1">
              <span className="text-white/50 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                <Activity className="w-3 h-3" /> {t("popularity")}
              </span>
              <span className="text-white text-sm font-semibold">
                {formatNumber(popularity, locale)}
              </span>
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1">
              <span className="text-white/50 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                <CircleDollarSign className="w-3 h-3" /> {t("budget")}
              </span>
              <span className="text-white text-sm font-semibold">
                {formatCurrency(budget, locale)}
              </span>
            </div>

            {/* Revenue */}
            <div className="flex flex-col gap-1">
              <span className="text-white/50 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3 h-3" /> {t("revenue")}
              </span>
              <span className="text-white text-sm font-semibold">
                {formatCurrency(revenue, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
