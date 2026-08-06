import { MovieGridSkeleton } from "@/components/movies/movie-grid-skeleton";

export default function PopularMoviesLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
      {/* Header Skeleton */}
      <div className="h-10 w-64 rounded bg-muted animate-pulse" />
      <div className="mt-2 h-5 w-96 rounded bg-muted animate-pulse" />

      {/* Filters Skeleton */}
      <div className="my-8 h-32 w-full rounded-xl border bg-muted/50 animate-pulse" />

      {/* Grid Skeleton */}
      <div className="mt-8">
        <MovieGridSkeleton />
      </div>
    </div>
  );
}
