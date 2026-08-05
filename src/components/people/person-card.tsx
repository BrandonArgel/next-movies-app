import { MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
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

  const tCommon = useTranslations("common");
  const tPerson = useTranslations("person");

  const subtitle = character || known_for_department;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg select-none",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-2/3">
        {profile_path ? (
          <ImageWithSkeleton
            src={`https://image.tmdb.org/t/p/w500${profile_path}`}
            alt={name}
            fill
            containerClassName="w-full h-full"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-2xl font-medium">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Hover Layer with Overview and Button */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/60 to-transparent p-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <LinkButton
            href={`/person/${id}`}
            className="text-xs font-semibold text-primary-foreground shadow-sm"
            aria-label={`${tCommon("view_details_of")} ${name}`}
          >
            {tCommon("view_details")}
          </LinkButton>
        </div>
      </div>

      {/* Options Menu Button */}
      <div className="absolute top-2 inset-e-2 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={tPerson("options_aria_label", { name })}
          onClick={(e) => {
            console.log("Abrir menú para:", name);
          }}
        >
          <MoreVerticalIcon className="size-4" />
        </button>
      </div>

      {/* Accessible Link and Metadata */}
      <div className="relative z-20 flex flex-col gap-0.5 px-0.5">
        <h3
          className="font-semibold text-sm line-clamp-1 transition-colors group-hover:text-primary group-focus-within:text-primary"
          title={name}
        >
          {name}
        </h3>

        {subtitle && (
          <span
            className="text-xs text-muted-foreground capitalize transition-colors group-hover:text-foreground group-focus-within:text-foreground line-clamp-1"
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
      <Skeleton className="w-full aspect-2/3 rounded-xl" />
      <div className="flex flex-col gap-1 px-0.5 pt-0.5">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
