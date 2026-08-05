import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb";
import { Spinner } from "@/components/ui/spinner";
import { TvDetailHero } from "../_components/tv-detail-hero";
import { MovieBreadcrumb } from "../../movie/_components/movie-breadcrumb";
import { MovieWatchProviders } from "../../movie/_components/movie-watch-providers";
import { MovieCast } from "../../movie/_components/movie-cast";
import { MovieImages } from "../../movie/_components/movie-images";
import { MovieTrailer } from "../../movie/_components/movie-trailer";
import { MovieCarouselSkeleton } from "@/components/movies/movies-carousel";
import { TvRecommendations } from "../_components/tv-recommendations";
import { TvGenresList } from "../_components/tv-genres-list";
import { TvShowSeasons } from "../_components/tv-show-seasons";
import { TvShowReviews } from "../_components/tv-show-reviews";
import { TvProductionCompanies } from "../_components/tv-production-companies";
import { AgeVerificationModal } from "@/components/ui/age-verification-modal";
import { ADULT_CONTENT_COOKIE } from "@/lib/constants";

interface TvPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const response = await tmdb.getTVShowDetails(id);

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

function getCountryCode(locale: string) {
  if (!locale.includes("-")) return "US";
  return locale.split("-")[1].toUpperCase();
}

export default async function TvPage({ params }: TvPageProps) {
  const { id, locale } = await params;
  const cookieStore = await cookies();
  const hasConsented = cookieStore.get(ADULT_CONTENT_COOKIE)?.value === "true";

  const showRes = await tmdb.getTVShowDetails(id);

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
    <main className="flex flex-col min-h-screen bg-background">
      <TvDetailHero show={show} />

      <div className="container mx-auto pb-12 px-4 md:px-8 xl:px-12 max-w-7xl flex flex-col gap-12">
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
    </main>
  );
}
