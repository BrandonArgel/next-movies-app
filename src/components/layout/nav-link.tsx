"use client";

import { usePathname } from "@/i18n/navigation";
import { LinkButton } from "../ui/button";
import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

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
          "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
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
        "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "after:absolute after:bottom-0 after:inset-s-3 after:inset-e-3 after:h-0.5 after:rounded-full after:transition-all",
        isActive
          ? "text-primary font-semibold after:bg-primary after:opacity-100 hover:text-primary"
          : "text-foreground/70 hover:text-foreground hover:bg-accent hover:after:bg-foreground",
        className,
      )}
    >
      {children}
    </LinkButton>
  );
}
