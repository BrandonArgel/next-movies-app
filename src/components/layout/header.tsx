import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { NavLink } from "@/components/layout/nav-link";
import { SearchBar } from "@/components/layout/search-bar";
import { Link } from "@/i18n/navigation";
import CinemaIcon from "@/assets/icons/cinema";

const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/trending", labelKey: "trendingMovies" as const },
  { href: "/categories", labelKey: "categories" as const },
  { href: "/popular", labelKey: "popular" as const },
  { href: "/upcoming", labelKey: "upcoming" as const },
] as const;

export async function Header() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav
        className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3"
        aria-label={tNav("navigation")}
      >
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex shrink-0 justify-center items-end font-semibold tracking-tight text-primary gap-2 text-2xl"
          aria-label={tCommon("appName")}
        >
          <CinemaIcon className="w-10" cupClassName="text-primary" />
          <span>{tCommon("appName")}</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5 flex-1" role="list">
          {NAV_LINKS.map(({ href, labelKey }) => (
            <li key={href}>
              <NavLink href={href} variant="desktop">
                {tNav(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Search — desktop */}
        <div className="hidden md:block">
          <SearchBar variant="compact" />
        </div>

        {/* Desktop controls */}
        <div
          className="hidden md:flex items-center gap-2"
          role="toolbar"
          aria-label={tNav("settings")}
        >
          <ThemeToggle />
          <ColorToggle />
          <LanguageToggle />
        </div>

        {/* Hamburger — mobile only */}
        <MobileDrawer />
      </nav>
    </header>
  );
}
