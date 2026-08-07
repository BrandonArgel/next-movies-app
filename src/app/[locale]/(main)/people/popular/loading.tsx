import { PeopleGridSkeleton } from "@/components/people/people-grid-skeleton";

export default function PopularPeopleLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
      <div className="h-10 w-64 rounded bg-muted animate-pulse" />
      <div className="mt-2 h-5 w-96 rounded bg-muted animate-pulse" />

      <div className="mt-8">
        <PeopleGridSkeleton />
      </div>
    </div>
  );
}
