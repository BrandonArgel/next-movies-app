"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon, XIcon } from "lucide-react";
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

const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/trending", labelKey: "trendingMovies" as const },
  { href: "/categories", labelKey: "categories" as const },
  { href: "/popular", labelKey: "popular" as const },
  { href: "/upcoming", labelKey: "upcoming" as const },
] as const;

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <SheetTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={tNav("openMenu")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="md:hidden"
      >
        <MenuIcon className="size-5" />
      </Button>

      <SheetContent side="left" showCloseButton={false}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              {tCommon("appName")}
            </SheetTitle>
            <SheetClose
              variant="ghost"
              size="icon-sm"
              aria-label={tNav("closeMenu")}
            >
              <XIcon className="size-4" />
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Search */}
        <div className="px-4">
          <SearchBar variant="expanded" />
        </div>

        <nav aria-label={tNav("navigation")} className="flex flex-col flex-1 px-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, labelKey }) => (
              <li key={href}>
                <NavLink
                  href={href}
                  variant="mobile"
                  onClick={() => setIsOpen(false)}
                >
                  {tNav(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

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
