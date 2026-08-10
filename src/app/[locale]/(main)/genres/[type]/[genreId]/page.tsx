import {
  BabyIcon,
  ChevronRightIcon,
  ClapperboardIcon,
  CompassIcon,
  FilmIcon,
  GhostIcon,
  GlobeIcon,
  HeartIcon,
  HistoryIcon,
  LandmarkIcon,
  MusicIcon,
  NewspaperIcon,
  RocketIcon,
  SearchIcon,
  ShieldAlertIcon,
  SmileIcon,
  SwordsIcon,
  TagIcon,
  TentIcon,
  TvIcon,
  VideoIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";
import { InfiniteTvShowGrid } from "@/components/tv-show/infinite-tv-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getMovieGenres, getTvShowGenres } from "@/lib/api/genres";
import { discoverMovies } from "@/lib/api/movies";
import { discoverTVShows } from "@/lib/api/tv-shows";
import type { Movie } from "@/types/movies";
import type { TvShow } from "@/types/tv-show";
import { GenresBreadcrumb } from "./ _components/genres-breadcrumb";

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
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div
          className={`border-border border-b bg-linear-to-b from-primary/80 via-background/60 to-background`}
        >
          <div className="container mx-auto max-w-7xl px-4 pt-4 pb-10 md:px-8 xl:px-12">
            <GenresBreadcrumb genreName={genreName} />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Contenedor del Título con Ícono */}
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-18">
                  <Icon className="size-8 sm:size-12" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                      <FilmIcon className="size-3" />
                      {tNav("movies")}
                    </span>
                  </div>
                  <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
                    {genreName}
                  </h1>
                </div>
              </div>

              {alsoInTV && (
                <Link
                  href={`/genres/tv/${genreId}`}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:border-foreground/50 hover:text-foreground sm:self-auto"
                >
                  <TvIcon className="size-4" />
                  {tNav("tv_shows")}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-10 md:px-8 xl:px-12">
          <InfiniteMovieGrid
            initialMovies={moviesResult.data.results as Movie[]}
            totalPages={moviesResult.data.total_pages}
            type="genre"
            genreId={genreId}
          />
        </div>
      </div>
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
    <main className="flex min-h-screen w-full flex-col bg-background">
      <div
        className={`border-border border-b bg-linear-to-b from-primary/80 via-background/60 to-background`}
      >
        <div className="container mx-auto max-w-7xl px-4 pt-12 pb-4 md:px-8 xl:px-12">
          <GenresBreadcrumb genreName={genreName} />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Contenedor del Título con Ícono */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-18">
                <Icon className="size-8 sm:size-12" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                    <TvIcon className="size-3" />
                    {tNav("tv_shows")}
                  </span>
                </div>
                <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
                  {genreName}
                </h1>
              </div>
            </div>

            {alsoInMovies && (
              <Link
                href={`/genres/movie/${genreId}`}
                className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:border-foreground/50 hover:text-foreground sm:self-auto"
              >
                <FilmIcon className="size-4" />
                {tNav("movies")}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 md:px-8 xl:px-12">
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
