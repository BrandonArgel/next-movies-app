import { MovieCarousel } from "@/components/movies/movies-carousel";
import { getCollection } from "@/lib/api/collections";

export async function MovieCollection({
  collectionId,
}: {
  collectionId?: number;
}) {
  if (!collectionId) return;

  const collectionRes = await getCollection(collectionId);

  if (!collectionRes.success || !collectionRes.data) {
    return null;
  }

  const collection = collectionRes.data;

  const sortedParts = collection.parts.sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return (
    <section>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-2xl">{collection.name}</h2>
        {collection.overview && (
          <p className="text-muted-foreground text-sm">{collection.overview}</p>
        )}
      </div>

      <div className="mt-4">
        <MovieCarousel movies={sortedParts} />
      </div>
    </section>
  );
}
