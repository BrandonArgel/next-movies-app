import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";

export default async function UpcomingPage() {
  const t = await getTranslations("upcoming");
  const response = await tmdb.getUpcoming(1);

  if (!response.success) {
    throw new Error(response.error);
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">{t("description")}</p>
        <div className="mt-12">
          <InfiniteMovieGrid
            initialMovies={response.data.results}
            totalPages={response.data.total_pages}
            type="upcoming"
          />
        </div>
      </div>
    </main>
  );
}
