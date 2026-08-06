"use client";

import * as React from "react";
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
    <ul className="hidden xl:flex items-center gap-1 flex-1 ml-4" role="list">
      {menus.map((menu) => (
        <li key={menu.label}>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="group flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-expanded:bg-muted data-expanded:text-foreground transition-colors"
            >
              {menu.label}
              <ChevronDown
                className="w-4 h-4 transition-transform duration-200 group-data-expanded:rotate-180"
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
