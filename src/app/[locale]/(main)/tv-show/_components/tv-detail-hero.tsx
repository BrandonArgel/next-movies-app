import { getFormatter, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Info, Activity, Tv2, Users } from "lucide-react";
import { type DetailedTVShow } from "@/types/tv-show";
import { MediaHeroLayout } from "@/components/ui/media-hero-layout";
import { getTMDBImageUrl } from "@/lib/tmdb";

interface TvHeroProps {
  show: DetailedTVShow;
}

export async function TvDetailHero({ show }: TvHeroProps) {
  const t = await getTranslations("tv");
  const format = await getFormatter();

  const logo =
    show.images?.logos?.find((l) => l.iso_639_1 === "en") ||
    show.images?.logos?.[0];
  const startYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;

  const metaBadges = (
    <>
      {startYear && (
        <>
          <span className="text-white/50" aria-hidden="true">
            •
          </span>
          <span className="text-white/80 drop-shadow-hero-text">
            {startYear}
          </span>
        </>
      )}
      {show.number_of_seasons > 0 && (
        <>
          <span className="text-white/50" aria-hidden="true">
            •
          </span>
          <span className="text-white/80 drop-shadow-hero-text">
            {show.number_of_seasons}{" "}
            {show.number_of_seasons === 1 ? t("season") : t("seasons")}
          </span>
        </>
      )}
      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
        {t("series_badge")}
      </span>
      {show.in_production && (
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs">
          {t("in_production")}
        </Badge>
      )}
    </>
  );

  const stats = [
    { label: t("status"), value: show.status, icon: Info },
    {
      label: t("popularity"),
      value: format.number(show.popularity || 0, { maximumFractionDigits: 0 }),
      icon: Activity,
    },
    { label: t("episodes"), value: show.number_of_episodes, icon: Tv2 },
  ];

  if (show.created_by && show.created_by.length > 0) {
    stats.push({
      label: t("created_by"),
      value: show.created_by.map((c) => c.name).join(", "),
      icon: Users,
    });
  }

  return (
    <MediaHeroLayout
      title={show.name}
      backdropUrl={getTMDBImageUrl(show.backdrop_path, "original")}
      posterUrl={getTMDBImageUrl(show.poster_path, "w500")}
      logoUrl={getTMDBImageUrl(logo?.file_path, "w500")}
      rating={show.vote_average > 0 ? show.vote_average.toFixed(1) : null}
      tagline={show.tagline}
      overview={show.overview}
      homepage={show.homepage}
      genres={show.genres}
      genreBasePath="tv-show"
      metaBadges={metaBadges}
      stats={stats}
      officialWebsiteLabel={t("official_website")}
    />
  );
}
