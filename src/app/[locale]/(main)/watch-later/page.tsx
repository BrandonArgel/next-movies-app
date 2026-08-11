import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { getWatchLaterMovies, getWatchLaterTvShows } from "@/lib/api/account";
import { requireUser } from "@/lib/auth-utils";

export default async function FavoritesPage() {
  const { user, token } = await requireUser();

  if (!user || !token) {
    redirect("/");
  }

  const t = await getTranslations("pages.watch_later");
  const tGlobal = await getTranslations("global.states");
  const tErrors = await getTranslations("errors");

  const [resWatchLaterMovies, resWatchLaterTvShows] = await Promise.all([
    getWatchLaterMovies(user.id, token, 1),
    getWatchLaterTvShows(user.id, token, 1),
  ]);

  const watchLaterMovies = resWatchLaterMovies.success
    ? resWatchLaterMovies.data.results
    : [];
  const watchLaterTvShows = resWatchLaterTvShows.success
    ? resWatchLaterTvShows.data.results
    : [];

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-24 mt-8 px-4 md:px-8 xl:px-12">
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("movies_title")}</h2>

        {!resWatchLaterMovies.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resWatchLaterMovies.error)}
          </p>
        ) : watchLaterMovies.length > 0 ? (
          <MovieCarousel movies={watchLaterMovies} active loop />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_movies")}</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("tv_shows_title")}</h2>

        {!resWatchLaterTvShows.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resWatchLaterTvShows.error)}
          </p>
        ) : watchLaterTvShows.length > 0 ? (
          <TvShowCarousel tvShows={watchLaterTvShows} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_tv_shows")}</p>
        )}
      </section>
    </div>
  );
}
