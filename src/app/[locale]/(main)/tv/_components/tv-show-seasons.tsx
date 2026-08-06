import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { type Season } from "@/types/tv-show";
import { Star, CalendarDays, Tv2 } from "lucide-react";

interface TvShowSeasonsProps {
  seasons: Season[];
  showName: string;
}

export async function TvShowSeasons({ seasons, showName }: TvShowSeasonsProps) {
  if (!seasons || seasons.length === 0) return null;

  const t = await getTranslations("domains.tv");

  // Filter out "Specials" (season_number === 0) unless it's the only season
  const mainSeasons = seasons.filter((s) => s.season_number > 0);
  const displaySeasons = mainSeasons.length > 0 ? mainSeasons : seasons;

  return (
    <section aria-labelledby="seasons-heading" className="flex flex-col gap-6">
      <h2 id="seasons-heading" className="text-xl md:text-2xl font-bold">
        {t("seasons")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displaySeasons.map((season) => {
          const airYear = season.air_date
            ? new Date(season.air_date).getFullYear()
            : null;

          return (
            <div key={season.id} className="flex flex-col gap-2 group">
              {/* Poster */}
              <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-muted shadow-md ring-1 ring-border transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                {season.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                    alt={`${showName} — ${season.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Tv2 className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 px-0.5">
                <p className="font-semibold text-sm leading-tight line-clamp-2">
                  {season.name}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  {airYear && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {airYear}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Tv2 className="w-3 h-3" />
                    {season.episode_count} {t("episodes")}
                  </span>
                  {season.vote_average > 0 && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      {season.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
