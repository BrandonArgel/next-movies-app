import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import CinemaIcon from "@/assets/icons/cinema";

export async function Header() {
  const tCommon = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-4xl inline-flex justify-center items-end font-semibold tracking-tight text-primary gap-2">
          <CinemaIcon className="w-12" cupClassName="text-primary" />
          {tCommon("appName")}
        </h1>
        <div>
          <ul></ul>
        </div>
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
  );
}
