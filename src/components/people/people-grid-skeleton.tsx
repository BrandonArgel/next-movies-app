import { PersonCardSkeleton } from "./person-card";

const SKELETON_KEYS = Array.from({ length: 20 }, () => crypto.randomUUID());

export function PeopleGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {SKELETON_KEYS.map((id) => (
        <PersonCardSkeleton key={id} />
      ))}
    </div>
  );
}
