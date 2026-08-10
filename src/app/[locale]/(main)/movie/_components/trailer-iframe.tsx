"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TrailerIframe({
  trailerKey,
  title,
}: {
  trailerKey: string;
  title: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border">
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}
      <iframe
        src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
