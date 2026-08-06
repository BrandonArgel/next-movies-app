"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon, XIcon, FilmIcon, TvIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ColorToggle } from "@/components/theme/color-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { NavLink } from "@/components/layout/nav-link";
import { SearchBar } from "@/components/layout/search-bar";
import {
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const TOP_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/categories", labelKey: "categories" as const },
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
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
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

export function MobileDrawer() {
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
            <SheetTitle className="text-lg font-semibold">
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

        {/* Search */}
        <div className="px-4 md:hidden">
          <SearchBar variant="expanded" />
        </div>

        <nav
          aria-label={tNav("navigation")}
          className="flex flex-col flex-1 px-4 gap-1 overflow-y-auto"
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

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
              {tNav("settings")}
            </p>
            <div
              className="flex items-center gap-2 px-3"
              role="toolbar"
              aria-label={tNav("settings")}
            >
              <ThemeToggle />
              <ColorToggle />
              <LanguageToggle />
            </div>
          </div>
        </nav>

        <SheetFooter />
      </SheetContent>
    </SheetTrigger>
  );
}
