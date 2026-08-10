"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
}

export function ImageWithSkeleton({
  containerClassName,
  className,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        props.fill && "h-full w-full",
        containerClassName,
      )}
    >
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={cn(
          "transition-all duration-500",
          isLoading
            ? "scale-95 opacity-0 blur-sm"
            : "scale-100 opacity-100 blur-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}
