import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";
import { AgeVerificationModal } from "@/components/auth/age-verification-modal";
import { Spinner } from "@/components/ui/spinner";
import { getAgeRating } from "@/lib/age-rating";
import { getMovie } from "@/lib/api/movies";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { GenresList } from "../_components/genres-list";
import { MovieAwards } from "../_components/movie-awards";
import { MovieBreadcrumb } from "../_components/movie-breadcrumb";
import { MovieCast } from "../_components/movie-cast";
import { MovieCollection } from "../_components/movie-collection";
import { MovieDetailHero } from "../_components/movie-detail-hero";
import { MovieImages } from "../_components/movie-images";
import { MovieRecommendations } from "../_components/movie-recommendations";
import { MovieReviews } from "../_components/movie-reviews";
import { MovieTrailer } from "../_components/movie-trailer";
import { MovieWatchProviders } from "../_components/movie-watch-providers";

interface MoviePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;

  const response = await getMovie(id);

  if (!response.success) return {};

  const movie = response.data;
  const backdropUlr = getTMDBImageUrl(movie.backdrop_path, "w300") ?? "";

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [backdropUlr],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id, locale } = await params;
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const movieRes = await getMovie(id, [
    "videos",
    "images",
    "credits",
    "watch/providers",
    "reviews",
    "release_dates",
  ]);

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
      <div className="container mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 md:px-8 xl:px-12">
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
