"use client";

import { useCallback, useTransition } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  /** Compact mode for the header; expanded for mobile drawer */
  variant?: "compact" | "expanded";
}

export function SearchBar({ className, variant = "compact" }: SearchBarProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const q = (fd.get("q") as string | null)?.trim() ?? "";
      if (!q) return;
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      });
    },
    [router],
  );

  // Pre-fill with current query when already on search page
  const currentQuery =
    typeof window !== "undefined" && pathname === "/search"
      ? new URLSearchParams(window.location.search).get("q") ?? ""
      : "";

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={handleSubmit}
      className={cn(
        variant === "expanded" ? "w-full" : "w-48 lg:w-64",
        className,
      )}
    >
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon
            className={cn("size-4", isPending ? "animate-pulse opacity-50" : "")}
            aria-hidden="true"
          />
        </InputGroupAddon>

        <InputGroupInput
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder={t("placeholder")}
          aria-label={t("label")}
          autoComplete="off"
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            aria-label={t("submit")}
          >
            <span className="sr-only">{t("submit")}</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
