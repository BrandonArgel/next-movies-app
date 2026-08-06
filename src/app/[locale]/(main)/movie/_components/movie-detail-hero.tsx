import { getFormatter, getTranslations, getLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Info, Activity, CircleDollarSign, TrendingUp } from "lucide-react";
import { formatRuntime } from "@/lib/formatters";
import { type DetailedMovie } from "@/types/movies";
import { AgeRatingBadge } from "./age-rating-badge";
import { MediaHeroLayout } from "@/components/ui/media-hero-layout";
import { getTMDBImageUrl } from "@/lib/tmdb";

interface MovieDetailHeroProps {
  movie: DetailedMovie;
  ageRating: string | null;
}

export async function MovieDetailHero({
  movie,
  ageRating,
}: MovieDetailHeroProps) {
  const t = await getTranslations("domains.movie");
  const format = await getFormatter();
  const locale = await getLocale();

  const logo =
    movie.images?.logos?.find(
      (l) => l.iso_639_1 && locale.includes(l.iso_639_1),
    ) || movie.images?.logos?.[0];

  const metaBadges = (
    <>
      {movie.adult && (
        <Badge
          variant="destructive"
          className="bg-red-600 px-1.5 py-0 font-black uppercase tracking-wider"
        >
          +18
        </Badge>
      )}
      {ageRating && <AgeRatingBadge rating={ageRating} />}
      {movie.release_date && (
        <>
          <span
            className="text-white/50 drop-shadow-hero-text"
            aria-hidden="true"
          >
            •
          </span>
          <span className="text-white/80 drop-shadow-hero-text">
            {format.dateTime(new Date(movie.release_date), {
              dateStyle: "long",
            })}
          </span>
        </>
      )}
      {movie.runtime > 0 && (
        <>
          <span
            className="text-white/50 drop-shadow-hero-text"
            aria-hidden="true"
          >
            •
          </span>
          <span className="text-white/80 drop-shadow-hero-text">
            {formatRuntime(movie.runtime, format)}
          </span>
        </>
      )}
    </>
  );

  const stats = [
    { label: t("status"), value: movie.status, icon: Info },
    {
      label: t("budget"),
      value:
        movie.budget > 0
          ? format.number(movie.budget, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          : "-",
      icon: CircleDollarSign,
    },
    {
      label: t("revenue"),
      value:
        movie.revenue > 0
          ? format.number(movie.revenue, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          : "-",
      icon: TrendingUp,
    },
  ];

  return (
    <MediaHeroLayout
      title={movie.title}
      backdropUrl={getTMDBImageUrl(movie.backdrop_path, "original")}
      posterUrl={getTMDBImageUrl(movie.poster_path, "w500")}
      logoUrl={getTMDBImageUrl(logo?.file_path, "w500")}
      rating={movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null}
      tagline={movie.tagline}
      overview={movie.overview}
      homepage={movie.homepage}
      genres={movie.genres}
      genreBasePath="movie"
      metaBadges={metaBadges}
      stats={stats}
      officialWebsiteLabel={t("official_website")}
    />
  );
}
