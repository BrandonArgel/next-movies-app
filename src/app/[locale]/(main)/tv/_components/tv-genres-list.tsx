import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { getTvShowGenres } from "@/lib/api/genres";

export async function TvGenresList() {
  const genresRes = await getTvShowGenres();

  if (!genresRes.success) return null;

  const genres = genresRes.data.genres;

  if (!genres.length) return null;

  return (
    <section className="flex flex-wrap gap-4 gap-y-2">
      {genres.map(({ id, name }) => (
        <Link key={id} href={`/genres/tv-show/${id}`}>
          <Badge className="font-medium text-sm transition-colors">
            {name}
          </Badge>
        </Link>
      ))}
    </section>
  );
}
