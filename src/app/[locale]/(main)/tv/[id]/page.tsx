import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb";
import { TvDetailHero } from "../_components/tv-detail-hero";
import { MovieBreadcrumb } from "../../movie/_components/movie-breadcrumb";
import { MovieCast } from "../../movie/_components/movie-cast";
import { MovieTrailer } from "../../movie/_components/movie-trailer";
import { MovieRecommendations } from "../../movie/_components/movie-recommendations";

interface TvPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const response = await tmdb.getShowDetails(id);

  if (!response.success) return {};

  const show = response.data;

  return {
    title: show.name,
    description: show.overview,
    openGraph: {
      title: show.name,
      description: show.overview,
      images: show.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`]
        : [],
    },
  };
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;

  // 1. Ejecutamos ambas peticiones en paralelo
  const [showRes, relatedRes] = await Promise.all([
    tmdb.getShowDetails(id),
    tmdb.getShowRecommendations(id),
  ]);

  // Manejo de errores
  if (!showRes.success) {
    if (showRes.error === "notFound") notFound();
    throw new Error(showRes.error);
  }

  const show = showRes.data;
  const relatedShows = relatedRes.success ? relatedRes.data.results : [];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <TvDetailHero show={show} />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl flex flex-col gap-12">
        <MovieBreadcrumb movieTitle={show.name} />

        {show.credits?.cast && show.credits.cast.length > 0 && (
          <MovieCast cast={show.credits.cast} />
        )}

        {show.videos?.results && show.videos.results.length > 0 && (
          <MovieTrailer videos={show.videos.results} />
        )}

        {relatedShows.length > 0 && (
          <MovieRecommendations movies={relatedShows as any} />
        )}
      </div>
    </main>
  );
}
