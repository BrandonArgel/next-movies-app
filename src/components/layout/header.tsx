import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { SearchBar } from "@/components/layout/search-bar";
import { Link } from "@/i18n/navigation";
import CinemaIcon from "@/assets/icons/cinema";
import { DesktopNav, type NavMenuType } from "@/components/layout/desktop-nav";

const NAV_CONFIG = [
  {
    labelKey: "movies" as const,
    items: [
      { href: "/movies/popular", labelKey: "popular" as const },
      { href: "/movies/now-playing", labelKey: "now_playing" as const },
      { href: "/movies/upcoming", labelKey: "upcoming" as const },
      { href: "/movies/top-rated", labelKey: "top_rated" as const },
    ],
  },
  {
    labelKey: "tv_shows" as const,
    items: [
      { href: "/tv/airing-today", labelKey: "airing_today" as const },
      { href: "/tv/on-the-air", labelKey: "on_the_air" as const },
      { href: "/tv/popular", labelKey: "popular" as const },
      { href: "/tv/top-rated", labelKey: "top_rated" as const },
    ],
  },
  {
    labelKey: "people" as const,
    items: [{ href: "/people/popular", labelKey: "popular" as const }],
  },
] as const;

const USER_NAV_CONFIG = [
  {
    labelKey: "user" as const,
    items: [
      { href: "/my-favorites", labelKey: "favorites" as const },
      { href: "/my-list", labelKey: "list" as const },
      { href: "/my-ratings", labelKey: "ratings" as const },
    ],
  },
];

export async function Header() {
  const tGlobal = await getTranslations("global.branding");
  const tNav = await getTranslations("components.nav");

  const translatedMenus: NavMenuType[] = [...NAV_CONFIG].map((menu) => ({
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
          aria-label={tGlobal("app_name")}
        >
          <CinemaIcon className="w-10" cupClassName="text-primary" />
          <span>{tGlobal("app_name")}</span>
        </Link>

        {/* Desktop nav */}
        <DesktopNav menus={translatedMenus} />

        {/* Spacer on mobile */}
        <div className="flex-1 xl:hidden" />

        {/* Search — desktop */}
        <div className="hidden md:block">
          <SearchBar variant="compact" />
        </div>

        {/* Desktop controls */}
        <div
          className="hidden xl:flex items-center gap-2"
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
