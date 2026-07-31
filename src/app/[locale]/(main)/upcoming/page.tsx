import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("upcoming");
  return { title: t("title"), description: t("description") };
}

export default async function UpcomingPage() {
  const t = await getTranslations("upcoming");
  const data = await tmdb.getUpcoming(1);

  return (
    <main className="flex flex-col w-full min-h-screen pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-8 pt-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <InfiniteMovieGrid
          initialMovies={data.results}
          totalPages={data.total_pages}
          type="upcoming"
        />
      </div>
    </main>
  );
}
