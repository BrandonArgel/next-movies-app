import {
  BabyIcon,
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
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getMovieGenres, getTvShowGenres } from "@/lib/api/genres";

const GENRE_ICONS: Record<number, React.ElementType> = {
  // Movies & Shared
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
  // TV Specific
  10759: SwordsIcon, // Action & Adventure
  10762: BabyIcon, // Kids
  10763: NewspaperIcon, // News
  10764: GlobeIcon, // Reality
  10765: Wand2Icon, // Sci-Fi & Fantasy
  10766: HeartIcon, // Soap
  10767: TvIcon, // Talk
  10768: LandmarkIcon, // War & Politics
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.genres");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const MOVIE_GENRE_COLORS = [
  "from-violet-600 to-violet-900",
  "from-sky-500 to-sky-900",
  "from-emerald-500 to-emerald-900",
  "from-amber-500 to-amber-900",
  "from-rose-500 to-rose-900",
  "from-pink-500 to-pink-900",
  "from-cyan-500 to-cyan-900",
  "from-orange-500 to-orange-900",
  "from-indigo-500 to-indigo-900",
  "from-teal-500 to-teal-900",
  "from-yellow-500 to-yellow-900",
  "from-fuchsia-500 to-fuchsia-900",
  "from-lime-600 to-lime-900",
  "from-red-500 to-red-900",
  "from-blue-500 to-blue-900",
  "from-purple-500 to-purple-900",
  "from-green-600 to-green-900",
  "from-slate-500 to-slate-900",
  "from-stone-500 to-stone-900",
];

const TV_GENRE_COLORS = [
  "from-blue-600 to-blue-900",
  "from-purple-600 to-purple-900",
  "from-teal-600 to-teal-900",
  "from-rose-600 to-rose-900",
  "from-amber-600 to-amber-900",
  "from-indigo-600 to-indigo-900",
  "from-green-600 to-green-900",
  "from-orange-600 to-orange-900",
  "from-cyan-600 to-cyan-900",
  "from-violet-600 to-violet-900",
  "from-sky-600 to-sky-900",
  "from-emerald-600 to-emerald-900",
  "from-fuchsia-600 to-fuchsia-900",
  "from-red-600 to-red-900",
  "from-slate-600 to-slate-900",
];

interface GenreCardProps {
  id: number;
  name: string;
  href: string;
  color: string;
  Icon: React.ElementType;
}

function GenreCard({ id, name, href, color, Icon }: GenreCardProps) {
  return (
    <Link
      key={id}
      href={href}
      className={`group relative flex aspect-video items-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:aspect-square`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${color} transition-all duration-500 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] opacity-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/15 transition-all duration-300 group-hover:ring-white/40" />

      <div className="relative z-10 flex w-full flex-col gap-2 p-4">
        <Icon
          className="size-6 text-white/80 transition-colors duration-300 group-hover:text-white"
          strokeWidth={1.5}
        />
        <span className="font-semibold text-sm text-white leading-tight drop-shadow-sm md:text-base">
          {name}
        </span>
      </div>
    </Link>
  );
}

export default async function GenresPage() {
  const t = await getTranslations("pages.genres");

  const [movieGenresResult, tvGenresResult] = await Promise.all([
    getMovieGenres(),
    getTvShowGenres(),
  ]);

  const movieGenres = movieGenresResult.success
    ? movieGenresResult.data.genres
    : [];
  const tvGenres = tvGenresResult.success ? tvGenresResult.data.genres : [];

  const movieGenreIds = new Set(movieGenres.map((g) => g.id));
  const tvOnlyGenres = tvGenres.filter((g) => !movieGenreIds.has(g.id));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background pb-20">
      {/* Page header */}
      <div className="border-border border-b bg-linear-to-b from-muted/60 to-background">
        <div className="container mx-auto max-w-7xl px-4 pt-12 pb-10 md:px-8 xl:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TagIcon className="size-5" />
            </div>
            <div>
              <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
                {t("title")}
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="container mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-12 md:px-8 xl:px-12">
        {/* Movie genres */}
        {movieGenres.length > 0 && (
          <section aria-labelledby="movies-genres-heading">
            <div className="mb-6 flex items-center gap-3">
              <FilmIcon className="size-5 shrink-0 text-primary" />
              <h2
                id="movies-genres-heading"
                className="font-semibold text-2xl tracking-tight"
              >
                {t("movies_section")}
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                {movieGenres.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {movieGenres.map((genre, index) => {
                const Icon = GENRE_ICONS[genre.id] || TagIcon;
                return (
                  <GenreCard
                    key={genre.id}
                    id={genre.id}
                    name={genre.name}
                    href={`/genres/movie/${genre.id}`}
                    color={
                      MOVIE_GENRE_COLORS[index % MOVIE_GENRE_COLORS.length]!
                    }
                    Icon={Icon}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* TV-only genres */}
        {tvOnlyGenres.length > 0 && (
          <section aria-labelledby="tv-genres-heading">
            <div className="mb-6 flex items-center gap-3">
              <TvIcon className="size-5 shrink-0 text-primary" />
              <h2
                id="tv-genres-heading"
                className="font-semibold text-2xl tracking-tight"
              >
                {t("tv_section")}
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                {tvOnlyGenres.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {tvOnlyGenres.map((genre, index) => {
                const Icon = GENRE_ICONS[genre.id] || TagIcon;
                return (
                  <GenreCard
                    key={genre.id}
                    id={genre.id}
                    name={genre.name}
                    href={`/genres/tv/${genre.id}`}
                    color={TV_GENRE_COLORS[index % TV_GENRE_COLORS.length]!}
                    Icon={Icon}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
