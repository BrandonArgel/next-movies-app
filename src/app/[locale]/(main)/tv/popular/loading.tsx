import { TVShowCardSkeleton } from "@/components/tv-show/tv-show-card";

export default function PopularTvShowsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-8 xl:px-12">
      {/* Header Skeleton */}
      <div className="h-10 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-5 w-96 animate-pulse rounded bg-muted" />

      {/* Filters Skeleton */}
      <div className="my-8 h-32 w-full animate-pulse rounded-xl border bg-muted/50" />

      {/* Grid Skeleton */}
      <div className="mt-8">
        <TVShowCardSkeleton />
      </div>
    </div>
  );
}
