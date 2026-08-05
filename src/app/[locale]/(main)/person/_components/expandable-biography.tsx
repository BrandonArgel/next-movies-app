"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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
          "text-sm text-foreground leading-relaxed transition-all duration-200",
          !isExpanded && "line-clamp-5",
        )}
      >
        {text}
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="text-sm font-semibold text-primary hover:underline self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        {isExpanded ? dictionary.readLess : dictionary.readMore}
      </button>
    </div>
  );
}
