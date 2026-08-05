import { useTranslations } from "next-intl";
import { type VideoResult } from "@/types/media";
import { TrailerIframe } from "./trailer-iframe"; // Importamos el cliente

interface MovieTrailerProps {
  videos: VideoResult[];
}

export function MovieTrailer({ videos }: MovieTrailerProps) {
  if (!videos || videos.length === 0) return;

  const t = useTranslations("movie");

  const trailer =
    videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official,
    ) ??
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
    videos.find((v) => v.site === "YouTube");

  return (
    <section aria-labelledby="trailer-heading" className="flex flex-col gap-4">
      <h2 id="trailer-heading" className="text-xl md:text-2xl font-bold">
        {t("trailer")}
      </h2>

      {trailer ? (
        <TrailerIframe trailerKey={trailer.key} title={trailer.name} />
      ) : (
        <div className="flex items-center justify-center w-full aspect-video rounded-xl bg-muted text-muted-foreground text-sm">
          {t("noTrailer")}
        </div>
      )}
    </section>
  );
}
