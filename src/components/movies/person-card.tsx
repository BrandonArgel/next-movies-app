import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type CastMember } from "@/types/credits";

interface PersonCardProps {
  person: CastMember;
  className?: string;
}

export function PersonCard({ person, className }: PersonCardProps) {
  const { id, name, character, profile_path } = person;

  return (
    <Link
      href={`/person/${id}`}
      className={cn("group flex flex-col gap-2", className)}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
        {profile_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w185${profile_path}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-2xl font-medium">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-xs font-semibold line-clamp-1" title={name}>
          {name}
        </p>
        {character && (
          <p
            className="text-xs text-muted-foreground line-clamp-1"
            title={character}
          >
            {character}
          </p>
        )}
      </div>
    </Link>
  );
}
