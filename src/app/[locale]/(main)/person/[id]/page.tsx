import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PersonHero } from "../_components/person-hero";
import { PersonPhotos } from "../_components/person-photos";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";
import { AgeVerificationModal } from "@/components/ui/age-verification-modal";
import { getPerson } from "@/lib/api/people";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";

interface PersonPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params;

  const response = await getPerson(id);

  if (!response.success) return {};

  const person = response.data;
  const profileImgUrl = getTMDBImageUrl(person.profile_path) ?? "";

  return {
    title: person.name,
    description:
      person.biography?.substring(0, 160) ||
      `Discover the filmography of ${person.name}`,
    openGraph: {
      title: person.name,
      description: person.biography?.substring(0, 160),
      images: [profileImgUrl],
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const t = await getTranslations("domains.person");
  const response = await getPerson(id, [
    "movie_credits",
    "tv_credits",
    "images",
    "tagged_images",
    "external_ids",
  ]);

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
            <h2 className="text-2xl font-bold">{t("castTvShows")}</h2>
            <TvShowCarousel tvShows={tvCastShows} />
          </section>
        )}

        {/* Crew credits (directing / writing / producing) */}
        {crewMovieCredits.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">{t("crew_credits")}</h2>
            <MovieCarousel movies={crewMovieCredits} />
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
