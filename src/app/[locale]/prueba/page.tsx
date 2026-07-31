"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { sileo } from "sileo"; // Asegúrate de importar sileo según tu configuración

export default function HomePage() {
  // 1. Obtenemos el idioma activo usando el hook useLocale
  const locale = useLocale();

  // 2. Usamos el hook useTranslations en lugar de getTranslations (no necesita await)
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  // 3. Ahora el useEffect funcionará perfectamente
  useEffect(() => {
    sileo.success({ title: `Locale changed to ${locale}` });
  }, [locale]);

  return (
    <main className="flex min-h-svh flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold tracking-tight text-primary">
            {/* Las traducciones se usan igual que antes */}
            {tCommon("appName")}
          </span>
          <div
            className="flex items-center gap-2"
            role="toolbar"
            aria-label="Preferences"
          >
            <ThemeToggle />
            <ColorToggle />
            <LanguageToggle />
          </div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
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
    </main>
  );
}
