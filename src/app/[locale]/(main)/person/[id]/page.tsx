import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { AgeVerificationModal } from "@/components/auth/age-verification-modal";
import { MovieCarousel } from "@/components/movies/movies-carousel";
import { TvShowCarousel } from "@/components/tv-show/tv-show-carousel";
import { getPerson } from "@/lib/api/people";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { PersonHero } from "../_components/person-hero";
import { PersonPhotos } from "../_components/person-photos";

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

  const format = await getFormatter();
  const t = await getTranslations("domains.person");
  const tJobs = await getTranslations("tmdb.jobs");
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

  const rawCrewCredits =
    person.movie_credits?.crew.filter((c) => c.poster_path && c.job) || [];

  // 1. Agrupar los trabajos en un arreglo temporal por película
  const groupedCrewMap = rawCrewCredits.reduce((map, current) => {
    const translatedJob = tJobs.has(current.job as any)
      ? tJobs(current.job as any)
      : current.job;

    if (map.has(current.id)) {
      const existing = map.get(current.id);
      // Evitar trabajos duplicados idénticos para la misma película
      if (!existing.jobsArray.includes(translatedJob)) {
        existing.jobsArray.push(translatedJob);
      }
    } else {
      map.set(current.id, { ...current, jobsArray: [translatedJob] });
    }
    return map;
  }, new Map());

  // 2. Mapear el resultado para aplicar format.list
  const deduplicatedCrew = Array.from(groupedCrewMap.values()).map(
    (movie: any) => ({
      ...movie,
      job: format.list(movie.jobsArray, { type: "conjunction" }),
    }),
  );

  // 3. Ordenar y cortar
  const crewMovieCredits = deduplicatedCrew
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PersonHero person={person} />

      <div className="container mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 md:px-8 xl:px-12">
        {/* Acting — movies */}
        {movieCredits.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl">{t("castMovies")}</h2>
            <MovieCarousel movies={movieCredits} active />
          </section>
        )}

        {/* Acting — TV shows */}
        {tvCastShows.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl">{t("castTvShows")}</h2>
            <TvShowCarousel tvShows={tvCastShows} />
          </section>
        )}

        {/* Crew credits (directing / writing / producing) */}
        {crewMovieCredits.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl">{t("crew_credits")}</h2>
            <MovieCarousel movies={crewMovieCredits} />
          </section>
        )}

        {/* Photo gallery */}
        {person.images?.profiles && person.images.profiles.length > 0 && (
          <PersonPhotos photos={person.images.profiles} name={person.name} />
        )}
      </div>
    </div>
  );
}
