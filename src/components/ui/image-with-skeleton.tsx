"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
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
        props.fill && "w-full h-full",
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
            ? "opacity-0 scale-95 blur-sm"
            : "opacity-100 scale-100 blur-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}
