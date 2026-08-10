"use client";

import {
  FilmIcon,
  MenuIcon,
  TvIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
  XIcon,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { useState } from "react";
import { NavLink } from "@/components/layout/nav-link";
import { SearchBar } from "@/components/layout/search-bar";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TOP_LINKS = [{ href: "/", labelKey: "home" as const }] as const;

const USER_LINKS = [
  { href: "/favorites", labelKey: "favorites" as const },
  { href: "/watch-later", labelKey: "list" as const },
  { href: "/rated-movies", labelKey: "ratings" as const },
] as const;

const MOVIE_LINKS = [
  { href: "/movies/popular", labelKey: "popular" as const },
  { href: "/movies/now-playing", labelKey: "now_playing" as const },
  { href: "/movies/upcoming", labelKey: "upcoming" as const },
  { href: "/movies/top-rated", labelKey: "top_rated" as const },
] as const;

const TV_LINKS = [
  { href: "/tv/airing-today", labelKey: "airing_today" as const },
  { href: "/tv/on-the-air", labelKey: "on_the_air" as const },
  { href: "/tv/popular", labelKey: "popular" as const },
  { href: "/tv/top-rated", labelKey: "top_rated" as const },
] as const;

const PEOPLE_LINKS = [
  { href: "/people/popular", labelKey: "popular" as const },
] as const;

const GENRES_LINKS = [
  { href: "/genres", labelKey: "genres" as const },
] as const;

interface NavSectionProps {
  label: string;
  icon: ReactNode;
  links: readonly { href: string; labelKey: string }[];
  tNav: ReturnType<typeof useTranslations<"nav">>;
  onClose: () => void;
}

function NavSection({ label, icon, links, tNav, onClose }: NavSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-1">
        <span className="text-foreground">{icon}</span>
        <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
          {label}
        </p>
      </div>
      <ul>
        {links.map(({ href, labelKey }) => (
          <li key={href} className="flex flex-col">
            <NavLink href={href} variant="mobile" onPress={onClose}>
              {tNav(labelKey as Parameters<typeof tNav>[0])}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface MobileDrawerProps {
  isAuthenticated: boolean;
}

export function MobileDrawer({ isAuthenticated }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tGlobal = useTranslations("global.branding");
  const tNav = useTranslations("components.nav");

  const close = () => setIsOpen(false);

  return (
    <SheetTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={tNav("open_menu")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="xl:hidden"
      >
        <MenuIcon className="size-5" />
      </Button>

      <SheetContent side="left" showCloseButton={false}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-primary font-semibold text-lg">
              {tGlobal("app_name")}
            </SheetTitle>
            <SheetClose
              variant="ghost"
              size="icon-sm"
              aria-label={tNav("close_menu")}
            >
              <XIcon className="size-4" />
            </SheetClose>
          </div>
        </SheetHeader>

        <Separator className="my-3" />

        {/* Search */}
        <div className="px-4 md:hidden">
          <SearchBar variant="expanded" />
        </div>

        <nav
          aria-label={tNav("navigation")}
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4"
        >
          {/* Top-level links */}
          <ul className="flex flex-col gap-0.5">
            {TOP_LINKS.map(({ href, labelKey }) => (
              <li key={href}>
                <NavLink href={href} variant="mobile" onPress={close}>
                  {tNav(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <Separator className="my-3" />

          {isAuthenticated && (
            <NavSection
              label={tNav("user")}
              icon={<UserIcon className="size-3.5" />}
              links={USER_LINKS}
              tNav={tNav}
              onClose={close}
            />
          )}

          <NavSection
            label={tNav("movies")}
            icon={<FilmIcon className="size-3.5" />}
            links={MOVIE_LINKS}
            tNav={tNav}
            onClose={close}
          />

          <Separator className="my-3" />

          <NavSection
            label={tNav("tv_shows")}
            icon={<TvIcon className="size-3.5" />}
            links={TV_LINKS}
            tNav={tNav}
            onClose={close}
          />

          <Separator className="my-3" />

          <NavSection
            label={tNav("people")}
            icon={<UsersIcon className="size-3.5" />}
            links={PEOPLE_LINKS}
            tNav={tNav}
            onClose={close}
          />

          <Separator className="my-3" />

          <NavSection
            label={tNav("genres")}
            icon={<TagIcon className="size-3.5" />}
            links={GENRES_LINKS}
            tNav={tNav}
            onClose={close}
          />
        </nav>

        <SheetFooter>
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-1">
              <span className="text-foreground">
                <SettingsIcon className="size-3.5" />
              </span>
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                {tNav("settings")}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3"
              role="toolbar"
              aria-label={tNav("settings")}
            >
              <ThemeToggle />
              <ColorToggle />
              <LanguageToggle />
            </div>
          </div> */}
        </SheetFooter>
      </SheetContent>
    </SheetTrigger>
  );
}
