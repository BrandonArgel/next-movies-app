"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import { LinkButton } from "../ui/button";

export interface PersonData {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  known_for_department?: string;
}

interface PersonCardProps {
  person: PersonData;
  className?: string;
}

export function PersonCard({ person, className }: PersonCardProps) {
  const { id, name, character, profile_path, known_for_department } = person;

  const tGlobal = useTranslations("global.actions");

  const [isTouchActive, setIsTouchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const subtitle = character || known_for_department;

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
        {profile_path ? (
          <ImageWithSkeleton
            src={`https://image.tmdb.org/t/p/w500${profile_path}`}
            alt={name}
            fill
            containerClassName="w-full h-full"
            className="object-cover transition-transform duration-500 group-focus-within:scale-105 group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="font-medium text-2xl text-muted-foreground">
              {name.charAt(0)}
            </span>
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
          <LinkButton
            href={`/person/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-primary-foreground text-xs shadow-sm"
            aria-label={`${tGlobal("view_details_of")} ${name}`}
          >
            {tGlobal("view_details")}
          </LinkButton>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-e-2 top-2 z-30 transition-opacity duration-300",
          "pointer-events-none opacity-0",
          "group-hover:pointer-events-auto group-hover:opacity-100",
          "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
          isTouchActive && "pointer-events-auto opacity-100",
        )}
      >
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={tGlobal("options_aria_label", { name })}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Abrir menú para:", name);
          }}
        >
          <MoreVerticalIcon className="size-4" />
        </button>
      </div>

      <div className="relative z-20 flex flex-col gap-0.5 px-0.5">
        <h3
          className="line-clamp-1 font-semibold text-sm transition-colors group-focus-within:text-primary group-hover:text-primary"
          title={name}
        >
          {name}
        </h3>

        {subtitle && (
          <span
            className="line-clamp-1 text-muted-foreground text-xs capitalize transition-colors group-focus-within:text-foreground group-hover:text-foreground"
            title={subtitle}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export function PersonCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-2/3 w-full rounded-xl" />
      <div className="flex flex-col gap-1 px-0.5 pt-0.5">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
