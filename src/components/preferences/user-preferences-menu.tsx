"use client";

import { useTransition } from "react";
import {
  GlobeIcon,
  LogInIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Dialog } from "react-aria-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { BASE_GRAVATAR_URL } from "@/lib/constants";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { cn } from "@/lib/utils";
import { useColor } from "@/providers/color-provider";
import { ACCENT_COLORS } from "@/lib/colors";
import type { Account } from "@/types/account";
import { LOCALE_META } from "./locale-meta";

interface UserPreferencesMenuProps {
  user?: Account;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function UserPreferencesMenu({
  user,
  onLogin,
  onLogout,
}: UserPreferencesMenuProps) {
  const tGlobal = useTranslations("global");
  const tPreferences = useTranslations("components.preferences");

  const { theme, setTheme } = useTheme();
  const { color, setColor } = useColor();

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  function switchLocale(next: Locale) {
    if (next === locale) return;
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString() ? `?${params.toString()}` : "";

    startTransition(() => {
      router.replace(`${pathname}${query}`, { locale: next });
    });
  }

  const tmdbPath = user?.avatar?.tmdb?.avatar_path;
  const gravatarHash = user?.avatar?.gravatar?.hash;
  const imgUrl = tmdbPath
    ? getTMDBImageUrl(tmdbPath)
    : `${BASE_GRAVATAR_URL}/${gravatarHash}`;

  return (
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        isDisabled={isPending}
      >
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}

        {user ? (
          <Avatar className="size-8 border-2 border-primary">
            <AvatarImage src={imgUrl ?? ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="flex size-8 items-center justify-center border-2 border-primary">
            <UserIcon className="size-5" />
          </Avatar>
        )}
      </Button>

      <Popover
        placement="bottom end"
        className="w-64 max-h-[85dvh] overflow-y-auto p-2"
      >
        <Dialog className="flex flex-col outline-none">
          {user && (
            <>
              <div className="px-2 py-1.5 text-sm font-medium">
                {user.username}
              </div>
              <div className="my-1 h-px bg-border" />
            </>
          )}

          <Accordion className="w-full">
            {/* Theme Section */}
            <AccordionItem id="theme" className="border-b-0">
              <AccordionTrigger className="px-2 py-2 hover:bg-muted hover:no-underline rounded-sm">
                <span className="flex items-center gap-2">
                  <SunIcon className="size-4 dark:hidden" />
                  <MoonIcon className="hidden size-4 dark:block" />
                  {tPreferences("theme.preferences")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1 px-1 pb-2 pt-1">
                <Button
                  variant={theme === "light" ? "secondary" : "ghost"}
                  className="h-8 w-full justify-start px-2 font-normal"
                  onPress={() => setTheme("light")}
                >
                  <SunIcon className="mr-2 size-4" />
                  {tPreferences("theme.light")}
                </Button>
                <Button
                  variant={theme === "dark" ? "secondary" : "ghost"}
                  className="h-8 w-full justify-start px-2 font-normal"
                  onPress={() => setTheme("dark")}
                >
                  <MoonIcon className="mr-2 size-4" />
                  {tPreferences("theme.dark")}
                </Button>
                <Button
                  variant={theme === "system" ? "secondary" : "ghost"}
                  className="h-8 w-full justify-start px-2 font-normal"
                  onPress={() => setTheme("system")}
                >
                  <MonitorIcon className="mr-2 size-4" />
                  {tPreferences("theme.system")}
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Color Section */}
            <AccordionItem id="color" className="border-b-0">
              <AccordionTrigger className="px-2 py-2 hover:bg-muted hover:no-underline rounded-sm">
                <span className="flex items-center gap-2">
                  <PaletteIcon className="size-4" />
                  {tPreferences("color.label")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex max-h-48 flex-col gap-1 overflow-y-auto px-1 pb-2 pt-1">
                {ACCENT_COLORS.map(({ key, previewClass }) => (
                  <Button
                    key={key}
                    variant={color === key ? "secondary" : "ghost"}
                    className="h-8 w-full justify-start px-2 font-normal"
                    onPress={() => setColor(key)}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mr-2 size-3.5 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10",
                        previewClass,
                      )}
                    />
                    {tPreferences(`color.${key}`)}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Language Section */}
            <AccordionItem id="language" className="border-b-0">
              <AccordionTrigger className="px-2 py-2 hover:bg-muted hover:no-underline rounded-sm">
                <span className="flex items-center gap-2">
                  <GlobeIcon className="size-4" />
                  {tPreferences("language.label")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex max-h-48 flex-col gap-1 overflow-y-auto px-1 pb-2 pt-1">
                {routing.locales.map((loc) => {
                  const { flag, nativeName } = LOCALE_META[loc];
                  return (
                    <Button
                      key={loc}
                      variant={locale === loc ? "secondary" : "ghost"}
                      className="h-8 w-full justify-start px-2 font-normal"
                      onPress={() => switchLocale(loc as Locale)}
                    >
                      <span aria-hidden="true" className="mr-3 text-base">
                        {flag}
                      </span>
                      <span className="truncate">{nativeName}</span>
                    </Button>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="my-1 h-px bg-border" />

          {/* Authentication Action */}
          <div className="px-1 py-1">
            {user ? (
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
                onPress={onLogout}
              >
                <LogOutIcon className="mr-2 size-4" />
                {tGlobal("actions.logout")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 font-normal"
                onPress={onLogin}
              >
                <LogInIcon className="mr-2 size-4" />
                {tGlobal("actions.login")}
              </Button>
            )}
          </div>
        </Dialog>
      </Popover>
    </PopoverTrigger>
  );
}
