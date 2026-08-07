import { getTranslations } from "next-intl/server";
import { tmdb } from "@/lib/tmdb";
import { InfinitePeopleGrid } from "@/components/people/infinite-people-grid";

export default async function PopularPeoplePage() {
  const t = await getTranslations("pages.people.popular");

  const response = await tmdb.getPopularPeople(1);

  if (!response.success) {
    throw new Error(response.error);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-12 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">{t("description")}</p>

      <div className="mt-8">
        <InfinitePeopleGrid
          initialPeople={response.data.results}
          totalPages={response.data.total_pages}
        />
      </div>
    </div>
  );
}
