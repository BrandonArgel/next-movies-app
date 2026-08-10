import { UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import type { Profile } from "@/types/person";

interface PersonPhotosProps {
  photos: Profile[];
  name: string;
}

export async function PersonPhotos({ photos, name }: PersonPhotosProps) {
  if (!photos || photos.length === 0) return null;

  const t = await getTranslations("domains.person");
  const displayPhotos = photos.slice(0, 8);

  return (
    <section
      aria-labelledby="person-photos-heading"
      className="flex flex-col gap-6"
    >
      <h2 id="person-photos-heading" className="font-bold text-xl md:text-2xl">
        {t("photos")}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.file_path}
            className="group relative aspect-2/3 overflow-hidden rounded-xl bg-muted shadow-md ring-1 ring-border transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-primary/40"
          >
            {photo.file_path ? (
              <ImageWithSkeleton
                src={`https://image.tmdb.org/t/p/w300${photo.file_path}`}
                alt={`${name} — photo ${index + 1}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserRound className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
