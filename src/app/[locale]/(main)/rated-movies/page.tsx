import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import {
  getAccountDetails,
  getRatedMovies,
  getRatedTvShows,
} from "@/lib/api/account";
import { TMDB_SESSION_ID_COOKIE } from "@/lib/constants";

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TMDB_SESSION_ID_COOKIE)?.value;

  if (!token) {
    redirect("/");
  }

  const accountRes = await getAccountDetails(token);

  if (!accountRes.success && accountRes.error === "unauthorized") {
    redirect("/");
  }

  const t = await getTranslations("pages.rated");
  const tGlobal = await getTranslations("global.states");
  const tErrors = await getTranslations("errors");

  if (!accountRes.success || !accountRes.data) {
    return (
      <div className="w-full mx-auto max-w-7xl mt-8 px-4">
        <p className="text-destructive font-medium">
          {tGlobal("loading_error")} {tGlobal("try_again")}
        </p>
      </div>
    );
  }

  const user = accountRes.data;

  const [resRatedMovies, resRatedTvShows] = await Promise.all([
    getRatedMovies(user?.id, token, 1),
    getRatedTvShows(user?.id, token, 1),
  ]);

  const ratedMovies = resRatedMovies.success ? resRatedMovies.data.results : [];
  const ratedTvShows = resRatedTvShows.success
    ? resRatedTvShows.data.results
    : [];

  return (
    <div className="flex flex-col gap-12 w-full mx-auto max-w-7xl mt-8 px-4">
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
