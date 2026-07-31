import { tmdb } from "@/lib/tmdb";
import { getTranslations } from "next-intl/server";
import MovieHero from "./_components/movie-hero";
import TrendingMoviesSection from "./_components/trending-movies-section";
import TrendingShowsSection from "./_components/trending-shows-section";
import TrendingPeopleSection from "./_components/trending-people-section copy";

export default async function MoviesPage() {
  const t = await getTranslations("home");
  const tErrors = await getTranslations("errors");

  const [moviesResult, showsResult, peopleResult] = await Promise.all([
    tmdb.getTrendingMovies("day"),
    tmdb.getTrendingShows("day"),
    tmdb.getTrendingPeople("day"),
  ]);

  let heroElement = (
    <div className="h-100 flex items-center justify-center bg-muted/20">
      <p className="text-sm text-muted-foreground">{t("errorHero")}</p>
    </div>
  );

  if (moviesResult.success && moviesResult.data.results.length > 0) {
    const [basicHeroMovie] = moviesResult.data.results;
    const heroDetailsResult = await tmdb.getMovieDetails(basicHeroMovie.id);

    if (heroDetailsResult.success) {
      heroElement = <MovieHero movie={heroDetailsResult.data} />;
    }
  }

  return (
    <main className="flex flex-col w-full pb-20 bg-background space-y-12">
      {heroElement}

      {!moviesResult.success ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>
            {t("errorMovies")}
            {tErrors(moviesResult.error) || tErrors("default")}
          </p>
        </div>
      ) : moviesResult.data.results.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t("noMovies")}
        </div>
      ) : (
        <TrendingMoviesSection initialMovies={moviesResult.data.results} />
      )}

      {!showsResult.success ? (
        <div className="p-8 text-center text-red-500/80">
          <p>
            {t("errorShows")}
            {tErrors(showsResult.error) || tErrors("default")}
          </p>
        </div>
      ) : showsResult.data.results.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t("noShows")}
        </div>
      ) : (
        <TrendingShowsSection initialShows={showsResult.data.results} />
      )}

      {!peopleResult.success ? (
        <div className="p-8 text-center text-red-500/80">
          <p>
            {t("errorShows")}
            {tErrors(peopleResult.error) || tErrors("default")}
          </p>
        </div>
      ) : peopleResult.data.results.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t("noPeople")}
        </div>
      ) : (
        <TrendingPeopleSection initialPeople={peopleResult.data.results} />
      )}
    </main>
  );
}
