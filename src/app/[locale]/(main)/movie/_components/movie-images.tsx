import { useTranslations } from "next-intl";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

interface MovieImagesProps {
  images: { file_path: string }[];
}

export function MovieImages({ images }: MovieImagesProps) {
  if (!images || images.length === 0) return;

  const t = useTranslations("domains.movie");
  const displayImages = images.slice(0, 6);

  if (displayImages.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{t("gallery")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((image, index) => (
          <ImageWithSkeleton
            key={image.file_path}
            src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
            alt={`Gallery image ${index + 1}`}
            fill
            containerClassName="aspect-video rounded-xl shadow-sm"
            className="object-cover hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ))}
      </div>
    </section>
  );
}
