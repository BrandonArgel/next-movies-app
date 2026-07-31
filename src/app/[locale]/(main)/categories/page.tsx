import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("categories");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CategoriesPage() {
  const t = await getTranslations("categories");

  return (
    <main className="flex flex-col w-full min-h-screen pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-8 pt-16">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>
    </main>
  );
}
