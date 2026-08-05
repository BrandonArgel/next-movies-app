import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { PersonHero } from "../_components/person-hero";
import { PersonPhotos } from "../_components/person-photos";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TVShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";
import { AgeVerificationModal } from "@/components/ui/age-verification-modal";
import { type TVShow } from "@/types/tv-show";

interface PersonPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params;

  const response = await tmdb.getPersonDetails(id);

  if (!response.success) return {};

  const person = response.data;

  return {
    title: person.name,
    description:
      person.biography?.substring(0, 160) ||
      `Discover the filmography of ${person.name}`,
    openGraph: {
      title: person.name,
      description: person.biography?.substring(0, 160),
      images: person.profile_path
        ? [`https://image.tmdb.org/t/p/w500${person.profile_path}`]
        : [],
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const t = await getTranslations("person");
  const response = await tmdb.getPersonDetails(id);

  if (!response.success) {
    if (response.error === "not_found") notFound();
    throw new Error(response.error);
  }

  const person = response.data;

  if (person.adult && !hasConsented) {
    return <AgeVerificationModal />;
  }

  const movieCredits =
    person.movie_credits?.cast
      .filter((movie) => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity) || [];

  const tvCastShows = [
    ...new Map(person.tv_credits.cast.map((c) => [c.id, c])).values(),
  ];

  const crewMovieCredits =
    person.movie_credits?.crew
      .filter((c) => c.poster_path && c.job)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20) ?? [];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <PersonHero person={person} />

      <div className="container mx-auto pb-12 px-4 md:px-8 xl:px-12 max-w-7xl flex flex-col gap-12">
        {/* Acting — movies */}
        {movieCredits.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">{t("castMovies")}</h2>
            <MovieCarousel movies={movieCredits} active />
          </section>
        )}

        {/* Acting — TV shows */}
        {tvCastShows.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">{t("tv_credits")}</h2>
            <TVShowCarousel
              tvShows={tvCastShows as unknown as TVShow[]}
              active
            />
          </section>
        )}

        {/* Crew credits (directing / writing / producing) */}
        {crewMovieCredits.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">{t("crew_credits")}</h2>
            <MovieCarousel movies={crewMovieCredits} active />
          </section>
        )}

        {/* Photo gallery */}
        {person.images?.profiles && person.images.profiles.length > 0 && (
          <PersonPhotos photos={person.images.profiles} name={person.name} />
        )}
      </div>
    </main>
  );
}
