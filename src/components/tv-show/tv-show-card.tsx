import { StarIcon, MoreVerticalIcon } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { LinkButton } from "../ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type TVShow } from "@/types/tv-show";

interface ShowCardProps {
  tvShow: TVShow;
  className?: string;
}

export function TVShowCard({ tvShow, className }: ShowCardProps) {
  const { id, first_air_date, name, poster_path, vote_average, overview } =
    tvShow;

  const tCommon = useTranslations("common");
  const tTv = useTranslations("tv");
  const format = useFormatter();

  const formattedDate = first_air_date
    ? format.dateTime(new Date(first_air_date), "movieRelease")
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg select-none",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-2/3">
        {poster_path ? (
          <ImageWithSkeleton
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={name}
            fill
            containerClassName="w-full h-full"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs text-center px-2">
              {name}
            </span>
          </div>
        )}

        {vote_average > 0 && (
          <div className="absolute top-2 inset-s-2 z-20 flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-yellow-400">
            <StarIcon className="size-3 fill-current" aria-hidden="true" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Layer with Overview and Button */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/60 to-transparent p-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <p className="text-white/90 text-xs line-clamp-3 mb-3 text-balance">
            {overview || tTv("fallback_overview")}
          </p>
          <LinkButton
            href={`/tv-show/${id}`}
            className="text-xs font-semibold text-primary-foreground shadow-sm"
            aria-label={`${tCommon("view_details_of")} ${name} ${formattedDate ? formattedDate : ""}`}
          >
            {tCommon("view_details")}
          </LinkButton>
        </div>
      </div>

      {/* Options Button */}
      <div className="absolute top-2 inset-e-2 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={tTv("options_aria_label", { name })}
          onClick={(e) => {
            console.log("Abrir menú para:", name);
          }}
        >
          <MoreVerticalIcon className="size-4" />
        </button>
      </div>

      <div className="relative z-20 flex flex-col gap-0.5 px-0.5">
        <h3
          className="font-semibold text-sm line-clamp-1 transition-colors group-hover:text-primary group-focus-within:text-primary"
          title={name}
        >
          {name}
        </h3>

        {formattedDate && (
          <span className="text-xs text-muted-foreground capitalize transition-colors group-hover:text-foreground group-focus-within:text-foreground">
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
}

export function TVShowCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-2/3 rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/5 rounded" />
      </div>
    </div>
  );
}
