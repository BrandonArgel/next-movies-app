"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavMenuType = {
  label: string;
  items: {
    href: string;
    label: string;
  }[];
};

interface DesktopNavProps {
  menus: NavMenuType[];
}

export function DesktopNav({ menus }: DesktopNavProps) {
  return (
    <ul className="ml-4 hidden flex-1 items-center gap-1 xl:flex">
      {menus.map((menu) => (
        <li key={menu.label}>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="group flex items-center gap-1 px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground data-expanded:bg-muted data-expanded:text-foreground"
            >
              {menu.label}
              <ChevronDown
                className="h-4 w-4 transition-transform duration-200 group-data-expanded:rotate-180"
                aria-hidden="true"
              />
            </Button>

            <DropdownMenu className="min-w-45">
              {menu.items.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  href={item.href}
                  className="cursor-pointer"
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenu>
          </DropdownMenuTrigger>
        </li>
      ))}
    </ul>
  );
}
