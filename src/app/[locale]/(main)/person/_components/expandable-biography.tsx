"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ExpandableBiographyProps {
  text: string;
  className?: string;
  maxLength?: number;
  dictionary: {
    readMore: string;
    readLess: string;
    noBiography: string;
  };
}

export function ExpandableBiography({
  text,
  className,
  maxLength = 300,
  dictionary,
}: ExpandableBiographyProps) {
  const t = useTranslations("domains.person");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return (
      <p className={cn("text-sm text-muted-foreground italic", className)}>
        {dictionary.noBiography}
      </p>
    );
  }

  if (text.length <= maxLength) {
    return (
      <p className={cn("text-sm text-foreground leading-relaxed", className)}>
        {text}
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p
        className={cn(
          "text-sm text-foreground leading-relaxed",
          !isExpanded && "line-clamp-5",
        )}
      >
        {text}
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-semibold text-primary hover:underline self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        aria-expanded={isExpanded}
        aria-controls="biography-content"
        aria-label={
          isExpanded ? t("hide_biography_aria") : t("show_biography_aria")
        }
      >
        {isExpanded ? dictionary.readLess : dictionary.readMore}
      </button>
    </div>
  );
}
