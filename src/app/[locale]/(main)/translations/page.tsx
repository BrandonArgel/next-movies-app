import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-3xl shadow-lg">
        🎬
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-xl font-medium text-primary">{t("subtitle")}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      {/* Feature chips */}
      <div className="flex flex-wrap justify-center gap-2 pt-4">
        {[
          { icon: "🌙", label: "Light / Dark Mode" },
          { icon: "🎨", label: "Accent Colors" },
          { icon: "🌐", label: "Internationalization" },
        ].map(({ icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-card-foreground shadow-sm"
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
