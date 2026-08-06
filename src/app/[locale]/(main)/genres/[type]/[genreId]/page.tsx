import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ChevronRightIcon, FilmIcon, TvIcon } from "lucide-react";
import { tmdb } from "@/lib/tmdb";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { InfiniteTvGrid } from "@/components/tv-show/infinite-tv-grid";
import { type Movie } from "@/types/movies";
import { type TvShow } from "@/types/tv-show";

interface GenrePageProps {
  params: Promise<{ type: string; genreId: string }>;
}

const VALID_TYPES = ["movie", "tv"] as const;
type GenreType = (typeof VALID_TYPES)[number];

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { type, genreId } = await params;

  if (!VALID_TYPES.includes(type as GenreType)) return {};

  const genresResult =
    type === "movie"
      ? await tmdb.getMovieGenres()
      : await tmdb.getTVShowGenres();

  const genre = genresResult.success
    ? genresResult.data.genres.find((g) => String(g.id) === genreId)
    : null;

  const t = await getTranslations("genres");
  const name = genre?.name ?? genreId;

  return {
    title: t("explore_genre", { genre: name }),
    description: t("explore_genre", { genre: name }),
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { type, genreId } = await params;

  if (!VALID_TYPES.includes(type as GenreType)) {
    notFound();
  }

  const mediaType = type as GenreType;
  const t = await getTranslations("genres");
  const tNav = await getTranslations("nav");

  if (mediaType === "movie") {
    const [genresResult, tvGenresResult, moviesResult] = await Promise.all([
      tmdb.getMovieGenres(),
      tmdb.getTVShowGenres(),
      tmdb.discoverMoviesByGenre(genreId, 1),
    ]);

    if (!moviesResult.success) throw new Error(moviesResult.error);

    const genre = genresResult.success
      ? genresResult.data.genres.find((g) => String(g.id) === genreId)
      : null;
    const genreName = genre?.name ?? genreId;

    const alsoInTV = tvGenresResult.success
      ? tvGenresResult.data.genres.some((g) => String(g.id) === genreId)
      : false;

    return (
      <main className="flex flex-col w-full min-h-screen bg-background">
        {/* Genre hero */}
        <div
          className={`bg-linear-to-b from-primary/80 via-background/60 to-background border-b border-border`}
        >
          <div className="container mx-auto px-4 md:px-8 xl:px-12 pt-12 pb-10">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
            >
              <Link
                href="/genres"
                className="hover:text-foreground transition-colors"
              >
                {t("title")}
              </Link>
              <ChevronRightIcon className="size-3.5 shrink-0" />
              <span className="text-foreground font-medium">{genreName}</span>
            </nav>

            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                    <FilmIcon className="size-3" />
                    {tNav("movies")}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {genreName}
                </h1>
              </div>

              {/* Toggle to TV if genre also exists there */}
              {alsoInTV && (
                <Link
                  href={`/genres/tv/${genreId}`}
                  className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-medium text-muted-foreground border border-border rounded-full px-4 py-2 hover:text-foreground hover:border-foreground/50 transition-colors"
                >
                  <TvIcon className="size-4" />
                  {tNav("tv_shows")}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="container mx-auto px-4 md:px-8 xl:px-12 py-10">
          <InfiniteMovieGrid
            initialMovies={moviesResult.data.results as Movie[]}
            totalPages={moviesResult.data.total_pages}
            type="genre"
            genreId={genreId}
          />
        </div>
      </main>
    );
  }

  // TV branch
  const [genresResult, movieGenresResult, tvResult] = await Promise.all([
    tmdb.getTVShowGenres(),
    tmdb.getMovieGenres(), // to check if genre also exists in movies
    tmdb.discoverTVShowsByGenre(genreId, 1),
  ]);

  if (!tvResult.success) throw new Error(tvResult.error);

  const genre = genresResult.success
    ? genresResult.data.genres.find((g) => String(g.id) === genreId)
    : null;
  const genreName = genre?.name ?? genreId;

  const alsoInMovies = movieGenresResult.success
    ? movieGenresResult.data.genres.some((g) => String(g.id) === genreId)
    : false;

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      {/* Genre hero */}
      <div
        className={`bg-linear-to-b from-primary/80 via-background/60 to-background border-b border-border`}
      >
        <div className="container mx-auto px-4 md:px-8 xl:px-12 pt-12 pb-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
          >
            <Link
              href="/genres"
              className="hover:text-foreground transition-colors"
            >
              {t("title")}
            </Link>
            <ChevronRightIcon className="size-3.5 shrink-0" />
            <span className="text-foreground font-medium">{genreName}</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                  <TvIcon className="size-3" />
                  {tNav("tv_shows")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {genreName}
              </h1>
            </div>

            {/* Toggle to Movies if genre also exists there */}
            {alsoInMovies && (
              <Link
                href={`/genres/movie/${genreId}`}
                className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-medium text-muted-foreground border border-border rounded-full px-4 py-2 hover:text-foreground hover:border-foreground/50 transition-colors"
              >
                <FilmIcon className="size-4" />
                {tNav("movies")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="container mx-auto px-4 md:px-8 xl:px-12 py-10">
        <InfiniteTVGrid
          initialShows={tvResult.data.results as TVShow[]}
          totalPages={tvResult.data.total_pages}
          type="genre"
          genreId={genreId}
        />
      </div>
    </main>
  );
}
