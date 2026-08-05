"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchIcon, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  variant?: "compact" | "expanded";
}

export function SearchBar({ className, variant = "compact" }: SearchBarProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") ?? "";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get("q") as string | null)?.trim() ?? "";

    if (!q) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    });
  };

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
          {isPending ? (
            <Loader2
              className="size-4 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <SearchIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </InputGroupAddon>

        <InputGroupInput
          key={currentQuery}
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder={t("placeholder")}
          aria-label={t("label")}
          autoComplete="off"
          disabled={isPending}
        />
      </InputGroup>
    </form>
  );
}
