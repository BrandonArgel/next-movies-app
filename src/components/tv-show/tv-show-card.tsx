"use client";

import { StarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import type { TvShow } from "@/types/tv-show";
import { MediaActionsDropdown } from "../layout/media-actions-dropdown";
import { LinkButton } from "../ui/button";

interface ShowCardProps {
  tvShow: TvShow;
  className?: string;
}

export function TVShowCard({ tvShow, className }: ShowCardProps) {
  const { id, first_air_date, name, poster_path, vote_average, overview } =
    tvShow;

  const tGlobal = useTranslations("global.actions");
  const tTv = useTranslations("domains.tv");
  const format = useFormatter();

  const [isTouchActive, setIsTouchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedDate = first_air_date
    ? format.dateTime(new Date(first_air_date), "movieRelease")
    : null;

  useOnClickOutside<HTMLDivElement>(
    cardRef,
    () => setIsTouchActive(false),
    "mousedown",
  );
  useOnClickOutside<HTMLDivElement>(
    cardRef,
    () => setIsTouchActive(false),
    "touchstart",
    { passive: true },
  );

  return (
    <div
      ref={cardRef}
      onClick={() => setIsTouchActive((prev) => !prev)}
      className={cn(
        "group relative flex cursor-pointer select-none flex-col gap-2 rounded-lg md:cursor-default",
        className,
      )}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
        {poster_path ? (
          <ImageWithSkeleton
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={name}
            fill
            containerClassName="w-full h-full"
            className="object-cover transition-transform duration-500 group-focus-within:scale-105 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="px-2 text-center text-muted-foreground text-xs">
              {name}
            </span>
          </div>
        )}

        {vote_average > 0 && (
          <div className="absolute inset-s-2 top-2 z-20 flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-0.5 font-semibold text-xs text-yellow-400">
            <StarIcon className="size-3 fill-current" aria-hidden="true" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
        )}

        <div
          className={cn(
            "absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/60 to-transparent p-3 transition-all duration-300",
            "pointer-events-none translate-y-4 opacity-0",
            "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
            "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100",
            isTouchActive && "pointer-events-auto translate-y-0 opacity-100",
          )}
        >
          <p className="mb-3 line-clamp-3 text-balance text-white/90 text-xs">
            {overview || tTv("fallback_overview")}
          </p>
          <LinkButton
            href={`/tv/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-primary-foreground text-xs shadow-sm"
            aria-label={`${tGlobal("view_details_of")} ${name} ${formattedDate ? formattedDate : ""}`}
          >
            {tGlobal("view_details")}
          </LinkButton>
        </div>
      </div>

      {/* Menú de acciones sustituido */}
      <MediaActionsDropdown
        mediaId={id}
        mediaTitle={name}
        mediaType="tv"
        isTouchActive={isTouchActive}
        onOpenChange={setIsTouchActive}
      />

      <div className="relative z-20 flex flex-col gap-0.5 px-0.5">
        <h3
          className="line-clamp-1 font-semibold text-sm transition-colors group-focus-within:text-primary group-hover:text-primary"
          title={name}
        >
          {name}
        </h3>

        {formattedDate && (
          <span className="text-muted-foreground text-xs capitalize transition-colors group-focus-within:text-foreground group-hover:text-foreground">
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
      <Skeleton className="aspect-2/3 w-full rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/5 rounded" />
      </div>
    </div>
  );
}
