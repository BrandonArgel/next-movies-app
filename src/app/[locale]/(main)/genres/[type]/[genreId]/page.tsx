import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { InfiniteTvShowGrid } from "@/components/tv-show/infinite-tv-grid";
import { type Movie } from "@/types/movies";
import { type TvShow } from "@/types/tv-show";
import {
  ChevronRightIcon,
  FilmIcon,
  TvIcon,
  TagIcon,
  SwordsIcon,
  CompassIcon,
  BabyIcon,
  SmileIcon,
  ShieldAlertIcon,
  VideoIcon,
  ClapperboardIcon,
  HeartIcon,
  Wand2Icon,
  HistoryIcon,
  GhostIcon,
  MusicIcon,
  SearchIcon,
  RocketIcon,
  ZapIcon,
  TentIcon,
  NewspaperIcon,
  GlobeIcon,
  LandmarkIcon,
} from "lucide-react";
import { getMovieGenres, getTvShowGenres } from "@/lib/api/genres";
import { discoverMovies } from "@/lib/api/movies";
import { discoverTVShows } from "@/lib/api/tv-shows";

const VALID_TYPES = ["movie", "tv"] as const;
type GenreType = (typeof VALID_TYPES)[number];

// Mapa de íconos idéntico al de la página de categorías
const GENRE_ICONS: Record<number, React.ElementType> = {
  28: SwordsIcon, // Action
  12: CompassIcon, // Adventure
  16: BabyIcon, // Animation
  35: SmileIcon, // Comedy
  80: ShieldAlertIcon, // Crime
  99: VideoIcon, // Documentary
  18: ClapperboardIcon, // Drama
  10751: HeartIcon, // Family
  14: Wand2Icon, // Fantasy
  36: HistoryIcon, // History
  27: GhostIcon, // Horror
  10402: MusicIcon, // Music
  9648: SearchIcon, // Mystery
  10749: HeartIcon, // Romance
  878: RocketIcon, // Science Fiction
  10770: TvIcon, // TV Movie
  53: ZapIcon, // Thriller
  10752: SwordsIcon, // War
  37: TentIcon, // Western
  10759: SwordsIcon, // Action & Adventure
  10762: BabyIcon, // Kids
  10763: NewspaperIcon, // News
  10764: GlobeIcon, // Reality
  10765: Wand2Icon, // Sci-Fi & Fantasy
  10766: HeartIcon, // Soap
  10767: TvIcon, // Talk
  10768: LandmarkIcon, // War & Politics
};

interface GenrePageProps {
  params: Promise<{ type: string; genreId: string }>;
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { type, genreId } = await params;

  if (!VALID_TYPES.includes(type as GenreType)) return {};

  const genresResult =
    type === "movie" ? await getMovieGenres() : await getTvShowGenres();

  const genre = genresResult.success
    ? genresResult.data.genres.find((g) => String(g.id) === genreId)
    : null;

  const t = await getTranslations("pages.genres");
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
  const t = await getTranslations("pages.genres");
  const tNav = await getTranslations("components.nav");

  // Obtener el ícono dinámico basado en el ID de la URL
  const Icon = GENRE_ICONS[Number(genreId)] || TagIcon;

  if (mediaType === "movie") {
    const [genresResult, tvGenresResult, moviesResult] = await Promise.all([
      getMovieGenres(),
      getTvShowGenres(),
      discoverMovies({ with_genres: genreId }, 1),
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
        <div
          className={`bg-linear-to-b from-primary/80 via-background/60 to-background border-b border-border`}
        >
          <div className="container mx-auto px-4 md:px-8 xl:px-12 pt-12 pb-10">
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

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Contenedor del Título con Ícono */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-primary/10 text-primary shrink-0">
                  <Icon className="size-6 sm:size-7" />
                </div>
                <div className="flex flex-col gap-1.5">
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
              </div>

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

  // Branch para TV
  const [genresResult, movieGenresResult, tvResult] = await Promise.all([
    getTvShowGenres(),
    getMovieGenres(),
    discoverTVShows({ with_genres: genreId }, 1),
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
      <div
        className={`bg-linear-to-b from-primary/80 via-background/60 to-background border-b border-border`}
      >
        <div className="container mx-auto px-4 md:px-8 xl:px-12 pt-12 pb-10">
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

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            {/* Contenedor del Título con Ícono */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Icon className="size-6 sm:size-7" />
              </div>
              <div className="flex flex-col gap-1.5">
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
            </div>

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

      <div className="container mx-auto px-4 md:px-8 xl:px-12 py-10">
        <InfiniteTvShowGrid
          initialTvShows={tvResult.data.results as TvShow[]}
          totalPages={tvResult.data.total_pages}
          type="genre"
          genreId={genreId}
        />
      </div>
    </main>
  );
}
