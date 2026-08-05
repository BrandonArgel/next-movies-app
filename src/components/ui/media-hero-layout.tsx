import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

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
  genreBasePath: "movie" | "tv-show";
  metaBadges: ReactNode;
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
  stats,
  officialWebsiteLabel,
}: MediaHeroLayoutProps) {
  return (
    <section
      className="relative w-full min-h-[70vh] flex items-end md:items-center bg-black"
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

      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 md:via-black/60 to-black/20 md:to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

      <div className="relative z-20 container mx-auto p-4 md:px-8 pb-10 md:py-16 flex flex-col md:flex-row items-start gap-8 max-w-6xl">
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

        <div className="flex flex-col gap-4 max-w-2xl w-full">
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
            <h1 className="text-4xl drop-shadow-hero-title md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-2">
              {title}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm md:text-base font-medium text-white/90">
            {rating && (
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                <span className="font-semibold drop-shadow-hero-text text-white">
                  {rating}
                </span>
              </div>
            )}
            {metaBadges}
          </div>

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map(({ id, name }) => (
                <Link key={id} href={`/genres/${genreBasePath}/${id}`}>
                  <Badge className="bg-primary/80 flex items-center gap-2 shadow-lg">
                    {name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {tagline && (
            <p className="text-white/90 drop-shadow-hero-text italic text-base md:text-lg font-light mt-2">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {overview && (
            <p className="text-white drop-shadow-hero-text text-sm md:text-base leading-relaxed line-clamp-5 mt-1">
              {overview}
            </p>
          )}

          {homepage && (
            <div className="mt-2">
              <LinkButton
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="text-white bg-foreground/20 shadow-lg hover:bg-foreground/10 hover:text-white border-foreground/20"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {officialWebsiteLabel}
              </LinkButton>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-white/80 drop-shadow-hero-text text-xs uppercase tracking-wider flex items-center gap-1.5 font-medium">
                  <stat.icon className="w-3 h-3" aria-hidden="true" />{" "}
                  {stat.label}
                </span>
                <span className="text-white drop-shadow-hero-text text-sm font-semibold">
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
