import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type Show } from "@/types/show";

interface ShowCardProps {
  show: Show;
  className?: string;
}

export function ShowCard({ show, className }: ShowCardProps) {
  const { id, name, poster_path, vote_average } = show;

  return (
    <Link
      href={`/tv/${id}`}
      className={cn("group flex flex-col gap-2", className)}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
        {poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${poster_path}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted p-4 text-center">
            <span className="text-muted-foreground text-lg font-medium">
              {name}
            </span>
          </div>
        )}

        {/* Insignia de calificación estilo TMDB/Max */}
        {vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white backdrop-blur-md">
            {vote_average.toFixed(1)}
            <span className="text-yellow-500">★</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-sm font-semibold line-clamp-1" title={name}>
          {name}
        </p>
      </div>
    </Link>
  );
}
