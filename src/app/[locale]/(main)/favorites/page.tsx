import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { getFavoriteMovies, getFavoriteTvShows } from "@/lib/api/account";
import { requireUser } from "@/lib/auth-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "components.nav" });
  return { title: t("favorites") };
}

export default async function FavoritesPage() {
  const { user, token } = await requireUser();

  if (!user || !token) {
    redirect("/");
  }

  const t = await getTranslations("pages.favorites");
  const tGlobal = await getTranslations("global.states");
  const tErrors = await getTranslations("errors");

  const [resFavoriteMovies, resFavoriteTvShows] = await Promise.all([
    getFavoriteMovies(user.id, token, 1),
    getFavoriteTvShows(user.id, token, 1),
  ]);

  const favoriteMovies = resFavoriteMovies.success
    ? resFavoriteMovies.data.results
    : [];
  const favoriteTvShows = resFavoriteTvShows.success
    ? resFavoriteTvShows.data.results
    : [];

  return (
    <div className="container mx-auto mt-8 flex max-w-7xl flex-col gap-24 px-4 md:px-8 xl:px-12">
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("movies_title")}</h2>

        {!resFavoriteMovies.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resFavoriteMovies.error)}
          </p>
        ) : favoriteMovies.length > 0 ? (
          <MovieCarousel movies={favoriteMovies} active loop />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_movies")}</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl md:text-2xl">{t("tv_shows_title")}</h2>

        {!resFavoriteTvShows.success ? (
          <p className="text-destructive text-sm">
            {tGlobal("loading_error")} {tErrors(resFavoriteTvShows.error)}
          </p>
        ) : favoriteTvShows.length > 0 ? (
          <TvShowCarousel tvShows={favoriteTvShows} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("no_tv_shows")}</p>
        )}
      </section>
    </div>
  );
}
