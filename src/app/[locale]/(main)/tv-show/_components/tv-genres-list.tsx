import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { tmdb } from "@/lib/tmdb";

export async function TvGenresList() {
  const genresRes = await tmdb.getTVShowGenres();

  if (!genresRes.success) return null;

  const genres = genresRes.data.genres;

  if (!genres.length) return null;

  return (
    <section className="flex flex-wrap gap-4 gap-y-2">
      {genres.map(({ id, name }) => (
        <Link key={id} href={`/genres/tv-show/${id}`}>
          <Badge className="text-sm font-medium transition-colors">
            {name}
          </Badge>
        </Link>
      ))}
    </section>
  );
}
