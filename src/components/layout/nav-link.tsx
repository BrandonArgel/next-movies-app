"use client";

import type { ComponentProps } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LinkButton } from "../ui/button";

type Href = ComponentProps<typeof LinkButton>["href"];

interface NavLinkProps {
  href: Href;
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  variant?: "desktop" | "mobile";
}

export function NavLink({
  href,
  children,
  className,
  onPress,
  variant = "desktop",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (variant === "mobile") {
    return (
      <LinkButton
        href={href}
        variant="ghost"
        onPress={onPress}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center justify-start rounded-md px-3 py-2.5 font-medium text-sm transition-colors",
          isActive
            ? "bg-primary/10 font-semibold text-primary"
            : "text-foreground/70 hover:bg-accent hover:text-foreground",
          className,
        )}
      >
        {children}
      </LinkButton>
    );
  }

  return (
    <LinkButton
      href={href}
      variant="ghost"
      onPress={onPress}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-md px-3 py-2 font-medium text-sm transition-colors",
        "after:absolute after:inset-e-3 after:inset-s-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-all",
        isActive
          ? "font-semibold text-primary after:bg-primary after:opacity-100 hover:text-primary"
          : "text-foreground/70 hover:bg-accent hover:text-foreground hover:after:bg-foreground",
        className,
      )}
    >
      {children}
    </LinkButton>
  );
}
