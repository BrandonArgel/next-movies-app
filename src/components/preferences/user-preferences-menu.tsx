"use client";

import { useSearchParams } from "next/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  GlobeIcon,
  LogOutIcon,
  LogInIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_META } from "./locale-meta";
import { cn } from "@/lib/utils";
import { ACCENT_COLORS, useColor } from "@/providers/color-provider";
import { getTMDBImageUrl } from "@/lib/get-tmdb-image-url";
import { BASE_GRAVATAR_URL } from "@/lib/constants";
import { Account } from "@/types/account";

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
  const tNav = useTranslations("components.nav");
  const tPreferences = useTranslations("components.preferences");

  const { theme, setTheme } = useTheme();
  const { color, setColor } = useColor();

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    router.replace(`${pathname}${query}`, { locale: next });
  }

  const tmdbPath = user?.avatar?.tmdb?.avatar_path;
  const gravatarHash = user?.avatar?.gravatar?.hash;
  const imgUrl = tmdbPath
    ? getTMDBImageUrl(tmdbPath)
    : `${BASE_GRAVATAR_URL}/${gravatarHash}`;

  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="icon" className="rounded-full">
        {user ? (
          <Avatar className="size-8 border-2 border-primary">
            <AvatarImage src={imgUrl ?? ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="flex justify-center items-center size-8 border-2 border-primary">
            <UserIcon className="size-5" />
          </Avatar>
        )}
      </Button>

      <DropdownMenu placement="bottom end" className="w-56">
        {/* User Information Header */}
        {user ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1.5 py-0.5 text-foreground">
                <span className="font-medium leading-none">
                  {user.username}
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
        ) : null}

        {user ? <DropdownMenuSeparator /> : null}

        {/* Preferences Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {tPreferences("theme.preferences")}
          </DropdownMenuLabel>

          {/* Theme Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunIcon className="mr-2 size-4 dark:hidden" />
              <MoonIcon className="mr-2 hidden size-4 dark:block" />
              <span>{tPreferences("theme.toggle_theme")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup
                selectionMode="single"
                selectedKeys={new Set([theme ?? "system"])}
              >
                <DropdownMenuItem
                  id="light"
                  onAction={() => setTheme("light")}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <SunIcon className="size-4" />
                  <span>{tPreferences("theme.light")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  id="dark"
                  onAction={() => setTheme("dark")}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <MoonIcon className="size-4" />
                  <span>{tPreferences("theme.dark")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  id="system"
                  onAction={() => setTheme("system")}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <MonitorIcon className="size-4" />
                  <span>{tPreferences("theme.system")}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Color Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon className="mr-2 size-4" />
              <span>{tPreferences("color.toggle_color")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup
                selectionMode="single"
                selectedKeys={new Set([color])}
              >
                {ACCENT_COLORS.map(({ key, previewClass }) => (
                  <DropdownMenuItem
                    key={key}
                    id={key}
                    onAction={() => setColor(key)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10",
                        previewClass,
                      )}
                    />
                    <span>{tPreferences(`color.${key}`)}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Language Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GlobeIcon className="mr-2 size-4" />
              <span>{tPreferences("language.toggle_language")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup
                selectionMode="single"
                selectedKeys={new Set([locale])}
                className="max-h-75 overflow-y-auto"
              >
                {routing.locales.map((loc) => {
                  const { flag, nativeName } = LOCALE_META[loc];
                  return (
                    <DropdownMenuItem
                      key={loc}
                      id={loc}
                      onAction={() => switchLocale(loc as Locale)}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <span aria-hidden="true" className="shrink-0 text-base">
                        {flag}
                      </span>
                      <span className="flex-1 truncate">{nativeName}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Authentication State Section */}
        <DropdownMenuGroup>
          {user ? (
            <DropdownMenuItem
              variant="destructive"
              onAction={onLogout}
              className="flex cursor-pointer items-center gap-2"
            >
              <LogOutIcon className="size-4" />
              <span>{tGlobal("actions.logout")}</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onAction={onLogin}
              className="flex cursor-pointer items-center gap-2"
            >
              <LogInIcon className="size-4" />
              <span>{tGlobal("actions.login")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
