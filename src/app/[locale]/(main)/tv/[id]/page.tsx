import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AgeVerificationModal } from "@/components/auth/age-verification-modal";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";
import { Spinner } from "@/components/ui/spinner";
import { getTvShow } from "@/lib/api/tv-shows";
import { requireUser } from "@/lib/auth-utils";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { MovieBreadcrumb } from "../../movie/_components/movie-breadcrumb";
import { MovieCast } from "../../movie/_components/movie-cast";
import { MovieImages } from "../../movie/_components/movie-images";
import { MovieTrailer } from "../../movie/_components/movie-trailer";
import { MovieWatchProviders } from "../../movie/_components/movie-watch-providers";
import { TvDetailHero } from "../_components/tv-detail-hero";
import { TvGenresList } from "../_components/tv-genres-list";
import { TvProductionCompanies } from "../_components/tv-production-companies";
import { TvRecommendations } from "../_components/tv-recommendations";
import { TvShowReviews } from "../_components/tv-show-reviews";
import { TvShowSeasons } from "../_components/tv-show-seasons";

interface TvPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const response = await getTvShow(id);

  if (!response.success) return {};

  const show = response.data;
  const backdropUlr = getTMDBImageUrl(show.backdrop_path, "w300") ?? "";

  return {
    title: show.name,
    description: show.overview,
    openGraph: {
      title: show.name,
      description: show.overview,
      images: [backdropUlr],
    },
  };
}

function getCountryCode(locale: string) {
  if (!locale.includes("-")) return "US";
  return locale.split("-")[1].toUpperCase();
}

export default async function TvPage({ params }: TvPageProps) {
  const { id, locale } = await params;
  const { user, token } = await requireUser();
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const showRes = await getTvShow(id, [
    "videos",
    "images",
    "credits",
    "watch/providers",
    "reviews",
  ]);

  if (!showRes.success) {
    if (showRes.error === "not_found") notFound();
    throw new Error(showRes.error);
  }

  const show = showRes.data;

  if (show.adult && !hasConsented) {
    return <AgeVerificationModal />;
  }

  const countryCode = getCountryCode(locale);
  const providers = show["watch/providers"]?.results[countryCode];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TvDetailHero show={show} userId={user?.id} token={token} />

      <div className="container mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 md:px-8 xl:px-12">
        <MovieBreadcrumb movieTitle={show.name} />
        <MovieWatchProviders providers={providers} />
        <MovieCast cast={show.credits.cast} />
        <TvShowSeasons seasons={show.seasons} showName={show.name} />
        <MovieTrailer videos={show.videos.results} />
        <MovieImages images={show.images.backdrops} />
        <TvShowReviews reviews={show.reviews?.results ?? []} />
        <TvProductionCompanies companies={show.production_companies} />

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <TvRecommendations showId={Number(id)} />
        </Suspense>

        <Suspense fallback={<Spinner />}>
          <TvGenresList />
        </Suspense>
      </div>
    </div>
  );
}

interface UserScoreChartProps {
  voteAverage: number;
}

function _UserScoreChart({ voteAverage }: UserScoreChartProps) {
  const percentage = Math.round(voteAverage * 10);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass =
    percentage >= 70
      ? "text-green-500"
      : percentage >= 40
        ? "text-yellow-500"
        : "text-red-500";

  const trackColorClass =
    percentage >= 70
      ? "text-green-900"
      : percentage >= 40
        ? "text-yellow-900"
        : "text-red-900";

  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-900">
      <svg className="-rotate-90 h-full w-full transform" viewBox="0 0 50 50">
        {/* Background Track */}
        <circle
          className={`${trackColorClass} stroke-current`}
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        {/* Progress Ring */}
        <circle
          className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
      </svg>
      {/* Percentage Text */}
      <div className="absolute mt-0.5 flex items-start justify-center font-bold text-sm text-white">
        {percentage}
        <span className="mt-0.5 font-normal text-[8px]">%</span>
      </div>
    </div>
  );
}
