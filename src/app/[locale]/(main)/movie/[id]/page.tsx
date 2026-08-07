import { type Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { tmdb } from "@/lib/tmdb";
import { Spinner } from "@/components/ui/spinner";
import { MovieDetailHero } from "../_components/movie-detail-hero";
import { MovieBreadcrumb } from "../_components/movie-breadcrumb";
import { MovieWatchProviders } from "../_components/movie-watch-providers";
import { MovieCast } from "../_components/movie-cast";
import { MovieImages } from "../_components/movie-images";
import { MovieTrailer } from "../_components/movie-trailer";
import { MovieReviews } from "../_components/movie-reviews";
import { MovieRecommendations } from "../_components/movie-recommendations";
import { MovieCollection } from "../_components/movie-collection";
import { MovieAwards } from "../_components/movie-awards";
import { GenresList } from "../_components/genres-list";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";
import { AgeVerificationModal } from "@/components/ui/age-verification-modal";
import { getAgeRating } from "@/lib/age-rating";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";

interface MoviePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;

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
  const { id, locale } = await params;
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const movieRes = await tmdb.getMovieDetails(id);

  if (!movieRes.success) {
    if (movieRes.error === "not_found") notFound();
    throw new Error(movieRes.error);
  }

  const movie = movieRes.data;

  if (movie.adult && !hasConsented) {
    return <AgeVerificationModal />;
  }

  const countryCode = locale.includes("-")
    ? locale.split("-")[1].toUpperCase()
    : "US";
  const ageRating = getAgeRating(movie.release_dates?.results, countryCode);
  const providers = movie["watch/providers"]?.results[countryCode];

  return (
    <>
      <MovieDetailHero movie={movie} ageRating={ageRating} />
      <div className="container mx-auto pb-12 px-4 md:px-8 xl:px-12 max-w-7xl flex flex-col gap-12">
        <MovieBreadcrumb movieTitle={movie.title} />
        <MovieAwards imdbId={movie.imdb_id} />
        <MovieWatchProviders providers={providers} />
        <MovieCast cast={movie.credits.cast} />
        <MovieCollection collectionId={movie.belongs_to_collection?.id} />
        <MovieTrailer videos={movie.videos.results} />
        <MovieImages images={movie.images.backdrops} />
        <MovieReviews reviews={movie.reviews.results} />
        <Suspense fallback={<MovieCarouselSkeleton />}>
          <MovieRecommendations movieId={Number(id)} />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <GenresList />
        </Suspense>
      </div>
    </>
  );
}
