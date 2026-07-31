"use client";

import { useTranslations } from "next-intl";
import { PaletteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCENT_COLORS, useColor } from "@/providers/color-provider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ColorToggle() {
  const { color, setColor } = useColor();
  const t = useTranslations("color");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedKeys = new Set([color]);

  return (
    <DropdownMenuTrigger>
      <Button variant="outline" size="icon" aria-label={t("toggleColor")}>
        <PaletteIcon
          className={`size-4 transition-opacity ${!mounted ? "opacity-50" : "opacity-100"}`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuGroup selectionMode="single" selectedKeys={selectedKeys}>
          {ACCENT_COLORS.map(({ key, previewClass }) => (
            <DropdownMenuItem
              key={key}
              id={key}
              onAction={() => setColor(key)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-3.5 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10",
                  previewClass,
                )}
              />
              <span>{t(key)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
