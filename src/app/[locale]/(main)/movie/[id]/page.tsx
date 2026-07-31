import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb";
import { MovieDetailHero } from "../_components/movie-detail-hero";
import { MovieBreadcrumb } from "../_components/movie-breadcrumb";
import { MovieCast } from "../_components/movie-cast";
import { MovieTrailer } from "../_components/movie-trailer";
import { MovieRecommendations } from "../_components/movie-recommendations";

interface MoviePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;

  // Consumimos el nuevo Result
  const response = await tmdb.getMovieDetails(id);

  if (!response.success) return {};

  const movie = response.data;

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

  // 1. Ejecutamos ambas peticiones concurrentemente
  const [movieRes, relatedRes] = await Promise.all([
    tmdb.getMovieDetails(id),
    // Puedes cambiar a tmdb.getSimilarMovies(id) si prefieres la versión original
    tmdb.getMovieRecommendations(id),
  ]);

  if (!movieRes.success) {
    if (movieRes.error === "notFound") notFound();
    throw new Error(movieRes.error);
  }

  const movie = movieRes.data;

  // 2. Extraemos los resultados de la segunda petición (con fallback a un array vacío si falla)
  const relatedMovies = relatedRes.success ? relatedRes.data.results : [];

  const t = await getTranslations("movie");

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <MovieDetailHero movie={movie} />

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl flex flex-col gap-12">
        <MovieBreadcrumb movieTitle={movie.title} />

        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <MovieCast cast={movie.credits.cast} />
        )}

        {movie.videos?.results && movie.videos.results.length > 0 && (
          <MovieTrailer videos={movie.videos.results} />
        )}

        {/* 3. Pasamos el nuevo arreglo separado al componente */}
        {relatedMovies.length > 0 && (
          <MovieRecommendations movies={relatedMovies} />
        )}
      </div>
    </main>
  );
}
