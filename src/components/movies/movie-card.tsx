import Image from "next/image";
import { useTranslations } from "next-intl";
import { StarIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type Movie } from "@/types/movies";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const t = useTranslations("movie");
  const { id, poster_path, title, vote_average, release_date } = movie;

  const year = release_date ? release_date.substring(0, 4) : null;

  return (
    <Link
      href={`/movie/${id}`}
      className={cn(
        "group flex flex-col gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
        className,
      )}
      aria-label={`${title}${year ? ` (${year})` : ""}`}
    >
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-2/3">
        {poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs text-center px-2">
              {title}
            </span>
          </div>
        )}

        {vote_average > 0 && (
          <div
            className="absolute top-2 inset-s-2 flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-yellow-400"
            aria-label={`${t("score")}: ${vote_average.toFixed(1)}`}
          >
            <StarIcon className="size-3 fill-current" aria-hidden="true" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <h3
          className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors"
          title={title}
        >
          {title}
        </h3>
        {year && <span className="text-xs text-muted-foreground">{year}</span>}
      </div>
    </Link>
  );
}
