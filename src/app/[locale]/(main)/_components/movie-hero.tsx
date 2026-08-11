import { Bookmark, Heart, Info, Play, Star } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { MediaUserActions } from "@/components/layout/media-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Link } from "@/i18n/navigation";
import { getMediaAccountState } from "@/lib/api/account";
import { getMovie } from "@/lib/api/movies";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { formatRuntime } from "@/lib/utils";
import { MovieTrailerDialog } from "./movie-trailer-dialog";

interface MovieHeroProps {
  movieId: number;
  userId: number | undefined;
  token: string | undefined;
}

export async function MovieHero({ movieId, userId, token }: MovieHeroProps) {
  const [heroDetailsResult, accountStateResult] = await Promise.all([
    getMovie(movieId),
    token
      ? getMediaAccountState("movie", movieId, token)
      : Promise.resolve(null),
  ]);

  if (!heroDetailsResult.success) {
    return null;
  }

  const accountState = accountStateResult?.success
    ? accountStateResult.data
    : null;

  const locale = await getLocale();
  const format = await getFormatter();
  const t = await getTranslations("pages.home.hero");
  const tGlobal = await getTranslations("global.states");

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
  const logoUrl = getTMDBImageUrl(logo?.file_path, "w500");
  const posterUrl = getTMDBImageUrl(poster_path, "w500");
  const backdropUrl = getTMDBImageUrl(backdrop_path, "original");
  const trailer = videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );

  const hasGenres = genres && genres.length > 0;

  return (
    <section
      className="relative flex h-[80vh] min-h-150 w-full items-center bg-black"
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
      <div className="absolute inset-0 z-10 bg-linear-to-r from-black/95 via-black/60 to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="container relative z-20 mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 md:px-8">
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
          <h1 className="mb-2 font-bold text-4xl text-white leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {title}
          </h1>
        )}

        {/* Main metadata */}
        <div className="flex flex-wrap items-center gap-3 font-medium text-sm text-white/90 md:text-base">
          {formattedRating && (
            <>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star className="h-5 w-5 fill-current" aria-hidden="true" />
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
              <span className="rounded-sm border border-white/40 px-1.5 py-0.5 text-white/80 text-xs">
                18+
              </span>
              <span className="text-white/50" aria-hidden="true">
                •
              </span>
            </>
          )}

          <span className="rounded-sm bg-primary px-2 py-1 font-bold text-primary-foreground text-xs uppercase tracking-wider">
            {t("trending")}
          </span>
        </div>

        {/* User */}
        {userId && accountState && (
          <MediaUserActions
            mediaId={id}
            mediaTitle={title}
            mediaType="movie"
            initialFavorite={accountState.favorite}
            initialWatchLater={accountState.watchlist}
            initialRating={accountState.rated.value}
          />
        )}

        {/* Synapsis and Tagline */}
        {tagline && (
          <p className="mt-2 font-light text-lg text-white/90 italic md:text-xl">
            "{tagline}"
          </p>
        )}

        <p className="mt-1 line-clamp-3 max-w-2xl text-base text-white/80 leading-relaxed md:line-clamp-4 md:text-lg">
          {overview}
        </p>

        {/* Genres */}
        {hasGenres && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map(({ id, name }) => (
              <Link key={id} href={`/genres/movie/${id}`}>
                <Badge className="flex items-center gap-2 bg-primary/80">
                  {name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {trailer ? (
            <MovieTrailerDialog
              trailerKey={trailer.key}
              title={title}
              buttonText={t("play_trailer")}
            />
          ) : (
            <Button
              isDisabled
              className="cursor-not-allowed gap-2 rounded-md border-none bg-gray-800 px-6 py-6 font-semibold text-base text-white/50 opacity-70"
            >
              <Play className="h-5 w-5" aria-hidden="true" />
              {tGlobal("no_trailer")}
            </Button>
          )}

          <LinkButton
            variant="secondary"
            className="gap-2 rounded-md border-none bg-white/20 px-6 py-6 font-semibold text-base text-white backdrop-blur-md transition-colors hover:bg-white/30"
            aria-label={t("details")}
            href={`/movie/${id}`}
          >
            <Info className="h-5 w-5" aria-hidden="true" />
            {t("details").toUpperCase()}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
