import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { SearchBar } from "@/components/layout/search-bar";
import { Link } from "@/i18n/navigation";
import CinemaIcon from "@/assets/icons/cinema";
// Importamos nuestro nuevo componente cliente
import { DesktopNav, type NavMenuType } from "@/components/layout/desktop-nav";

// La configuración pura
const NAV_CONFIG = [
  {
    labelKey: "movies" as const,
    items: [
      { href: "/movies/popular", labelKey: "popular" as const },
      { href: "/movies/now-playing", labelKey: "nowPlaying" as const },
      { href: "/movies/upcoming", labelKey: "upcoming" as const },
      { href: "/movies/top-rated", labelKey: "topRated" as const },
    ],
  },
  {
    labelKey: "tvShows" as const,
    items: [
      { href: "/tv/airing-today", labelKey: "airingToday" as const },
      { href: "/tv/on-tv", labelKey: "onTv" as const },
      { href: "/tv/popular", labelKey: "popular" as const },
      { href: "/tv/top-rated", labelKey: "topRated" as const },
    ],
  },
  {
    labelKey: "people" as const,
    items: [{ href: "/people/popular", labelKey: "popular" as const }],
  },
] as const;

export async function Header() {
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  // 1. Pre-procesamos las traducciones en el servidor
  const translatedMenus: NavMenuType[] = NAV_CONFIG.map((menu) => ({
    label: tNav(menu.labelKey),
    items: menu.items.map((item) => ({
      href: item.href,
      label: tNav(item.labelKey),
    })),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav
        className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3"
        aria-label={tNav("navigation")}
      >
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex shrink-0 justify-center items-center font-semibold tracking-tight text-primary gap-2 text-2xl"
          aria-label={tCommon("appName")}
        >
          <CinemaIcon className="w-10" cupClassName="text-primary" />
          <span>{tCommon("appName")}</span>
        </Link>

        {/* Desktop nav (Delegado a un Client Component accesible) */}
        <DesktopNav menus={translatedMenus} />

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
