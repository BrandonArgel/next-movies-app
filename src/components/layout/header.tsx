import { getTranslations } from "next-intl/server";
import { initiateTMDBLogin, logoutTMDB } from "@/actions/auth";
import CinemaIcon from "@/assets/icons/cinema";
import { DesktopNav, type NavMenuType } from "@/components/layout/desktop-nav";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { SearchBar } from "@/components/layout/search-bar";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/lib/auth-utils";
import { UserPreferencesMenu } from "../preferences/user-preferences-menu";

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
  {
    labelKey: "genres" as const,
    items: [{ href: "/genres", labelKey: "genres" as const }],
  },
] as const;

const USER_NAV_CONFIG = [
  {
    labelKey: "user" as const,
    items: [
      { href: "/favorites", labelKey: "favorites" as const },
      { href: "/watch-later", labelKey: "list" as const },
      { href: "/rated-movies", labelKey: "ratings" as const },
    ],
  },
];

export async function Header() {
  const { user } = await requireUser();

  const [tGlobal, tNav] = await Promise.all([
    getTranslations("global.branding"),
    getTranslations("components.nav"),
  ]);

  const activeMenus = user ? [...USER_NAV_CONFIG, ...NAV_CONFIG] : NAV_CONFIG;

  const translatedMenus: NavMenuType[] = activeMenus.map((menu) => ({
    label: tNav(menu.labelKey),
    items: menu.items.map((item) => ({
      href: item.href,
      label: tNav(item.labelKey),
    })),
  }));

  return (
    <header className="sticky top-0 z-40 border-border border-b bg-background/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3"
        aria-label={tNav("navigation")}
      >
        <Link
          href="/"
          className="inline-flex shrink-0 items-center justify-center gap-2 font-semibold text-2xl text-primary tracking-tight"
          aria-label={tGlobal("app_name")}
        >
          <CinemaIcon className="w-10" cupClassName="text-primary" />
          <span>{tGlobal("app_name")}</span>
        </Link>

        <DesktopNav menus={translatedMenus} />

        <div className="flex-1 xl:hidden" />

        <div className="hidden md:block">
          <SearchBar variant="compact" />
        </div>

        <UserPreferencesMenu
          user={user}
          onLogin={initiateTMDBLogin}
          onLogout={logoutTMDB}
        />

        <MobileDrawer isAuthenticated={Boolean(user)} />
      </nav>
    </header>
  );
}
