import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { getRatedMovies, getRatedTvShows } from "@/lib/api/account";
import { requireUser } from "@/lib/auth-utils";

export default async function FavoritesPage() {
  const { user, token } = await requireUser();

  if (!user || !token) {
    redirect("/");
  }

  const t = await getTranslations("pages.rated");
  const tGlobal = await getTranslations("global.states");
  const tErrors = await getTranslations("errors");

  const [resRatedMovies, resRatedTvShows] = await Promise.all([
    getRatedMovies(user?.id, token, 1),
    getRatedTvShows(user?.id, token, 1),
  ]);

  const ratedMovies = resRatedMovies.success ? resRatedMovies.data.results : [];
  const ratedTvShows = resRatedTvShows.success
    ? resRatedTvShows.data.results
    : [];

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-24 mt-8 px-4 md:px-8 xl:px-12">
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("movies_title")}</h2>

        {!resRatedMovies.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resRatedMovies.error)}
          </p>
        ) : ratedMovies.length > 0 ? (
          <MovieCarousel movies={ratedMovies} active loop />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_movies")}</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("tv_shows_title")}</h2>

        {!resRatedTvShows.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resRatedTvShows.error)}
          </p>
        ) : ratedTvShows.length > 0 ? (
          <TvShowCarousel tvShows={ratedTvShows} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_tv_shows")}</p>
        )}
      </section>
    </div>
  );
}
