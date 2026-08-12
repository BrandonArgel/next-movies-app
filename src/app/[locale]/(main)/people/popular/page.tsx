import { getTranslations } from "next-intl/server";
import { InfinitePeopleGrid } from "@/components/people/infinite-people-grid";
import { getPopularPeople } from "@/lib/api/people";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.people.popular" });
  return { title: t("title") };
}

export default async function PopularPeoplePage() {
  const t = await getTranslations("pages.people.popular");

  const response = await getPopularPeople(1);

  if (!response.success) {
    throw new Error(response.error);
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-8 xl:px-12">
      <h1 className="font-bold text-4xl tracking-tight">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("description")}</p>

      <div className="mt-8">
        <InfinitePeopleGrid
          initialPeople={response.data.results}
          totalPages={response.data.total_pages}
        />
      </div>
    </div>
  );
}
