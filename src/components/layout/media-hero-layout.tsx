import { ExternalLink, Star } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Link } from "@/i18n/navigation";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

interface MediaHeroLayoutProps {
  title: string;
  backdropUrl: string | null;
  posterUrl: string | null;
  logoUrl: string | null;
  rating: string | null;
  tagline?: string;
  overview?: string;
  homepage?: string;
  genres?: { id: number; name: string }[];
  genreBasePath: "movie" | "tv";
  metaBadges: ReactNode;
  userActions?: ReactNode;
  stats: Stat[];
  officialWebsiteLabel: string;
}

export function MediaHeroLayout({
  title,
  backdropUrl,
  posterUrl,
  logoUrl,
  rating,
  tagline,
  overview,
  homepage,
  genres,
  genreBasePath,
  metaBadges,
  userActions,
  stats,
  officialWebsiteLabel,
}: MediaHeroLayoutProps) {
  return (
    <section
      className="relative flex min-h-[70vh] w-full items-end bg-black md:items-center"
      aria-label={title}
    >
      {backdropUrl && (
        <ImageWithSkeleton
          src={backdropUrl}
          alt=""
          fill
          aria-hidden="true"
          containerClassName="absolute inset-0 z-0"
          className="object-cover object-top md:object-center"
        />
      )}

      <div className="absolute inset-0 z-10 bg-linear-to-r from-black/95 via-black/70 to-black/20 md:via-black/60 md:to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-transparent" />

      <div className="container relative z-20 mx-auto flex max-w-6xl flex-col items-start gap-8 p-4 pb-10 md:flex-row md:px-8 md:py-16">
        {posterUrl && (
          <ImageWithSkeleton
            src={posterUrl}
            alt={title}
            fill
            containerClassName="hidden md:block w-48 lg:w-56 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-foreground/20"
            className="object-cover"
            sizes="(min-width: 1024px) 224px, 192px"
          />
        )}

        <div className="flex w-full max-w-2xl flex-col gap-4">
          {logoUrl ? (
            <ImageWithSkeleton
              src={logoUrl}
              alt={title}
              fill
              containerClassName="relative w-70 h-25 md:w-112.5 md:h-40 mb-2"
              className="object-contain object-left drop-shadow-hero-title"
              sizes="(max-width: 768px) 280px, 450px"
            />
          ) : (
            <h1 className="mb-2 font-bold text-4xl text-white leading-tight tracking-tight drop-shadow-hero-title md:text-6xl lg:text-7xl">
              {title}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3 font-medium text-sm text-white/90 md:text-base">
            {rating && (
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                <span className="font-semibold text-white drop-shadow-hero-text">
                  {rating}
                </span>
              </div>
            )}
            {metaBadges}
          </div>

          {userActions && <div className="mt-1">{userActions}</div>}

          {tagline && (
            <p className="mt-2 font-light text-base text-white/90 italic drop-shadow-hero-text md:text-lg">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {overview && (
            <p className="mt-1 line-clamp-5 text-sm text-white leading-relaxed drop-shadow-hero-text md:text-base">
              {overview}
            </p>
          )}

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map(({ id, name }) => (
                <Link key={id} href={`/genres/${genreBasePath}/${id}`}>
                  <Badge className="flex items-center gap-2 bg-primary/80 shadow-lg">
                    {name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {homepage && (
            <div className="mt-2">
              <LinkButton
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="border-foreground/20 bg-foreground/20 text-white shadow-lg hover:bg-foreground/10 hover:text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {officialWebsiteLabel}
              </LinkButton>
            </div>
          )}

          <div className="mt-6 grid w-full grid-cols-2 gap-4 border-white/10 border-t pt-6 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-medium text-white/80 text-xs uppercase tracking-wider drop-shadow-hero-text">
                  <stat.icon className="h-3 w-3" aria-hidden="true" />{" "}
                  {stat.label}
                </span>
                <span className="font-semibold text-sm text-white drop-shadow-hero-text">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
