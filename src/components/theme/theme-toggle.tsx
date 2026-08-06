"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type ThemeOption = {
  value: "light" | "dark" | "system";
  icon: React.ComponentType<{ className?: string }>;
  labelKey: "light" | "dark" | "system";
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", icon: SunIcon, labelKey: "light" },
  { value: "dark", icon: MoonIcon, labelKey: "dark" },
  { value: "system", icon: MonitorIcon, labelKey: "system" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("components.preferences.theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CurrentIcon = !mounted
    ? MonitorIcon
    : theme === "dark"
      ? MoonIcon
      : theme === "light"
        ? SunIcon
        : MonitorIcon;

  const selectedKeys = new Set([theme ?? "system"]);

  return (
    <DropdownMenuTrigger>
      <Button variant="outline" size="icon" aria-label={t("toggle_theme")}>
        <CurrentIcon
          className={`size-4 transition-opacity ${!mounted ? "opacity-50" : "opacity-100"}`}
          suppressHydrationWarning
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuGroup selectionMode="single" selectedKeys={selectedKeys}>
          {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
            <DropdownMenuItem
              key={value}
              id={value}
              className="flex items-center gap-2 cursor-pointer"
              onAction={() => setTheme(value)}
            >
              <Icon className="size-4" />
              <span>{t(labelKey)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
