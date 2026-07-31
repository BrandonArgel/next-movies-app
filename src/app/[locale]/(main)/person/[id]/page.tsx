import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb";
import { PersonHero } from "../_components/person-hero";
import { MovieCarousel } from "@/components/movies/movies-carousel";

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
      `Descubre las películas de ${person.name}`,
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
  const t = await getTranslations("person");
  const response = await tmdb.getPersonDetails(id);

  if (!response.success) {
    if (response.error === "notFound") notFound();
    throw new Error(response.error);
  }

  const person = response.data;

  const castMovies =
    person.movie_credits?.cast
      ?.filter((movie) => movie.poster_path)
      ?.sort((a, b) => b.popularity - a.popularity) || [];

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <PersonHero person={person} />

      {castMovies.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t("castMovies")}
          </h2>
          <MovieCarousel movies={castMovies} />
        </section>
      )}
    </main>
  );
}
