import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { InfiniteMovieGrid } from "@/components/movies/infinite-movie-grid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("now_playing");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function NowPlayingPage() {
  const t = await getTranslations("now_playing");
  const response = await tmdb.getNowPlaying(1);

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
            type="now-playing"
          />
        </div>
      </div>
    </main>
  );
}
