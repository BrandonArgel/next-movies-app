import { useTranslations } from "next-intl";
import type { VideoResult } from "@/types/media";
import { TrailerIframe } from "./trailer-iframe";

interface MovieTrailerProps {
  videos: VideoResult[];
}

export function MovieTrailer({ videos }: MovieTrailerProps) {
  const t = useTranslations("domains.movie");

  if (!videos || videos.length === 0) return;

  const trailer =
    videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official,
    ) ??
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
    videos.find((v) => v.site === "YouTube");

  return (
    <section aria-labelledby="trailer-heading" className="flex flex-col gap-4">
      <h2 id="trailer-heading" className="font-bold text-xl md:text-2xl">
        {t("trailer")}
      </h2>

      {trailer ? (
        <TrailerIframe trailerKey={trailer.key} title={trailer.name} />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-muted-foreground text-sm">
          {t("noTrailer")}
        </div>
      )}
    </section>
  );
}
