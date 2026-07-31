import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb";
import { MovieDetailHero } from "./_components/movie-detail-hero";
import { MovieBreadcrumb } from "./_components/movie-breadcrumb";
import { MovieCast } from "./_components/movie-cast";
import { MovieTrailer } from "./_components/movie-trailer";
import { MovieRelated } from "./_components/movie-related";

interface MoviePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await tmdb.getMovieDetails(id).catch(() => null);
  if (!movie) return {};

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
        : [],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  const movie = await tmdb.getMovieDetails(id).catch(() => null);

  if (!movie) {
    notFound();
  }

  const t = await getTranslations("movie");

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <MovieDetailHero movie={movie} />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl flex flex-col gap-12">
        {/* Breadcrumb */}
        <MovieBreadcrumb movieTitle={movie.title} />

        {/* Cast */}
        <MovieCast cast={movie.credits.cast} />

        {/* Trailer */}
        <MovieTrailer videos={movie.videos.results} />

        {/* Related */}
        <MovieRelated movies={movie.similar.results} />
      </div>
    </main>
  );
}
