import { Star, Play, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getFormatter, getTranslations, getLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { formatRuntime } from "@/lib/utils";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { tmdb } from "@/lib/tmdb";
import { MovieTrailerDialog } from "./movie-trailer-dialog";

interface MovieHeroProps {
  movieId: number;
}

export default async function MovieHero({ movieId }: MovieHeroProps) {
  const heroDetailsResult = await tmdb.getMovieDetails(movieId);

  if (!heroDetailsResult.success) {
    return null;
  }

  const locale = await getLocale();
  const format = await getFormatter();
  const t = await getTranslations("home.hero");

  const {
    adult,
    backdrop_path,
    genres,
    id,
    images,
    overview,
    poster_path,
    release_date,
    runtime,
    tagline,
    title,
    videos,
    vote_average,
  } = heroDetailsResult.data;

  const formattedRating = vote_average > 0 ? vote_average.toFixed(1) : null;

  const formattedReleaseDate = release_date
    ? format.dateTime(new Date(release_date), "movieRelease")
    : null;

  const formattedRuntime = formatRuntime(runtime, locale);

  const logo =
    images?.logos?.find((l) => locale.includes(l.iso_639_1)) ||
    images?.logos?.[0];
  const logoUrl = logo
    ? `https://image.tmdb.org/t/p/w500${logo.file_path}`
    : null;

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w780${poster_path}`
    : null;
  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/original${backdrop_path}`
    : null;

  const trailer = videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );

  const hasGenres = genres && genres.length > 0;

  return (
    <section
      className="relative w-full h-[80vh] min-h-150 flex items-center bg-black"
      aria-label={title}
    >
      {/* Mobile Image */}
      {posterUrl && (
        <ImageWithSkeleton
          src={posterUrl}
          alt={title}
          fill
          containerClassName="md:hidden absolute inset-0 z-0 bg-black"
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 0vw"
        />
      )}

      {/* Desktop Image */}
      {backdropUrl && (
        <ImageWithSkeleton
          src={backdropUrl}
          alt={title}
          fill
          containerClassName="hidden md:block absolute inset-0 z-0 bg-black"
          className="object-cover"
          sizes="(max-width: 768px) 0vw, 100vw"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-8 flex flex-col items-start gap-4 max-w-3xl">
        {/* Title */}
        {logoUrl ? (
          <ImageWithSkeleton
            src={logoUrl}
            alt={title}
            fill
            containerClassName="relative w-70 h-25 md:w-112.5 md:h-40 mb-2"
            className="object-contain object-left drop-shadow"
            sizes="(max-width: 768px) 280px, 450px"
          />
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-2">
            {title}
          </h1>
        )}

        {/* Main metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base font-medium text-white/90">
          {formattedRating && (
            <>
              <div className="flex items-center gap-1.5 text-primary">
                <Star className="w-5 h-5 fill-current" aria-hidden="true" />
                <span className="text-white">{formattedRating}</span>
              </div>
              <span className="text-white/50" aria-hidden="true">
                •
              </span>
            </>
          )}

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

          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            {t("trending")}
          </span>
        </div>

        {/* Genres */}
        {hasGenres && (
          <div className="flex flex-wrap gap-2">
            {genres.map(({ id, name }) => (
              <Link key={id} href={`/genres/movie/${id}`}>
                <Badge className="bg-primary/80 flex items-center gap-2">
                  {name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Synapsis and Tagline */}
        {tagline && (
          <p className="text-lg md:text-xl text-white/90 italic font-light mt-2">
            "{tagline}"
          </p>
        )}

        <p className="text-white/80 text-base md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl mt-1">
          {overview}
        </p>

        {/* Botones de acción */}
        <div className="flex items-center gap-4 mt-4">
          {trailer ? (
            <MovieTrailerDialog
              trailerKey={trailer.key}
              title={title}
              buttonText={t("play_trailer")}
            />
          ) : (
            <Button
              isDisabled
              className="bg-gray-800 text-white/50 gap-2 px-6 py-6 text-base font-semibold rounded-md border-none opacity-70 cursor-not-allowed"
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              {t("no_trailer")}
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
